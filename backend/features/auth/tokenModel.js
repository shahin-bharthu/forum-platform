export default (sequelize, Sequelize) => {
    const Token = sequelize.define("token", {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        userId: {
            type: Sequelize.UUID,
            allowNull: false,
            onUpdate: "cascade",
            onDelete: "cascade",
            references: { model: "users", key: "id" },
        },
        verificationToken: {
            type: Sequelize.STRING,
        },
        resetToken: {
            type: Sequelize.STRING,
        },
        expiration: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: () => {
                const date = new Date();
                date.setDate(date.getDate() + 7);
                return date;
            },
        },
    }, { timestamps: true });

    return Token;
};
