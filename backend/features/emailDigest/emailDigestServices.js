import * as emailDigestRepository from "./emailDigestRepository.js";
import { CustomError } from "../../util/customError.js";
import sendEmail from "../../util/sendEmail.js";
import {noDigestTemplate} from "./emailTemplate.js";
import {buildDigestTemplate} from "./emailTemplate.js";
import { getUserById } from "../user/userRepository.js";
const getFrequency = async (id, forumId) => {
  const frequency = await emailDigestRepository.getFrequency(id, forumId);
  if (!frequency) {
    throw new CustomError(
      `Frequency with forum-id ${forumId} and userId ${id} not found`,
      404
    );
  }
  return frequency;
};

const updateFrequency = async (id, forumId, frequency) => {
  const frequencyRecord = await emailDigestRepository.updateFrequency(
    id,
    forumId,
    frequency
  );
  if (!frequencyRecord) {
    throw new CustomError(
      `Frequency with forum-id ${forumId} and userId ${id} not found`,
      404
    );
  }
  return frequencyRecord;
};

const getUsersForDigest = async () => {
  const users = await emailDigestRepository.getDigest();

  if (!users) {
    throw new CustomError("No digest found", 404);
  }

  return users;
};

const sendEmailDigest = async (userId, frequency) => {
  const recentPosts = await emailDigestRepository.getRecentTopics(userId, frequency);
  const user = await getUserById(userId);
  

  const getSubject = (frequency, hasPosts) => {
    if (!hasPosts) return "No new activities for you, your communities await!";
  
    const map = {
      DAILY: "Here’s what’s new in your forums today!",
      WEEKLY: "Your weekly forum highlights are ready!",
      MONTHLY: "Here’s what you missed this month",
    };
    return map[frequency] || "Your forum updates";
  };
  const subject = getSubject(frequency, recentPosts && recentPosts.length > 0);


  if (!recentPosts || recentPosts.length === 0) {
    await sendEmail({
      from: "booknook@gmail.com",
      to: user.email,
      subject,
      html: noDigestTemplate(user,frequency),
    });
  } else {
    await sendEmail({
      from: "booknook@gmail.com",
      to: user.email,
      subject,
      html: buildDigestTemplate(user, recentPosts),
    });
  }
  return {
    message: "Email sent successfully",
    data: {
      userId,
      recentPosts,
    },
  };
};

export { getFrequency, updateFrequency, getUsersForDigest, sendEmailDigest };
