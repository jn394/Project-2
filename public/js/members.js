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