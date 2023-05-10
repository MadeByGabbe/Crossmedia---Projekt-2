const gameContainer = document.querySelector('.game-container');
const dirtyDog = document.querySelector('.dirty-dog');
const cleanDog = document.querySelector('.clean-dog');

function handlePoodleGameStart() {
  gameContainer.style.display = 'flex';
  let dogMessageDiv = document.createElement('div');
  let dogMessage = document.createElement('p');
  let dogMessageButton = document.createElement('button');
  dogMessageDiv.classList.add('dog-message');
  gameContainer.appendChild(dogMessageDiv);
  dogMessageDiv.appendChild(dogMessage);
  dogMessage.classList.add('dog-message-text');
  dogMessage.innerHTML = 'Denna parken \u00E4r s\u00E5 smutsig! Om du vill f\u00E5nga mig m\u00E5ste du tv\u00E4tta mig f\u00F6rst!';
  dogMessageButton.classList.add('dog-message-button');
  dogMessageButton.innerHTML = 'Jag f\u00F6rst\u00E5r';
  dogMessageDiv.appendChild(dogMessageButton);
  dogMessageButton.addEventListener('click', () => {
    dogMessageDiv.style.display = 'none';
    setEventListeners();
  });
  dogMessageButton.addEventListener('touchstart', () => {
    dogMessageDiv.style.display = 'none';
    setEventListeners();
  });
}



let isSwiping = false;
let dirtyDogOpacity = 1;

function revealCleanDog() {
  cleanDog.style.opacity = 1;
  let dogMessage = document.querySelector('.dog-message-text');
  let dogMessageDiv = document.querySelector('.dog-message');
  dogMessage.innerHTML = 'Tack f\u00F6r att du tv\u00E4ttade mig! Du har f\u00E5ngat mig!';
  dogMessageDiv.style.display = 'flex';
  
  let dogMessageButton = document.querySelector('.dog-message-button');
  dogMessageButton.innerHTML = 'F\u00E5nga';
  dogMessageButton.addEventListener('touchstart', () => {
    gameContainer.style.display = 'none';
  });
}

function handleSwipe(event) {
  if (isSwiping) {
    event.preventDefault();
    const x = event.clientX || event.touches[0].clientX;
    const y = event.clientY || event.touches[0].clientY;
    const element = document.elementFromPoint(x, y);
    if (element === dirtyDog) {
      if(dirtyDogOpacity > 0) {
        element.style.opacity = dirtyDogOpacity = dirtyDogOpacity - 0.005; // Change this to change the speed of cleaning	
        cleanDog.style.opacity = 1 - dirtyDogOpacity;
      }
      if (parseFloat(element.style.opacity) <= 0) {
        revealCleanDog();
      }
      setTimeout(() => {
        element.style.opacity = dirtyDogOpacity;
      }, 0);
    }
  }
}

function handleSwipeStart(event) {
  console.log('swipe start');
  isSwiping = true;
  event.preventDefault();
}

function handleSwipeEnd(event) {
  isSwiping = false;
  event.preventDefault();
}

function setEventListeners() {
  dirtyDog.addEventListener('mousedown', handleSwipeStart);
  dirtyDog.addEventListener('touchstart', handleSwipeStart);

  gameContainer.addEventListener('mousemove', handleSwipe);
  gameContainer.addEventListener('touchmove', handleSwipe);

  document.addEventListener('mouseup', handleSwipeEnd);
  document.addEventListener('touchend', handleSwipeEnd);
}

// Create bubble element
function createBubble(x, y) {
  if (isSwiping) {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    bubble.style.left = x + 'px';
    bubble.style.top = y + 'px';
    document.body.appendChild(bubble);

    // Remove bubble after delay
    setTimeout(() => {
      bubble.remove();
    }, 2000);
  }
}

// Listen for mousemove events
document.addEventListener('mousemove', (event) => {
  createBubble(event.clientX, event.clientY);
});

