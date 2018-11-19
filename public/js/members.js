$(document).ready(function () {
  // This file just does a GET request to figure out which user is logged in
  // and updates the HTML on the page
  $.get("/api/user_data").then(function (data) {
    $(".member-name").text(data.email);
  });

  //Clipboard Password
  $("#userID").on("click", function (event) {
    event.preventDefault();
    $.get("/api/user_username").then(function (data) {
      console.log(data);
    });

    // $(this).focus();
    // $(this).select();
    // document.execCommand('copy');
  });

  var input = document.querySelector("input");

  $.get("/api/user_password").then(function (data) {
    console.log(data);

    $("#test").innerHTML = data.netflix_password;
  });

  $("#passwordID").on("click", function (event) {
    event.preventDefault();

    document.execCommand("selectAll");
    document.execCommand("copy");

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
    return console.log ("thats a dumb... name try again!");
    // TODO  Generate validation saying name is taken or you need to fill it in
  }
  // If group name is generated and no issue, 

  signUpGroup(groupData.name);
  inputGroupName.val("");
 });

function signUpGroup(name) {
  $.post("/api/signUpGroup", {
    name: name
  }).then(function (data) {
    window.location.replace(data);
    Console.log(data);
    // If there's an error, handle it by throwing up a bootstrap alert
  }).catch(handleLoginErr);
}


});

// javascript: (function () {
//   function f1(el,val){
//     if(document.getElementById(el) && val != ''){
//       document.getElementById(el).value = val;
//     }
//   }
//   f1("email-input","test@gmail.com");
//   f1("password-input","1234");
// })();


