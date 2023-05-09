const gameContainer = document.querySelector('.game-container');
const dirtyDog = document.querySelector('.dirty-dog');
const cleanDog = document.querySelector('.clean-dog');

let isSwiping = false;
let dirtyDogOpacity = 1;

function revealCleanDog() {
  cleanDog.style.opacity = 1;
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

dirtyDog.addEventListener('mousedown', handleSwipeStart);
dirtyDog.addEventListener('touchstart', handleSwipeStart);

gameContainer.addEventListener('mousemove', handleSwipe);
gameContainer.addEventListener('touchmove', handleSwipe);

document.addEventListener('mouseup', handleSwipeEnd);
document.addEventListener('touchend', handleSwipeEnd);

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

