$(document).ready(function () {
  // Getting references to our form and input
  var signUpForm = $("form.signup");
  var emailInput = $("input#email-input");
  var passwordInput = $("input#password-input");
  //Clipboard Password
  var netflixUNInput = $("input#netflixUN-input");
  var netflixPWInput = $("input#netflixPW-input");

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", function (event) {
    event.preventDefault();
    var userData = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim(),
      //Clipboard Password
      netflix_username: netflixUNInput.val().trim(),
      netflix_password: netflixPWInput.val().trim()
    };

    if (!userData.email || !userData.password) {
      return;
    }
    // If we have an email and password, run the signUpUser function

    //Clipboard Password
    signUpUser(userData.email, userData.password, userData.netflix_username, userData.netflix_password);
    emailInput.val("");
    passwordInput.val("");
    netflixUNInput.val("");
    netflixPWInput.val("");

  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors

  //Clipboard Password
  function signUpUser(email, password, netflix_username, netflix_password) {
    $.post("/api/signup", {
      email: email,
      password: password,
      netflix_username: netflix_username,
      netflix_password: netflix_password
    }).then(function (data) {
      window.location.replace(data);
      // If there's an error, handle it by throwing up a bootstrap alert
    }).catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});
