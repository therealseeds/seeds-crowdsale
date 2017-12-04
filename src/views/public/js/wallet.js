function requestAddress() {
  var button = document.getElementById('request-wallet');
  var loading = document.getElementById('loading');
  var address = document.getElementById('wallet-address');
  var qrCode = document.getElementById('qr-code');
  var addressContainer = document.getElementById('address-container');
  var buySeeds = document.getElementById('buy-seeds');
  var balance = document.getElementById('balance');
  var buyBtn = document.getElementById("buy-seeds-btn");
  var notes = document.getElementsByClassName('note');

  button.style.display = "none";
  loading.style.display = "inline-block";

  $.ajax({
    type: "GET",
    url: "/wallet",
    success: function (data) {
      if (!data.address) {
        data = JSON.parse(data);
      }

      loading.style.display = "none";
      address.innerHTML = data.address;
      qrCode.src = `qr/${data.address}`;

      addressContainer.style.display = "inline-block";
      buySeeds.style.display = "inline-block";
      balance.innerHTML = data.balance;
      buyBtn.disabled = (data.balance == 0) ? true : false;

      for (let note of notes) {
        note.style.display = "inline-block";
      }
    },
    error: function (xhr, ajaxOptions, thrownError) {
      if(xhr.status==403) {
        button.disabled = true;
        button.style.display = "inline-block";
        loading.style.display = "none";
      }
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
