module.exports = function (sequelize, DataTypes) {
    var Groupapp = sequelize.define("Groupapp", {});

    // Groupapp.associate = function(models) {

    //     Groupapp.belongsTo(models.User, {
    //       foreignKey: {
    //         allowNull: false
    //       }
    //     });
    //   };

    return Groupapp;
};

