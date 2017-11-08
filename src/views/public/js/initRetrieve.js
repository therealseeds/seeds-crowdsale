function showError(addressError) {
  const error = document.getElementById("address-error");
  if (addressError) {
    error.style.display = "inline-block";
  } else {
    error.style.display = "none";
  }
}

function validateAddress() {
  const address = document.forms["addressForm"]["address"].value;
  const valid = !(address == null || address == "" || !(address.length == 42 || address.startsWith("0x")));
  showError(!valid);
  return valid;
}

function initRetrieve(addressError, seedsTokens) {
  showError(addressError);

  var retrieveBtn = document.getElementById("retrieve-seeds-btn");
  retrieveBtn.disabled = (seedsTokens == 0) ? true : false;
}
