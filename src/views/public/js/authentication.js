function validateSigninForm() {
  const email = document.forms["signInForm"]["email"].value;
  return !(email == null || email == "");
}

function validateSignupForm() {
  const email = document.forms["signUpForm"]["email"].value;
  if (email == null || email == "") {
    return false;
  }

  const password = document.forms["signUpForm"]["password"].value;
  const confirmPasswordEl = document.forms["signUpForm"]["confirm-password"];
  const confirmPassword = confirmPasswordEl.value;

  return (password == confirmPassword);
}

function isLoggedInAlready(loggedIn) {
  if (!loggedIn) {
    $('#modalSigninForm').modal('show');
  } else {
    window.location.replace("/contribute");
  }
}
