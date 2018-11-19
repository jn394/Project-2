module.exports = function (sequelize, DataTypes) {
    var Usergroup = sequelize.define("Usergroup", {
      Pending: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
             
      },

      Admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
             
      },

    });

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

