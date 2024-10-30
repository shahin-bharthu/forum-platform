export default (sequelize, Sequelize) => {
  const UserMembership = sequelize.define("UserMembership", {
      id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4, 
          primaryKey: true 
      },
      user_id: {
        type: Sequelize.UUID,
        references: {
            model: 'users',
            key: 'id',
        },
      },
      forum_id: {
        type: Sequelize.UUID,
        references: {
            model: 'forums',
            key: 'id',
        },
      },
      membership_status: {
        type: Sequelize.ENUM('MEMBER', 'APPROVED', 'MUTED'),
        defaultValue: 'MEMBER'
      }
  }, 
  {
      tableName:'user_memberships',
      timeStamps: true,
  }
);

return UserMembership;
};