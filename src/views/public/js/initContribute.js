
function getOffset(el) {
  el = el.getBoundingClientRect();
  return {
    left: el.left + window.scrollX,
    top: el.top + window.scrollY
  }
}

function adjustCross(discount) {
  if (discount) {
    var eth = document.getElementById('eth');
    var cross = document.getElementById('red-cross');
    const offset = getOffset(eth);
    cross.style.left = offset.left;
    cross.style.top = offset.top;
  }
}

function initConverter(sdsPrice, discount) {

  adjustCross(discount);

  var sds = document.getElementById('sds');
  var eth = document.getElementById('eth');
  var ethDiscounted = document.getElementById('eth-discount');

  if (discount) {
    var sdsPriceDiscounted = sdsPrice * (100 - discount) / 100;
    ethDiscounted.value = sdsPriceDiscounted;
    eth.disabled = true;
  }

  const updateEth = function() {
    const sdsValue = parseFloat(sds.value);
    const ethPrice = sdsValue * parseFloat(sdsPrice);
    eth.value = ethPrice || "";

    if (discount) {
      const ethPriceDiscounted = sdsValue * parseFloat(sdsPriceDiscounted);
      ethDiscounted.value = ethPriceDiscounted || "";
    }
  }

  sds.oninput = updateEth;
  sds.onpropertychange = sds.oninput; // for IE8

  const updateSds = function() {
    const ethValue = parseFloat(eth.value);
    const sdsValue = ethValue / parseFloat(sdsPrice);
    sds.value = sdsValue || "";
  }

  eth.oninput = updateSds;
  eth.onpropertychange = eth.oninput; // for IE8

  const updateFromDiscount = function() {
    const ethDiscountedValue = parseFloat(ethDiscounted.value);
    const sdsValue = ethDiscountedValue / parseFloat(sdsPriceDiscounted);
    sds.value = sdsValue || "";

    const ethPrice = sdsValue * parseFloat(sdsPrice);
    eth.value = ethPrice || "";
  }

  if (discount) {
    ethDiscounted.oninput = updateFromDiscount;
    ethDiscounted.onpropertychange = ethDiscounted.oninput; // for IE8
  }
}

function initContribute(sdsPrice, discount, showAddress) {

  initConverter(sdsPrice, discount);
  if (showAddress) requestAddress();
}
