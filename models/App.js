module.exports = function (sequelize, DataTypes) {
  var App = sequelize.define("App", {
    // Giving the App model a name of type STRING
    App_name: DataTypes.STRING,
    AppUsername: DataTypes.STRING,
    AppPassword: DataTypes.STRING,
  });

  App.associate = function(models) {

    App.belongsTo(models.User, {
      foreignKey: {
        
      }
    });
  };

  return App;
};


// Author is analagous to the App and instead of just Posts, they also have SharedApps under var Shared.