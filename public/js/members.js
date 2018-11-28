$(document).ready(function () {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page  
  $(document).on("click", "#deleteUserBTN", deleteUser);
  $(document).on("click", "#leaveGroupBTN", leaveGroup);

  $("#clipboardStuff").hide();

  $.get("/api/user_data").then(function (data) {
    $(".member-name").text(data.email);
    $("#leaveGroupBTN").hide(),


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
      hidebuttons();
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
        var listOfMembersJoin = [];
        var listOfMemberIdsJoin = [];
        var groupId = data[i].id;

        for (var j = 0; j < members.length; j++) {
          listOfMembersJoin.push(members[j].name);
          listOfMemberIdsJoin.push(members[j].id);
        }

        $("#searchResults").append(createNewRow(data[i], groupId, listOfMembersJoin, listOfMemberIdsJoin));

      };
    });
  });

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
        // Put either List View or Card View
        console.log(data[i]);
        var members = data[i].Users;
        var listOfMembersJoin = [];
        var listOfMemberIdsJoin = [];
        var groupId = data[i].id;

        for (var j = 0; j < members.length; j++) {
          listOfMembersJoin.push(members[j].name);
          listOfMemberIdsJoin.push(members[j].id);
        }

        $("#searchResults").append(createNewRow(data[i], groupId, listOfMembersJoin, listOfMemberIdsJoin));

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
      hidebuttons();
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
  function createNewRow(group, groupId, users, userId) {

    //Setting Up the Card
    var newGroupCard = $("<div>");
    newGroupCard.addClass("card");
    var newGroupCardHeading = $("<div>");
    newGroupCardHeading.addClass("card-header");
    var newGroupTitle = $("<h5>");
    var newGroupCardBody = $("<div>");
    newGroupCardBody.addClass("card-body");
    var newGroupBody = $("<h6>");
    newGroupBody.attr("id", "groupDiv" + groupId);

    //Join A Group Button
    var joinBTN = $("<button>");
    joinBTN.attr('class', 'joinAGroupBTN');
    joinBTN.attr('data-dismiss', 'modal');
    joinBTN.attr('data-groupID', group.id);
    joinBTN.text("+ Join");
    joinBTN.addClass("btn btn-danger");
    joinBTN.css({
      float: "right",
      "margin-top": "-5px"
    });

    //Adding Into the Card
    newGroupTitle.text("Group Name: " + group.name + " ");
    newGroupCardHeading.append(joinBTN);
    newGroupCardHeading.append(newGroupTitle);
    newGroupBody.append("Group Members: " + users + " <br>" + "Apps in Group: ");
    newGroupCardBody.append(newGroupBody);
    newGroupCard.append(newGroupCardHeading);
    newGroupCard.append(newGroupCardBody);
    newGroupCard.data("Group", group);

    for (var j = 0; j < userId.length; j++) {
      var UserId = userId[j];

      console.log(UserId);
      $.get("/api/list_apps/" + UserId).then(function (data) {
        console.log(data);
        switch (data[0].App_name) {
          case "Netflix":
            $("#groupDiv" + groupId).append("<img class='groupIcons rounded-circle' src='stylesheets/img/serviceIcons/iconfinder_netflix_143870.png' alt='Netflix Icon' value='Netflix'>");
            break;
          case "Hulu":
            $("#groupDiv" + groupId).append("<img class='groupIcons rounded-circle' src='stylesheets/img/serviceIcons/hulu-icon.png' alt='Hulu Icon' value='Hulu'>");
            break;
          case "Spotify":
            $("#groupDiv" + groupId).append("<img class='groupIcons rounded-circle' src='stylesheets/img/serviceIcons/iconfinder_Spotify_1298766.png' alt='Spotify Icon' value='Spotify'>");
            break;
          case "HBO":
            $("#groupDiv" + groupId).append("<img class='groupIcons rounded-circle' src='stylesheets/img/serviceIcons/hbo-now-gift-card-taxon.png' alt='HBO Icon' value='HBO'>");
            break;
          case "NyTimes":
            $("#groupDiv" + groupId).append("<img class='groupIcons rounded-circle' src='stylesheets/img/serviceIcons/iconfinder_new_york_times_143900.png' alt='NyTimes Icon' value='NyTimes'>");
            break;
        };
      });
    };
    return newGroupCard;
  };

  // ----------------------------------------------------------------------------------------------------------------------------------------------------

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
      checkApp($(this).attr("value"), $("#member-id").attr("value"));
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
  function checkApp(appName, id) {

    $.get("/api/app_name/" + appName + "/UserId/" + id).then(function (data) {
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

    if ($(".serviceIcons.active").length > 0) {
      appName = $(".serviceIcons.active").attr("value");
    };

    console.log(appName, "App name ------");
    $("#AddServiceBTN").hide();
    var appData = {
      app_username: $("#appUN-input").val().trim(),
      app_password: $("#appPW-input").val().trim(),
      app: appName,
      id: $("#member-id").attr("value")
    };

    console.log(appData);

    addApp(appData.app, appData.app_username, appData.app_password, appData.id);

  });

  function addApp(app, username, password, id) {
    $.post("/api/addapp", {
      app: app,
      username: username,
      password: password,
      UserId: id
    }).then(function (data) {
      console.log(data);
      // If there's an error, handle it by throwing up a bootstrap alert
    }).catch(handleLoginErr);
  };

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
        $("#pendingReq").append("<div id=pending" + [i] + " >" + data[i].name + " would love to join your group!" + "<button class='" + [i] + " acceptPendingUser btn btn-danger ml-2' data-name =" + data[i].name + " data-userID =" + id + " data-groupID=" + GroupId + " type='button'>Approve</button>" +
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
    console.log("You have approved " + $(this).attr("data-name") + "!!!")
     
  });

  function updateRequest(request) {
    $.ajax({
      method: "PUT",
      url: "/api/approve_user",
      data: request
    })
      .then(function (data) {
        console.log(data);
      window.location.replace("/members");
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
            groupIDCheck();
            // console.log(groupIdCheckValue);
            // JAY ADD Displaydash here 
            // displayDash(groupIdCheckValue);
          }
          //Step 3B, if Admin is false, run check to see if user is Pending themselves  THIS DOES NOT WORK YET ---------------------------------------------------------------------

          else {
            console.log("Not an Admin - loading pending request module...");
            pendingUsers2(UserDataAdminCheck);
          }
        }
      });
    });

    function pendingUsers2(UserDataAdminCheck) {
      console.log(UserDataAdminCheck);
      $.get("/api/display_pendingUsers/" + UserDataAdminCheck).then(function (data) {
        console.log(data);
        console.log("Let's see if you have made a pending request!")
        for (var i = 0; i < data.length; i++) {
          if (data[i].Pending === 1) {
            console.log("Your request is pending approval with the group admin!")
          }
          else
            // TODO: INSERT Function that generates Dashboard table HERE
            console.log("\n\n\n\n\n\n\n\n\n\n\n\nTHIS IS WHERE WE DISPLAY EVERYTHING")
          groupIDCheck()
          // Jay PUT THE SHIT HERE.
        }

      });
    };
  };


  // });
















  // var groupIdCheckValue = "";



  function groupIDCheck() {
    $.get("/api/user_data").then(function (data) {
      console.log(data.id);

      $.get("/api/group_id_check/" + data.id).then(function (data) {
        console.log(data);
        var groupId = data[0].GroupId;
        console.log("This is THE Group ID you are looking for " + groupId);
        displayDash(groupId);
      });
    })
  };
























































































































  // I think the double function execution is happening as a result of the "$(document).on("click", "#deleteUserBTN", deleteUser);"
  // This code below is me trying to fix that.
  // // Group Creation Button Functionality / Event Listener
  // $("#deleteUserBTN").on("click", function (event) {
  //   deleteUser() 
  //   console.log("Delete Clicked");
  //   event.preventDefault();
  // });


  // $("#leaveGroupBTN").on("click", function (event) {
  //   leaveGroup();
  //   console.log("Leave Group Clicked");
  //   event.preventDefault();
  // });







  function deleteUser(event) {
    $.get("/api/user_data").then(function (data) {
      console.log(data.id + " is deleting their user account!");
      event.stopPropagation();
      var person = prompt("Are you sure you want to delete your Account?  A deleted account cannot be recovered. Type 'DELETE' and press ok to continue");
      var id = data.id;

      if (person !== "DELETE") {
        alert("User cancelled delete request.");
      }
      else {

        $.ajax({
          method: "DELETE",
          url: "/api/user_data_delete/" + id
        })
          .then(console.log("User Removed!"),
          window.location.replace("/logout"));

      }

    })
  };



  function leaveGroup(event) {
    $.get("/api/user_data").then(function (data) {
      console.log(data.id);
      event.stopPropagation();
      var UserId = data.id;


      $.ajax({
        method: "DELETE",
        url: "/api/user_data_leave/" + UserId
      })
        .then(console.log("User Left Group!"),
          showbuttons())
    }


    )
  };



  function hidebuttons() {
    $("#createGroupBTN").hide(),
      $("#joinGroupBTN").hide(),
      $("#leaveGroupBTN").show();
  };


  function showbuttons() {
    $("#createGroupBTN").show(),
      $("#joinGroupBTN").show(),
      $("#leaveGroupBTN").hide();
  };






  // Dashboard Logic
  // ---------------------------------------------------------------------

  var listOfMembers = [];
  var listOfMemberIds = [];
  var listOfApps = [];
  var listOfUN = [];
  var listOfPW = [];

  function displayDash(GroupId) {
    $.get("/api/dashboard/" + GroupId).then(function (data) {
      console.log(data[0]);
      var users = data[0].Users
      // var listOfMembers = [];
      // var listOfMemberIds = [];
      // var listOfApps = [];
      // var listOfUN = [];
      // var listOfPW = [];

      for (var i = 0; i < users.length; i++) {
        console.log(users[i]);
        listOfMembers.push(users[i].name);
        listOfMemberIds.push(users[i].id);

        // var members = data[i].Users;
        // var listOfMembers = [];
        // var listOfMemberIds = [];
        // var groupId = data[i].id;

        // for (var j = 0; j < members.length; j++) {
        //   listOfMembers.push(members[j].name);
        //   listOfMemberIds.push(members[j].id);
        // }

        // $("#searchResults").append(createNewRow(data[i], groupId, listOfMembers, listOfMemberIds));

      };
      displayDash2();
    });
  };

  function displayDash2() {
    console.log("listOfMemberIds " + listOfMemberIds);
    getUserId(function () {
      for (var k = 0; k < listOfApps.length; k++) {
        $("#dashboardBody").append(createNewTableRow(listOfMembers[k]));
        addingAppToTable(listOfApps[k]);
        addInputs(listOfUN[k], listOfPW[k]);
      };
    })
  };

  function getUserId(cb) {
    if (listOfMemberIds.length > 0) {
      var memberid = listOfMemberIds[0];
      listOfMemberIds.shift();
      console.log(memberid);

      // $.get("/api/list_apps_dashboard/" + memberid2).then(function (data) {
      //   console.log(data);
      //   listOfApps.push(data[0].App_name);
      //   listOfUN.push(data[0].AppUsername);
      //   listOfPW.push(data[0].AppPassword);
      //   getUserId(cb)
      // });
      getUserID2(memberid);
    }
    else {
      cb();
    }

  }

  function getUserID2(memberid) {
    $.get("/api/list_apps_dashboard/" + memberid).then(function (data) {
      console.log(data);
      listOfApps.push(data[0].App_name);
      listOfUN.push(data[0].AppUsername);
      listOfPW.push(data[0].AppPassword);

      // for (var k = 0; k < listOfApps.length; k++) {
      //   $("#dashboardBody").append(createNewTableRow(listOfApps[k], listOfUN[k], listOfPW[k], listOfMembers[k]));
      // };

      displayDash2();

    });
  };

  //Needed for the table to work
  var count = 0;

  function createNewTableRow(owner) {

    count++;

    //Creating a div for the app
    var newAppDiv = $("<a id='appLink" + count + "'>");

    //Creating a div for the inputs in the frontend
    var newUNInputDiv = $("<input id='username_input" + count + "'>");
    $("#clipboardStuff").append(newUNInputDiv);

    //Creating a button for usernames
    var userUN_BTN = $("<button id='username_BTN" + count + "'>");
    userUN_BTN.addClass("btn btn-danger");
    userUN_BTN.addClass("UN-" + count);
    userUN_BTN.text("Username");

    //Creating a div for the inputs in the frontend
    var newPWInputDiv = $("<input id='password_input" + count + "'>");
    $("#clipboardStuff").append(newPWInputDiv);

    //Creating a button for passwords
    var userPW_BTN = $("<button id='password_BTN" + count + "'>");
    userPW_BTN.addClass("btn btn-danger");
    userPW_BTN.addClass("PW-" + count);
    userPW_BTN.text("Password");

    //Setting Up the Card
    var newAppRow = $("<tr>").append(
      // App image / which is also a link will replace data.x below...
      $("<td>").append(newAppDiv),
      // App username, represented by a button, will replace data.y below...
      $("<td>").append(userUN_BTN),
      // App password, represented by a button, will replace data.z below...
      $("<td>").append(userPW_BTN),
      // Auser who provides the application, will replace data.Name...
      $("<td>").text(owner));

    return newAppRow;

  };

  function addingAppToTable(appName) {
    switch (appName) {
      case "Netflix":
        $("#appLink" + count).append("<a href='https://www.netflix.com/' target='_blank'><img class='linkIcons rounded-circle' src='stylesheets/img/serviceIcons/iconfinder_netflix_143870.png' alt='Netflix Icon' value='Netflix'></a>");
        break;
      case "Hulu":
        $("#appLink" + count).append("<a href='https://www.hulu.com/' target='_blank'><img class='linkIcons rounded-circle' src='stylesheets/img/serviceIcons/hulu-icon.png' alt='Hulu Icon' value='Hulu'></a>");
        break;
      case "Spotify":
        $("#appLink" + count).append("<a href='https://www.spotify.com/us/' target='_blank'><img class='linkIcons rounded-circle' src='stylesheets/img/serviceIcons/iconfinder_Spotify_1298766.png' alt='Spotify Icon' value='Spotify'></a>");
        break;
      case "HBO":
        $("#appLink" + count).append("<a href='https://play.hbonow.com/page/urn:hbo:page:home' target='_blank'><img class='linkIcons rounded-circle' src='stylesheets/img/serviceIcons/hbo-now-gift-card-taxon.png' alt='HBO Icon' value='HBO'></a>");
        break;
      case "NyTimes":
        $("#appLink" + count).append("<a href='https://www.nytimes.com/' target='_blank'><img class='linkIcons rounded-circle' src='stylesheets/img/serviceIcons/iconfinder_new_york_times_143900.png' alt='NyTimes Icon' value='NyTimes'></a>");
        break;
    };
  }

  // ---------------------------------------------------------------------

  // Clipboard Function

  function doCopy(unique) {
    var msg = "";

    unique.forEach(function (unique) {
      msg += unique.value;
    });

    var temp = document.createElement("textarea");
    var tempMsg = document.createTextNode(msg);
    temp.appendChild(tempMsg);

    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
    console.log("Success!")
  };

  //Adding inputs into the frontend
  function addInputs(username, password) {

    //Adds the value of username to the input
    $("#username_input" + count).val(username);

    //Adds the value of username to the button
    $("#username_BTN" + count).val(username);

    //Adds the value of password to the input
    $("#password_input" + count).val(password);

    //Adds the value of password to the button
    $("#password_BTN" + count).val(password);


    //For the username buttons to work
    $("#username_BTN1").on("click", function (event) {
      event.preventDefault();
      var UserUN = document.querySelectorAll('.UN-1');
      doCopy(UserUN);
    });

    $("#username_BTN2").on("click", function (event) {
      event.preventDefault();
      var UserUN = document.querySelectorAll('.UN-2');
      doCopy(UserUN);
    });

    $("#username_BTN3").on("click", function (event) {
      event.preventDefault();
      var UserUN = document.querySelectorAll('.UN-3');
      doCopy(UserUN);
    });

    $("#username_BTN4").on("click", function (event) {
      event.preventDefault();
      var UserUN = document.querySelectorAll('.UN-4');
      doCopy(UserUN);
    });

    $("#username_BTN5").on("click", function (event) {
      event.preventDefault();
      var UserUN = document.querySelectorAll('.UN-5');
      doCopy(UserUN);
    });

    //For the password buttons to work
    $("#password_BTN1").on("click", function (event) {
      event.preventDefault();
      var UserPW = document.querySelectorAll('.PW-1');
      doCopy(UserPW);
    });

    $("#password_BTN2").on("click", function (event) {
      event.preventDefault();
      var UserPW = document.querySelectorAll('.PW-2');
      doCopy(UserPW);
    });

    $("#password_BTN3").on("click", function (event) {
      event.preventDefault();
      var UserPW = document.querySelectorAll('.PW-3');
      doCopy(UserPW);
    });

    $("#password_BTN4").on("click", function (event) {
      event.preventDefault();
      var UserPW = document.querySelectorAll('.PW-4');
      doCopy(UserPW);
    });

    $("#password_BTN5").on("click", function (event) {
      event.preventDefault();
      var UserPW = document.querySelectorAll('.PW-5');
      doCopy(UserPW);
    });

  };



});

