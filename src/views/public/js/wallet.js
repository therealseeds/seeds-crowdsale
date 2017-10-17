function requestAddress() {
  var button = document.getElementById('request-wallet');
  button.style.display = "none";

  var loading = document.getElementById('loading');
  loading.style.display = "inline-block";

  $.get( "/wallet", function( data, statusText, xhr ) {

    if (xhr.status == 200) {
      var loading = document.getElementById('loading');
      loading.style.display = "none";

      var address = document.getElementById('wallet-address');
      address.innerHTML = data.address;

      var qrCode = document.getElementById('qr-code');
      qrCode.src = `qr/${data.address}`;

      var addressContainer = document.getElementById('address-container');
      addressContainer.style.display = "inline-block";

    } else {
      // Handle error status
    }
  });
}
