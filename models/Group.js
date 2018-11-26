module.exports = function (sequelize, DataTypes) {
  var Group = sequelize.define("Group", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    // ----------------------------------------------------------------------------------------------------------------------------------------------------
    // Join Group Code
    createdAt: {
      type: DataTypes.DATE,
      field: 'beginTime',
      defaultValue: sequelize.literal('NOW()'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'beginTime',
      defaultValue: sequelize.literal('NOW()'),
    }
    // ----------------------------------------------------------------------------------------------------------------------------------------------------
 
  });

  Group.associate = function (models) {
    // Associating User with Apps
    // When an User is deleted, also delete any associated Posts
    Group.belongsToMany(models.User, { through: 'Usergroup' });
  };

  // Group.associate = function (models) {

  //   Group.belongsToMany(models.App, { through: 'GroupApp' });
  //  };
 

  return Group;
};




