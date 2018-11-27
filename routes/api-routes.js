// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");
var Sequelize = require("sequelize");
var Op = Sequelize.Op;

module.exports = function (app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    res.json("/members");
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function (req, res) {
    console.log(req.body);
    db.User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    }).then(function () {
      res.redirect(307, "/api/login");
    }).catch(function (err) {
      console.log(err);
      res.json(err);
      // res.status(422).json(err.errors[0].message);
    });
  });

  // Route for logging user out
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function (req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    }
    else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  app.post("/api/signUpGroup", function (req, res) {
    console.log(req.body);
    console.log("Not User Group");
    db.Group.create({
      name: req.body.name

    }).then(function (data) {
      res.json(data);
    }).catch(function (err) {
      console.log(err);
      res.json(err);
      // res.status(422).json(err.errors[0].message);
    });
  });

  app.post("/api/signUpUsergroup", function (req, res) {
    console.log(req.body);
    console.log("END OF REQUEST!!!!!!!!")
    db.Usergroup.create({
      GroupId: req.body.GroupId,
      UserId: req.body.UserId,
      Pending: false,
      Admin: true
    }).then(function (data) {
      console.log(data);
      console.log("YOU HAVE CREATED A GROUP, YOU ADMIN YOU!");
      res.send(data);
    }).catch(function (err) {
      console.log(err);
      res.json(err);
    });
  });



  // ----------------------------------------------------------------------------------------------------------------------------------------------------
  // Join Group Code

  // Join Group Button
  app.get("/api/group_join", function (req, res) {
    db.Group.findAll({
      include: [
        {
          model: db.User
        }
      ]
    }).then(function (data) {
      res.json(data);
    });
  });

  // ----------------------------------------------------------------------------------------------------------------------------------------------------

  //Testing
  app.get("/api/testing", function (req, res) {
    db.Group.findAll({
      include: [
        {
          model: db.User
        }
      ]
    }).then(function (data) {
      res.json(data);
    });
  });

  //Listing Apps
  app.get("/api/list_apps/:UserId", function (req, res) {
    db.App.findAll({
      where: {
        UserId: req.params.UserId
      }
    }).then(function (data) {
      res.send(data);
    });
  });

  // ----------------------------------------------------------------------------------------------------------------------------------------------------

  // Modal Search Button
  app.get("/api/group_join/:group_name", function (req, res) {
    db.Group.findAll({
      where: {
        name: {
          [Op.like]: "%" + req.params.group_name + "%"
        }
      },
      include: [
        {
          model: db.User
        }
      ]
    }).then(function (data) {
      res.json(data);
    });
  });

  // Join A Group Button
  app.post("/api/usergroup", function (req, res) {
    console.log(req.body);
    console.log("END OF REQUEST!!!!!!!!")
    db.Usergroup.create({
      GroupId: req.body.GroupId,
      UserId: req.body.UserId,
      Pending: true,
      Admin: false
    }).then(function (data) {
      console.log(data);
      console.log("YOU HAVE JOINED THE GROUP");
      res.send(data);
    }).catch(function (err) {
      console.log(err);
      res.json(err);
    });
  });

  // ----------------------------------------------------------------------------------------------------------------------------------------------------

  // ADD AN APP ROUTE -----//

  // CheckApp Fucntion
  app.get("/api/app_name/:appName/UserId/:id", function (req, res) {
    db.App.findAll({
      where: {
        App_name: req.params.appName,
        UserId: req.params.id
      }
    }).then(function (data) {
      console.log("READ THIS");
      res.json(data);
    });
  });

  // Adding App to App table
  app.post("/api/addapp", function (req, res) {
    console.log(req.body);
    db.App.create({
      App_name: req.body.app,
      AppUsername: req.body.username,
      AppPassword: req.body.password,
      UserId: req.body.UserId
    }).then(function (data) {
      res.json(data);
    }).catch(function (err) {
      console.log(err);
      res.json(err);
      // res.status(422).json(err.errors[0].message);
    });
  });

  // ----------------------------------------------------------------------------------------------------------------------------------------------------

  // Adding Service to group

  app.get("/api/addService_toGroup/:UserId", function (req, res) {
    db.App.findAll({
      where: {
        UserId: req.params.UserId,
        Pending: true
      }
    }).then(function (data) {
      res.json(data);
    });
  });

  // ----------------------------------------------------------------------------------------------------------------------------------------------------

  // Add Pending Users

  // Getting Pending Users
  app.get("/api/pending_users/:GroupId", function (req, res) {
    db.Usergroup.findAll({
      where: {
        GroupId: req.params.GroupId,
        Pending: true
      }
    }).then(function (data) {
      res.json(data);
    });
  });

  // Displaying Pending Users
  app.get("/api/display_pendingUsers/:id", function (req, res) {
    db.User.findAll({
      where: {
        id: req.params.id
      }
    }).then(function (data) {
      res.json(data);
    });
  });

  //Approving User
  app.put("/api/approve_user", function (req, res) {
    db.Usergroup.update(
      { Pending: false }, {
        where: {
          UserId: req.body.UserId,
          GroupId: req.body.GroupId
        }
      }).then(function (data) {
        res.json(data);
      });
  });

  // ----------------------------------------------------------------------------------------------------------------------------------------------------

  // Check for group
  app.get("/api/group_check/:UserId", function (req, res) {
    db.Usergroup.findAll({
      where: {
        UserId: req.params.UserId,
      }
    }).then(function (data) {
      res.json(data);
      console.log("-------------\nGroup Membership Check Complete!\n-------------")
    });
  });



  // Check admin
  app.get("/api/admin_check/:UserId", function (req, res) {
    db.Usergroup.findAll({
      where: {
        UserId: req.params.UserId,
        Admin: true
      }
    }).then(function (data) {
      res.json(data);
      console.log("-------------\nAdmin Check Complete!\n-------------")
    });
  });

  // // DisplayUserID for Current User in Console
  // app.get("/api/user_check/", function (req, res) {
  //   db.User.findAll({
  //     where: {
  //       UserId
  //       }
  //   }).then(function (data) {
  //     res.json(data);
  //     console.log("-------------\nUserID Info Listed!\n-------------")
  //   });
  // });


















  //-------------------------------------------------------------------------------------------------------------------------------------------------------













};
