let correctHandbagId = "handbag1"; // Replace with the correct handbag ID
let penaltyTime = 10; // Penalty time in seconds

const handbags = Array.from(document.querySelectorAll('.handbag'));
const checkButton = document.getElementById('checkButton');
const chihuahuaContainer = document.getElementById('chihuahua-container');
const chihuahua = document.getElementById('chihuahua');
const timerValue = document.getElementById('timer-value');

let selectedHandbag = null;
let penaltyActive = false;
let timerInterval = null;
let timeRemaining = penaltyTime;

handbags.forEach(handbag => {
  handbag.addEventListener('click', () => {
    if (penaltyActive) return;
    if (selectedHandbag) selectedHandbag.classList.remove('selected');
    selectedHandbag = handbag;
    selectedHandbag.classList.add('selected');
  });
});

checkButton.addEventListener('click', () => {
  if (penaltyActive || !selectedHandbag) return;

  if (selectedHandbag.getAttribute("data-handbag-id") === correctHandbagId) {
    chihuahuaContainer.style.backgroundColor = "green";
    alert("Correct handbag! Good job!");
  } else {
    chihuahuaContainer.style.backgroundColor = "red";
    alert("Wrong handbag! Try again.");
    activatePenalty();
  }
});

function activatePenalty() {
  penaltyActive = true;
  checkButton.disabled = true;
  startTimer();
  setTimeout(() => {
    penaltyActive = false;
    checkButton.disabled = false;
    resetGame();
    resetTimer();
  }, penaltyTime * 1000);
}

function startTimer() {
  clearInterval(timerInterval);
  timeRemaining = penaltyTime;
  timerInterval = setInterval(() => {
    timeRemaining--;
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
    }
    timerValue.textContent = timeRemaining;
  }, 1000);
}

function resetGame() {
  if (selectedHandbag) {
    selectedHandbag.classList.remove('selected');
    selectedHandbag = null;
  }
  chihuahuaContainer.style.backgroundColor = "initial";
  clearInterval(timerInterval);
  timerValue.textContent = "";
}

function resetTimer() {
  clearInterval(timerInterval);
  timerValue.textContent = "";
  checkButton.disabled = false;
}

handbags.forEach(handbag => {
  handbag.addEventListener('click', () => {
    if (selectedHandbag) {
      selectedHandbag.classList.remove('selected');
    }
    selectedHandbag = handbag;
    selectedHandbag.classList.add('selected');
  });
});