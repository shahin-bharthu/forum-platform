import userModel from "../features/auth/authModel.js";
import Sequelize from "sequelize";

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// db.User = require("../features/users/userModel")(sequelize, Sequelize);

db.User = userModel(sequelize, Sequelize);

const check = async () => {
    try {
      await sequelize.authenticate();
      console.log("Connection has been established successfully.");
      await db.sequelize.sync({ force: false }); // baad me alter: true set kar dena
      console.log("All models were synchronized successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
};


export { db, check };