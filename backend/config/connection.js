import userModel from "../features/user/userModel.js";
import tokenModel from "../features/auth/tokenModel.js";

import Sequelize from "sequelize";

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

const check = async () => {
    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
      await db.sequelize.sync({ force: false, alter: true });   // alter: true, force: false
      console.log("All models were synchronized successfully.");
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


export { db, check };