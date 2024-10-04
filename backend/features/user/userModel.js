import crypto from "crypto";
import { DataTypes } from "sequelize";
import validator from "validator";

export default (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4, 
            primaryKey: true 
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            isEmail: true, 
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        username: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        firstname: {
            type: Sequelize.STRING,
            allowNull: true
        },
        lastname: {
            type: Sequelize.STRING,
            allowNull: true
        },
        gender: {
            type: Sequelize.ENUM('male', 'female', 'other'), 
            allowNull: true
        },
        dob: {
            type: Sequelize.DATEONLY,
            allowNull: true
        },
        country: {
            type: Sequelize.STRING,
            allowNull: true
        },
        avatar: {
            type: Sequelize.STRING,
            defaultValue: "https://cdn3.iconfinder.com/data/icons/web-design-and-development-2-6/512/87-1024.png"
        },
        // isVerified is set to default false once a user signs up
        // this will change later after email has been verified
        // isVerified: {
        //     type: Sequelize.BOOLEAN,
        //     defaultValue: false
        // }
    }, 
    {
        tableName:'users',
        timeStamp: true,
        hooks: {
          beforeCreate: async (user) => {
              validatePassword(user.password);
              user.password = await encryptPassword(user.password);
          },
        },
    }
);

  User.prototype.validPassword = async function (password) {
    const encryptedPassword = await encryptPassword(password);
    return this.password === encryptedPassword;
  };

  const encryptPassword = async (password) => {
    return crypto.createHash("sha256").update(password).digest("hex");
  };

  const validatePassword = (password) => {
    if (
      !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      throw new Error(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      );
    }
};

  return User;
};