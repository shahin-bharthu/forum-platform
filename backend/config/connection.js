import Sequelize from "sequelize";
import userModel from "../features/user/userModel.js";
import tokenModel from "../features/auth/tokenModel.js";
import auditTrailModel from "../features/auditLogs/auditTrailModel.js";
import forumModel from "../features/forum/forumModel.js";
import topicModel from "../features/topics/topicModel.js";
import userMembershipModel from "../features/forum/userMembershipModel.js";
import commentModel from "../features/comments/commentModel.js";
import {createForumIndex, addDocumentsToForumIndex} from "../opensearch/forums/forumIndex.js";
import { createTopicIndex, addDocumentsToTopicIndex } from "../opensearch/topics/topicIndex.js";

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = userModel(sequelize, Sequelize);
db.Token = tokenModel(sequelize, Sequelize);
db.AuditTrail = auditTrailModel(sequelize, Sequelize);
db.Forum = forumModel(sequelize, Sequelize);
db.Topic = topicModel(sequelize, Sequelize);
db.UserMembership = userMembershipModel(sequelize, Sequelize);
db.Comment = commentModel(sequelize, Sequelize);

const check = async () => {
    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
      await db.sequelize.sync({ alter: false, force: false });   // alter: true, force: false
      console.log("All models were synchronized successfully.");

      // await createForumIndex();
      // await addDocumentsToForumIndex();

      // await createTopicIndex();
      // await addDocumentsToTopicIndex();
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error
    }
};

db.User.hasOne(db.Token, {
  as: 'token',
  foreignKey:"userId"
})
db.Token.belongsTo(db.User, {
  as: 'user',
  foreignKey:"userId"
})


db.User.hasMany(db.Forum, {
  as: 'forum',
  foreignKey:"createdBy"
})
db.Forum.belongsTo(db.User, {
  as: 'user',
  foreignKey: "createdBy"
})


db.User.belongsToMany(db.Forum, { 
  through: db.UserMembership, 
  foreignKey: 'user_id', 
  as: 'forums' 
});
db.Forum.belongsToMany(db.User, { 
  through: db.UserMembership, 
  foreignKey: 'forum_id', 
  as: 'users'
});
db.User.hasMany(db.UserMembership, {
  as: 'memberships',
  foreignKey: 'user_id'
});
db.UserMembership.belongsTo(db.User, {
  as: 'users',
  foreignKey:'user_id'
});
db.Forum.hasMany(db.UserMembership, {
  as: 'memberships',
  foreignKey:'forum_id'
});
db.UserMembership.belongsTo(db.Forum, {
  as: 'forums',
  foreignKey: 'forum_id'
});


db.User.hasMany(db.Topic, {
  as: 'topics',
  foreignKey:"createdBy"
});
db.Topic.belongsTo(db.User, {
  as: 'user',
  foreignKey: "createdBy"
});


db.Forum.hasMany(db.Topic, {
  as: 'topics',
  foreignKey:"forum_id"
});
db.Topic.belongsTo(db.Forum, {
  as: 'forum',
  foreignKey: "forum_id"
});


db.User.hasMany(db.Comment, {
  as: 'comments',
  foreignKey: 'createdBy'
});
db.Comment.belongsTo(db.User, {
  as: 'user',
  foreignKey: 'createdBy'
});
db.Topic.hasMany(db.Comment, {
  as: 'comments',
  foreignKey: 'topic_id'
});
db.Comment.belongsTo(db.Topic, {
  as: 'topic',
  foreignKey: 'topic_id'
});

export { db, check };