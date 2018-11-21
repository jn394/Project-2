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

    return Usergroup;
};

