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
    signUpUsergroup();
  });

  function signUpGroup(name) {
    $.post("/api/signUpGroup", {
      name: name
    }).then(function (data) {
      console.log(data);
       // Need this for the "joinAGroupBTN" post request
    $("#group-id").text(data.id);
    $("#group-id").attr("value", data.id);
      // If there's an error, handle it by throwing up a bootstrap alert
    }).catch(handleLoginErr);

    
  }

  function signUpUsergroup(){
    $(document).on("click", "#submitgroup", function () {
      console.log("You are now the Group Admin!!");
  

      var usergroup_data = {
        GroupID: $("#group-id").attr("value"),
        UserID: $("#member-id").attr("value")
      };
  
      $.post("/api/signUpUsergroup", {
        GroupId: usergroup_data.GroupID,
        UserId: usergroup_data.UserID
      }).then(function (data) {
        console.log("Group that you joined: ");
        console.log(data);
        $("#displayGroup").append("\n  AYYYY!! You have Made the Group: " + data.GroupId);
        // $("#joinGroupBTN").hide();
  
        // If there's an error, handle it by throwing up a bootstrap alert
      }).catch(handleLoginErr);
    })
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
      $("#displayGroup").append("Congratz!! You have joined Group: " + data.GroupId);
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


  // -------------------  ADD A SERVICE LOGIC -----------------------//

  // $(document).on("click", "button.joinAGroupBTN", function () {
  $("#subscriptionsubmit").on("click", function (event) {
    event.preventDefault();
   
    console.log("clicked add!!")

    var appName = ""

    // Logic to determne which service has been clicked ... annoying coudlnt use .val for this but was the only way i could get it working //

    if ($('#netflix').is(":checked") ){
      appName = "Netflix";
    }else if ($('#hulu').is(":checked")){
      appName = "Hulu"
    }else if ($('#spotify').is(":checked")){
      appName = "Spotify"
    }else if ($('#hbo').is(":checked")){
      appName = "HBO"};


console.log(appName, "App name ------");


var appData = {
    app_username: $("#appUN-input").val().trim(),
    app_password: $("#appPW-input").val().trim(),
    app: appName

  };

  console.log(appData)

  // GET REQUEST TO Get AppName so we can run logic to check if already has netflix

  checkApp()

  addApp(appData.app, appData.app_username, appData.app_password, $("#member-id").attr("value") )

});

function addApp(app, username, password, id) {
  $.post("/api/addapp", {
    app: app,
    username: username,
    password: password,
    UserId: id
  }).then(function (data) {
    console.log(data)
    // If there's an error, handle it by throwing up a bootstrap alert
  }).catch(handleLoginErr);
}

function handleLoginErr(err) {
  $("#alert .msg").text(err.responseJSON);
  $("#alert").fadeIn(500);
}


  // ---------------------------------------------------------------//



});


