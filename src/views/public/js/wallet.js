function requestAddress() {
  var button = document.getElementById('request-wallet');
  button.style.display = "none";

  var loading = document.getElementById('loading');
  loading.style.display = "inline-block";

  $.get( "/wallet", function( data, statusText, xhr ) {

    if (!data.address) {
      data = JSON.parse(data);
    }

    if (xhr.status == 200) {
      var loading = document.getElementById('loading');
      loading.style.display = "none";

      var address = document.getElementById('wallet-address');
      address.innerHTML = data.address;

      var qrCode = document.getElementById('qr-code');
      qrCode.src = `qr/${data.address}`;

      var addressContainer = document.getElementById('address-container');
      addressContainer.style.display = "inline-block";

      var buySeeds = document.getElementById('buy-seeds');
      buySeeds.style.display = "inline-block";

      var balance = document.getElementById('balance');
      balance.innerHTML = data.balance;

      var buyBtn = document.getElementById("buy-seeds-btn");
      buyBtn.disabled = (data.balance == 0) ? true : false;

    } else {
      // Handle error status
    }
  });
}

function refreshBalance() {

  $.get( "/wallet", function( data, statusText, xhr ) {

    if (!data.address) {
      data = JSON.parse(data);
    }

    if (xhr.status == 200) {

      var balance = document.getElementById('balance');
      balance.innerHTML = data.balance;

      var buyBtn = document.getElementById("buy-seeds-btn");
      buyBtn.disabled = (data.balance == 0) ? true : false;

    } else {
      // Handle error status
    }
  });
}
