function initProgressBar(progress, sdsSold) {
  var bar = new ProgressBar.Line("#progressbar", {
  strokeWidth: 4,
  easing: 'easeInOut',
  duration: 1400,
  color: '#FFEA82',
  trailColor: '#eee',
  trailWidth: 1,
  svgStyle: {width: '100%', height: '100%'},
  text: {
    style: {
      // Text color.
      // Default: same as stroke color (options.color)
      color: '#999',
      position: 'absolute',
      right: '0',
      top: '30px',
      padding: 0,
      margin: 0,
      transform: null
    },
    autoStyleContainer: false
  },
  from: {color: '#FFEA82'},
  to: {color: '#009f78'},
  step: (state, bar) => {
    bar.path.setAttribute('stroke', state.color);
    let percentage = (bar.value() * 100).toFixed(2);
    if (percentage == 0.00 & bar.value() > 0.00) percentage = 0.01;
    bar.setText(percentage + ' %');
  }
});

  bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
  bar.text.style.fontSize = '2rem';
  bar.animate(progress);  // Number from 0.0 to 1.0

  var textElement = document.getElementsByClassName("progressbar-text")[0];
  var cloned = textElement.cloneNode(true);
  cloned.style.right = "";
  cloned.style.left = "0px";
  cloned.class = "";
  cloned.innerHTML = numberWithDots(sdsSold) + " SEEDS sold to date";
  document.getElementById("progressbar").appendChild(cloned);
}

function initTokenSold(sdsSold) {
  if (sdsSold > 0) {
    document.getElementById("tokenSold").innerHTML = numberWithDots(sdsSold) + " SEEDS sold to date";
  }
}

function numberWithDots(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  if (t < 0) t = 0;
  var seconds = Math.floor((t / 1000) % 60);
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds
  };
}

function initializeClock(deadline) {
  var endtime = new Date(deadline);
  var clock = document.getElementById('clockdiv-container');
  var daysSpan = clock.querySelector('.days');
  var hoursSpan = clock.querySelector('.hours');
  var minutesSpan = clock.querySelector('.minutes');
  var secondsSpan = clock.querySelector('.seconds');

  function updateClock() {
    var t = getTimeRemaining(endtime);

    daysSpan.innerHTML = t.days;
    hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
    secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

    if (t.total <= 0) {
      clearInterval(timeinterval);
    }
  }

  updateClock();
  var timeinterval = setInterval(updateClock, 1000);
}

function init(deadline, percentageCompleted, sdsSold, showSignin, showSignup) {

  if (showSignin) $('#modalSigninForm').modal('show');
  if (showSignup) $('#modalSignupForm').modal('show');

  initializeClock(deadline);
  // try {initProgressBar(percentageCompleted / 100, sdsSold);} catch(e) {}
  try {initTokenSold(sdsSold);} catch(e) {}
}
