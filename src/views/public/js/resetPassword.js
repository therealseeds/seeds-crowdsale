function sendResetLink() {
  const email = document.getElementById("email").value;
  if (email == null || email === "") {
    return false;
  }

  $.ajax({
    type: "POST",
    url: "/forgot-password",
    data: { email }
  });

  document.getElementById("email-input").style.display = "none";
  document.getElementById("link-sent").style.display = "block";
}

function resetPassword() {
  // Verify token exists
  const token = document.getElementById("token").value;
  if (!token) {
    return false;
  }

  // Verify passwords match
  const password = document.getElementById("password").value;
  const confirmPasswordEl = document.getElementById("password2");
  const confirmPassword = confirmPasswordEl.value;

  if (password !== confirmPassword) {
    confirmPasswordEl.style.border = "1px solid";
    confirmPasswordEl.style.borderColor = "rgb(255, 0, 0)";
    confirmPasswordEl.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
    return false;
  }

  // post request to /reset-password
  $.ajax({
    type: "POST",
    url: "/reset-password",
    data: { password, token }
  });

  document.getElementById("password-input").style.display = "none";
  document.getElementById("password-reset").style.display = "block";
}
