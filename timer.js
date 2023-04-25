function startTimer(duration, display) {
  var timer = duration,
    minutes,
    seconds;
  setInterval(function () {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    display.textContent = "Time left: " + minutes + "m " + seconds + "s";

    if (--timer < 0) {
      alert("Time's up!");
      timer = duration;
    }
  }, 1000);
}
