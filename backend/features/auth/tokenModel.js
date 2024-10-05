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
        token: {
            type: Sequelize.STRING,
        },
    }, { timestamps: true });

    return Token;
};
