$(document).ready(function () {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page  


  $.get("/api/user_data").then(function (data) {
    $(".member-name").text(data.email);



    // ----------------------------------------------------------------------------------------------------------------------------------------------------
    // Join Group Code

    // Need this for the "joinAGroupBTN" post request
    $("#member-id").text(data.id);
    $("#member-id").attr("value", data.id);
    console.log(data.id);
    // ----------------------------------------------------------------------------------------------------------------------------------------------------


  });

  // Group Creation Button Functionality / Event Listener
  var groupInput = $("#inputGroupName");
  $("#submitgroup").on("click", function (event) {
    console.log("submitted!");
    event.preventDefault();
    var groupData = {
      name: groupInput.val().trim()

    };

    if (!groupData.name) {
      return console.log("thats a dumb... name try again!");
      // TODO  Generate validation saying name is taken or you need to fill it in
    }
    // If group name is generated and no issue, 

    signUpGroup(groupData.name);
    // signUpUsergroup();
  });

  function signUpGroup(name) {
    $.post("/api/signUpGroup", {
      name: name
    }).then(function (data) {
      console.log(data);
      // Need this for the "joinAGroupBTN" post request
      $("#group-id").text(data.id);
      $("#group-id").attr("value", data.id);
      signUpUsergroup();
      // If there's an error, handle it by throwing up a bootstrap alert
    }).catch(handleLoginErr);


  }

  function signUpUsergroup() {
    // $(document).on("click", "#submitgroup", function () {
    console.log("You are now the Group Admin!!");


    var usergroup_data = {
      GroupID: $("#group-id").attr("value"),
      UserID: $("#member-id").attr("value")
    };

    $.post("/api/signUpUsergroup", {
      GroupId: usergroup_data.GroupID,
      UserId: usergroup_data.UserID
    }).then(function (data) {
      console.log("Group that you Created: ");
      console.log(data);
      $("#displayGroup").append("\n  AYYYY!! You have Made the Group: " + data.GroupId);
      // $("#joinGroupBTN").hide();

      // If there's an error, handle it by throwing up a bootstrap alert
    }).catch(handleLoginErr);
    // })
  };

  // ----------------------------------------------------------------------------------------------------------------------------------------------------
  // Join Group Code

  // Join Group Button
  $("#joinGroupBTN").on("click", function (event) {
    event.preventDefault();
    $("#searchResults").empty();
    console.log("Clicked Join Group!!!");

    $.get("/api/group_join").then(function (data) {
      console.log(data);

      for (var i = 0; i < data.length; i++) {

        console.log(data[i]);
        var members = data[i].Users;
        var listOfMembers = [];

        for (var j = 0; j < members.length; j++) {
          listOfMembers.push(members[j].name);
        };

        $("#searchResults").append(
          "<div><h5>Group #: " + data[i].id + "<br>" +
          "Group Name: " + data[i].name + "<br>" +
          "Group Body: " + data[i].body + "<br>" +
          "Users In Group: " + listOfMembers +
          "</div>" +
          //Join A Group Button
          "<button class='joinAGroupBTN btn btn-success' data-dismiss='modal' data-groupID=" + data[i].id + " type='button'>+ Join</button>" +
          "<hr>");
      };
    });
  });

  // ----------------------------------------------------------------------------------------------------------------------------------------------------

  // Testing
  $.get("/api/testing").then(function (data) {
    console.log(data);
    for (var i = 0; i < data.length; i++) {
      //Put either List View or Card View
      console.log(data[i]);
      var members = data[i].Users;
      var listOfMembers = [];

      listApps(data[i].id);

      for (var j = 0; j < members.length; j++) {
        listOfMembers.push(members[j].name);
      };

      $("#testing").append(
        "<div><h5>Group #: " + data[i].id + "<br>" +
        "Group Name: " + data[i].name + "<br>" +
        "Group Body: " + data[i].body + "<br>" +
        "Users In Group: " + listOfMembers +
        "</div>" +
        //Join A Group Button
        "<button class='joinAGroupBTN btn btn-success' data-dismiss='modal' data-groupID=" + data[i].id + " type='button'>+ Join</button>" +
        "<hr>");
    };
  });

  function listApps(GroupId) {
    $.get("/api/list_apps/" + GroupId).then(function (data) {
      console.log(data);
    });
  };

  // ----------------------------------------------------------------------------------------------------------------------------------------------------


  // Modal Search Button
  $("#groupSearchBTN").on("click", function (event) {
    event.preventDefault();
    $("#searchResults").empty();
    console.log("Searching!!!");
    var group_name = $("input#groupSearch-input").val().trim();
    console.log(group_name);
    $.get("/api/group_join/" + group_name).then(function (data) {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        //Put either List View or Card View
        console.log(data[i]);
        var members = data[i].Users;
        var listOfMembers = [];

        for (var j = 0; j < members.length; j++) {
          listOfMembers.push(members[j].name);
        };

        $("#searchResults").append(
          "<div><h5>Group #: " + data[i].id + "<br>" +
          "Group Name: " + data[i].name + "<br>" +
          "Group Body: " + data[i].body + "<br>" +
          "Users In Group: " + listOfMembers +
          "</div>" +
          //Join A Group Button
          "<button class='joinAGroupBTN btn btn-success' data-dismiss='modal' data-groupID=" + data[i].id + " type='button'>+ Join</button>" +
          "<hr>");
      };
    });
  });

  //Join A Group Button

  // Click event for "+ Join"
  $(document).on("click", "button.joinAGroupBTN", function () {
    console.log("You Joined a Group!!!");

    var usergroup_data = {
      GroupID: $(this).attr("data-groupID"),
      UserID: $("#member-id").attr("value")
    };

    $.post("/api/usergroup", {
      GroupId: usergroup_data.GroupID,
      UserId: usergroup_data.UserID
    }).then(function (data) {
      console.log("Group that you joined: ");
      console.log(data);
      $("#displayGroup").append("Congratz!! You have requested to join Group #: " + data.GroupId);
      hidebuttons()
      // $("#joinGroupBTN").hide();

      // If there's an error, handle it by throwing up a bootstrap alert
    }).catch(handleLoginErr);
  });

  //Handling an Error
  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  };

  // Function for creating a row for groups
  // function createNewRow(group) {

  //   //Setting Up the Card
  //   var newGroupCard = $("<div>");
  //   newGroupCard.addClass("card");
  //   var newGroupCardHeading = $("<div>");
  //   newGroupCardHeading.addClass("card-header");
  //   var newGroupTitle = $("<h5>");
  //   var newGroupCardBody = $("<div>");
  //   newGroupCardBody.addClass("card-body");
  //   var newGroupBody = $("<p>");

  //   //Join A Group Button
  //   var joinBTN = $("<button>");
  //   joinBTN.attr('class', 'joinAGroupBTN');
  //   joinBTN.attr('data-dismiss', 'modal');
  //   joinBTN.attr('data-groupID', group.id);
  //   joinBTN.text("+ Join");
  //   joinBTN.addClass("btn btn-success");
  //   joinBTN.css({
  //     float: "right",
  //     "margin-top": "-5px"
  //   });

  //   //Adding Into the Card
  //   newGroupTitle.text(group.name + " ");
  //   newGroupCardHeading.append(joinBTN);
  //   newGroupCardHeading.append(newGroupTitle);
  //   newGroupBody.text(group.body);
  //   newGroupCardBody.append(newGroupBody);
  //   newGroupCard.append(newGroupCardHeading);
  //   newGroupCard.append(newGroupCardBody);
  //   newGroupCard.data("Group", group);
  //   return newGroupCard;
  // };

  // ----------------------------------------------------------------------------------------------------------------------------------------------------

  //Only show when they are in a group
  // -------------------  ADD A SERVICE LOGIC -----------------------//

  // Toggle Effect for Service Icons
  $(".serviceIcons").click(function () {
    $("#serviceCheck").empty();
    $(this).toggleClass("active");
    if ($(".serviceIcons.active").length > 0) {
      $(this).css({
        height: "54px",
        width: "54px",
        border: "solid yellow 2px"
      });
      checkApp($(this).attr("value"));
      $("#ServiceUN").text($(this).attr("value") + " Username");
      $("#ServicePW").text($(this).attr("value") + " Password");
    }
    else {
      $(this).css({
        height: "50px",
        width: "50px",
        border: "0"
      });
      $("#ServiceUN").text("Service Username");
      $("#ServicePW").text("Service Password");
    }
  });

  // Checks if User has already added this app
  function checkApp(appName) {
    $.get("/api/app_name/" + appName).then(function (data) {
      console.log(data);
      if (data[0].App_name === appName) {
        $("#serviceCheck").append("<div class='alert alert-danger' role='alert'>You Already Have this Service</div>")
      };
    });
  };

  $("#subscriptionsubmit").on("click", function (event) {
    event.preventDefault();

    console.log("clicked add!!");

    var appName = "";

    // Logic to determne which service has been clicked ... annoying coudlnt use .val for this but was the only way i could get it working //

    if ($(".serviceIcons.active").length > 0) {
      appName = $(".serviceIcons.active").attr("value");
    };

    console.log(appName, "App name ------");

    var appData = {
      app_username: $("#appUN-input").val().trim(),
      app_password: $("#appPW-input").val().trim(),
      app: appName

    };

    console.log(appData);

    addApp(appData.app, appData.app_username, appData.app_password, $("#member-id").attr("value"), groupid);

  });

  function addApp(app, username, password, id, groupid) {
    $.post("/api/addapp", {
      app: app,
      username: username,
      password: password,
    }).then(function (data) {
      console.log("this should be data");
      console.log(data);
      addUserApp(id, groupid, data.id);
      // If there's an error, handle it by throwing up a bootstrap alert
    }).catch(handleLoginErr);
  };

  // Creating GroupApp and UserId association
  function addUserApp(id, groupid, AppId) {
    $.post("/api/addUserApp_groupapp/", {
      UserId: id,
      GroupId: groupid,
      AppId: AppId
    }).then(function (data) {
      console.log(data);
      $("#AddServiceBTN").show();
      // If there's an error, handle it by throwing up a bootstrap alert
    }).catch(handleLoginErr);
  };

  // ---------------------------------------------------------------//
  // Adding Service to group

  // $.get("/api/addService_toGroup/" + UserId).then(function (data) {
  //   console.log(data);
  //   // for (var i = 0; i < data.length; i++) {
  //   //   gettingUserName(data[i].UserId, GroupId)
  //   // }
  // });




  // ----------------------------------------------------------------------------------------------------------------------------------------------------
  // Add Pending Users

  function pendingUsers(GroupId) {
    $.get("/api/pending_users/" + GroupId).then(function (data) {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        gettingUserName(data[i].UserId, GroupId)
      }
    });
  };

  function gettingUserName(id, GroupId) {
    $.get("/api/display_pendingUsers/" + id).then(function (data) {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        $("#pendingReq").append("<div id=pending" + [i] + " >" + data[i].name + " would love to join your group!" + "<button class='" + [i] + " acceptPendingUser btn btn-success ml-2' data-name =" + data[i].name + " data-userID =" + id + " data-groupID=" + GroupId + " type='button'>Appove</button>" +
          "<hr>");
      }
    });
  };

  $(document).on("click", "button.acceptPendingUser", function () {
    var pendingUser_data = {
      UserId: $(this).attr("data-userID"),
      GroupId: $(this).attr("data-groupID")
    };

    console.log(pendingUser_data.UserId);
    console.log(pendingUser_data.GroupId);

    //Function to Update Usergroup table
    updateRequest(pendingUser_data)

    //Hides the div
    $("#pending" + $(this).attr("class")[0]).hide();
    console.log("You have approved " + $(this).attr("data-name") + "!!!");
  });

  function updateRequest(request) {
    $.ajax({
      method: "PUT",
      url: "/api/approve_user",
      data: request
    })
      .then(function (data) {
        console.log(data);
      });
  }

  // THIS IS THE FUNCTION THAT WILL BE USED IN THE IF STATEMENT

  groupCheck();
  // pendingUsers(1);
  // I put pending user in my function below VVV

  // ----------------------------------------------------------------------------------------------------------------------------------------------------

  //  Step 1, Check for group
  // ---------------------------------------------------------------------
  function groupCheck() {
    $.get("/api/user_data").then(function (data) {
      console.log(data.id);

      $.get("/api/group_check/" + data.id).then(function (data) {
        console.log(data);
        var UserId = data.id
        for (var i = 0; i < data.length; i++) {
          if (data[i].UserId !== UserId) {
            hidebuttons();
            console.log("This user is in a group  \n As Such, we will be hiding the Create and Join Goup Buttons.");
            adminCheck();
          }
          else
            console.log("This user is not in a group  \n Please Join or Create a group!");

        }
      });
    });
  };


  // Step 2, Check if Admin
  // ---------------------------------------------------------------------
  function adminCheck() {
    $.get("/api/user_data").then(function (data) {
      console.log(data.id);

      var UserDataAdminCheck = data.id

      $.get("/api/admin_check/" + data.id).then(function (data) {
        console.log(data);
        console.log("ID for Admin Check: " + UserDataAdminCheck)
        for (var i = 0; i < data.length; i++) {
          //Step 3A, if Admin is true, run Jay's pendingUser function ---------------------------------------------------------------------
          if (data[i].Admin === true) {
            console.log(data[0].UserId)
            $("#AddServiceBTN").show();
            pendingUsers(UserDataAdminCheck);
            console.log("Checking to see if there are Users Requests for your Group")
          }
          //Step 3B, if Admin is false, run check to see if user is Pending themselves  THIS DOES NOT WORK YET ---------------------------------------------------------------------

          else {
            console.log("Not an Admin - loading pending request module...");
            pendingUsers2(UserDataAdminCheck);
          }
        }
      });
    });

    function pendingUsers2(data1) {
      $.get("/api/pending_users/" + data1).then(function (data) {
        console.log(data);
        console.log("Let's see if you have made a pending request!")
        for (var i = 0; i < data.length; i++) {
          gettingUserName2(data[i].UserId, GroupId)

        }
      });
    };

    function gettingUserName2(id) {
      $.get("/api/display_pendingUsers/" + id).then(function (data) {
        console.log(data);
        for (var i = 0; i < data.length; i++) {
          if (data[i].Pending = true) {
            console.log("Your request is pending approval with the group admin!")
          }
          else
            console.log("\n\n\n\n\n\n\n\n\n\n\n\nTHIS IS WHERE WE DISPLAY EVERYTHING")
        }
      });
    };
  };

  function hidebuttons() {
    $("#createGroupBTN").hide(),
      $("#joinGroupBTN").hide();
  };


});
