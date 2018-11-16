module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    // Giving the User model a name of type STRING
    name: DataTypes.STRING,
    Email: DataTypes.STRING,
      });

 

  User.associate = function(models) {
    // Associating User with Apps
    // When an User is deleted, also delete any associated Posts
    User.hasMany(models.Apps, {
      onDelete: "cascade"
    });
  };

  User.associate = function(models) {
    // Associating User with Groups
    // When an User is deleted, also delete any associated Groups (if admin)  Might get rid of this function because we changed gears to tie one user to one group.
    User.hasMany(models.Group, {
      onDelete: "cascade"
    });
  };

  User.associate = function(models) {
 
    User.belongsTo(models.Group, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return User;
};


// Author is analagous to the User and instead of just Posts, they also have SharedApps under var Shared.