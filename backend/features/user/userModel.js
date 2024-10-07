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
        isVerified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    }, 
    {
        tableName:'users',
        timeStamp: true,
    }
);

  User.prototype.validPassword = async function (password) {
    const encryptedPassword = await encryptPassword(password);
    return this.password === encryptedPassword;
  };

  return User;
};