module.exports = function(sequelize, DataTypes) {
  var App = sequelize.define("App", {
    // Giving the App model a name of type STRING
    App_name: DataTypes.STRING,
    AppUsername: DataTypes.STRING,
    AppPassword: DataTypes.STRING,
    });

 
  //   App.associate = function(models) {
  //   // Associating App with Groups
  //   // When an App is deleted, also delete any associated Groups (if admin)  Might get rid of this function because we changed gears to tie one App to one group.
  //   App.hasMany(models.Group, {
  //     onDelete: "cascade"
  //   });
  // };

  App.associate = function(models) {
 
    App.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return App;
};


// Author is analagous to the App and instead of just Posts, they also have SharedApps under var Shared.