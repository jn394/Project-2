module.exports = function (sequelize, DataTypes) {
    var Usergroup = sequelize.define("Usergroup", {});

    Usergroup.associate = function(models) {
 
        Usergroup.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
      };

      Usergroup.associate = function(models) {
 
        Usergroup.belongsTo(models.Group, {
          foreignKey: {
            allowNull: false
          }
        });
      };


    return Usergroup;
};

