export default (sequelize, Sequelize) => {
    const AuditTrail = sequelize.define("auditTrail", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        url: {
            type: Sequelize.STRING,
            allowNull: false
        },
        activity: {
            type: Sequelize.STRING,
            allowNull: false
        },
        params: {
            type: Sequelize.STRING,
            allowNull: false
        },
        query: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, 
    {
        tableName: 'audit_trails', 
        timestamps: true 
    });

    return AuditTrail;
};
