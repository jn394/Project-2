module.exports = function (sequelize, DataTypes) {
  var Group = sequelize.define("Group", {
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      len: [1]
    }
  });

  // Group.associate = function (models) {

  //   Group.hasMany(models.User, {
  //     foreignKey: {
  //       allowNull: false
  //     }
  //   });
  // };

  //CODE I ADDED
  Group.associate = function (models) {
    // Associating User with Apps
    // When an User is deleted, also delete any associated Posts
    Group.hasMany(models.Usergroup, {
      onDelete: "cascade"
    });
  };




  return Group;
};




