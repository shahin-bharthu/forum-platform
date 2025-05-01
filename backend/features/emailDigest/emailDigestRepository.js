import { Op } from "sequelize";
import { db } from "../../config/connection.js";
import { CustomError } from "../../util/customError.js";

const getFrequency = async (id, forumId) => {
  const frequency = await db.UserMembership.findOne({
    where: { forum_id: forumId, user_id: id },
  });
  if (!frequency) {
    throw new CustomError("No frequency found for given forum", 404);
  }
  return frequency.digestFreqency;
};

const updateFrequency = async (id, forumId, frequency) => {
  const frequencyRecord = await db.UserMembership.findOne({
    where: { forum_id: forumId, user_id: id },
  });
  if (!frequencyRecord) {
    throw new CustomError("No frequency found for given forum", 404);
  }
  await frequencyRecord.update({
    digestFreqency: frequency,
  });
  await frequencyRecord.save();
  return frequencyRecord;
};

const getDigest = async () => {

  let dailyDigest = [];
  let weeklyDigest = [];
  let monthlyDigest = [];

  const users = await db.UserMembership.findAll({
    attributes: [ 'user_id', "digestFreqency"],
    group:["user_id", "digestFreqency"],
  })

  users.forEach( (user) => {
    const userToSend= {userId: user.user_id, frequency: user.digestFreqency};
    if(user.digestFreqency === "DAILY"){
      dailyDigest.push(userToSend);
    }
    if(user.digestFreqency === "WEEKLY"){
      weeklyDigest.push(userToSend);
    }
    if(user.digestFreqency === "MONTHLY"){
      monthlyDigest.push(userToSend);
    }
    
  });

  return {
    dailyDigest,
    weeklyDigest,
    monthlyDigest,
  };
};

const getRecentTopics = async (id, frequency) => {
  const userSubscriptions = await db.UserMembership.findAll({
    where: { user_id: id, digestFreqency:frequency },
  });

  let timeWindowStart;
  const now = new Date();
  if (frequency === "DAILY") {
    timeWindowStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  } else if (frequency === "WEEKLY") {
    timeWindowStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (frequency === "MONTHLY") {
    timeWindowStart = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
  } else {
    throw new CustomError("Invalid frequency", 400);
  }
  const recentPosts = await Promise.all(
    userSubscriptions.map(async (subscription) => {
      const topics = await db.Topic.findAll({
        where: {
          forum_id: subscription.forum_id,
          createdAt: { [Op.gte]: timeWindowStart },
          createdBy: { [Op.ne]: id },
        },
        order: [["createdAt", "DESC"]],
        include: [{ model: db.Forum, as: "forum", attributes: ["name"] }],
      });
      return topics;
    })
  );

  const allPosts = recentPosts.filter((posts) => posts && posts.length > 0).flat();

  return allPosts;
};

export { getFrequency, updateFrequency, getDigest, getRecentTopics };
