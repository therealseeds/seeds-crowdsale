function validateSigninForm() {
  const email = document.forms["signInForm"]["email"].value;
  return !(email == null || email == "");
}

function validateSignupForm() {
  const email = document.forms["signUpForm"]["newEmail"].value;
  if (email == null || email == "") {
    return false;
  }

  const password = document.forms["signUpForm"]["newPassword"].value;
  const confirmPasswordEl = document.forms["signUpForm"]["confirmPassword"];
  const confirmPassword = confirmPasswordEl.value;

  if (password != confirmPassword) {
    confirmPasswordEl.style.border = "1px solid";
    confirmPasswordEl.style.borderColor = "rgb(255, 0, 0)";
    confirmPasswordEl.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
  }

  return (password == confirmPassword);
}

function isLoggedInAlready(loggedIn) {
  if (!loggedIn) {
    $('#modalSigninForm').modal('show');
  } else {
    window.location.replace("/contribute");
  }
}
