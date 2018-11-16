// Requiring bcrypt for password hashing. Using the bcrypt-nodejs version as the regular bcrypt module
// sometimes causes errors on Windows machines
var bcrypt = require("bcrypt-nodejs");
// Creating our User model
module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define("User", {
    // The email cannot be null, and must be a proper email before creation
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    // The password cannot be null
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },


    //Clipboard Password
    netflix_username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    netflix_password: {
      type: DataTypes.STRING,
      allowNull: false
    }

  });


  User.associate = function (models) {
    // Associating User with Apps
    // When an User is deleted, also delete any associated Posts
    User.hasMany(models.Apps, {
      onDelete: "cascade"
    });
  };

  //CODE I ADDED
  User.associate = function (models) {
    // Associating User with Apps
    // When an User is deleted, also delete any associated Posts
    User.hasMany(models.Usergroup, {
      onDelete: "cascade"
    });
  };

  // User.associate = function (models) {
  //   // Associating User with Groups
  //   // When an User is deleted, also delete any associated Groups (if admin)  Might get rid of this function because we changed gears to tie one user to one group.
  //   User.hasMany(models.tGroup, {
  //     onDelete: "cascade"
  //   });
  // };

  // User.associate = function (models) {

  //   User.belongsTo(models.Group, {
  //     foreignKey: {
  //       allowNull: false
  //     }
  //   });
  // };
  // Author is analagous to the User and instead of just Posts, they also have SharedApps under var Shared.

  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  User.hook("beforeCreate", function (user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  });
  return User;
};
