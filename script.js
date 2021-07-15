let sequence = []; //sequence of computer button clicks

let humanSequence = []; //sequence of human player's button clicks

let level = 0; //sets level counter to zero

const startButton = document.querySelector('.js-start'); //start button

const resetButton = document.querySelector('.js-reset') //reset button

const info = document.querySelector('.js-info'); //game alerts

const heading = document.querySelector('.js-heading'); //level heading

const winModal = document.querySelector('.win-modal'); //winning modal

const loseModal = document.querySelector('.lose-modal'); //losing modal

const tileContainer = document.querySelector('.js-container'); //container for color tiles

const playAgain = document.querySelector(".play-again-button"); //play again

const startOver = document.querySelector(".start-over-button"); //start over

function resetGame() { //resets game
  //clear arrays
  sequence = [];
  humanSequence = [];
  level = 0;
  //unhide start button
  startButton.classList.remove('hidden');
  //hide reset button
  resetButton.classList.add('hidden');
  //apply heading when not playing a game
  heading.textContent = 'Get Schwifty!';
  //hide gameplay texts
  info.classList.add('hidden');
  //make game buttons unclickable
  tileContainer.classList.add('unclickable');
}

function humanTurn(level) { //player's turn
  tileContainer.classList.remove('unclickable'); //makes buttons clickable
  info.textContent = `Your turn: ${level} Click(s)`; //informs player it's their turn, returns number of clicks 
}

function activateTile(color) { //activate tile
  const tile = document.querySelector(`[data-tile='${color}']`); //color of button
  const sound = document.querySelector(`[data-sound='${color}']`); //sound of button

  tile.classList.add('activated'); //deactivate tiles
  sound.play();

  setTimeout(() => {
    tile.classList.remove('activated');
  }, 300);
}

function playRound(nextSequence) {
  nextSequence.forEach((color, index) => {
    //sets a delay between activated tiles
    //otherwise they all light up at the same time
    setTimeout(() => {
      activateTile(color);
    }, (index + 1) * 800);
  });
}

function nextStep() {
  const tiles = ['red', 'green', 'blue', 'yellow'];
  const random = tiles[Math.floor(Math.random() * tiles.length)];

  return random;
}

function nextRound() {
  level += 1; //increments level counter
  //makes tiles unclickable
  tileContainer.classList.add('unclickable');
  //lets player know computer sequence is going 
  info.textContent = 'Wait for the computer';
  //updates level in heading
  heading.textContent = `Level ${level} of 5`;

  const nextSequence = [...sequence];
  nextSequence.push(nextStep());
  playRound(nextSequence);

  sequence = [...nextSequence];
  setTimeout(() => {
    humanTurn(level);
  }, level * 800 + 1000);
}

//function to manage game as each click happens
//so player knows if they messed up as soon as they do it
function handleClick(tile) {
  const index = humanSequence.push(tile) - 1;
  const sound = document.querySelector(`[data-sound='${tile}']`);
  sound.play();

  //continuously count down remaining clicks
  const remainingClicks = sequence.length - humanSequence.length;

  //compare info from tiles as it's going
  if (humanSequence[index] !== sequence[index]) {
    displayLoseModal();
    //WRONG!!!
    const sound = document.querySelector(`[data-sound='wrong']`);
    sound.play();
    resetGame();
    return;
  }
  //if player won the round...
  if (humanSequence.length === sequence.length) {
    //check to see if all 10 rounds were completed
    if (humanSequence.length === 5) {
      displayWinModal(); //winning modal
      //WUBBA LUBBA DUB DUB!!!
      const sound = document.querySelector(`[data-sound='win']`);
      sound.play();
      return;
    }
    //otherwise, move to next round
    humanSequence = []; //clears human array
    //lets player know they got it right
    info.textContent = 'Getting schwifty! Keep going!';
    //slight pause before running next round
    setTimeout(() => {
      nextRound();
    }, 1000);
    return;
  }

  //info with remaining clicks
  info.textContent = `Your turn: ${remainingClicks} Click(s)`;
}

//starts game
function startGame() {
  //SHOW ME WHAT YOU GOOOOOT!!!
  const sound = document.querySelector(`[data-sound='showme']`);
  sound.play();
  setTimeout(nextRound, 4000);
  startButton.classList.add('hidden');//hides start button
  resetButton.classList.remove('hidden');//unhides reset button
  info.classList.remove('hidden'); //shows info button
  info.textContent = 'Wait for the computer'; //alerts player of computer sequence
  // nextRound(); //moves to next round
}

//turns on event listener with start button
startButton.addEventListener('click', startGame);

//turns on event listener with reset button
resetButton.addEventListener('click', resetGame);


//turns on event listener with tile click
tileContainer.addEventListener('click', event => {
  const { tile } = event.target.dataset;
  //if tile area is clicked, check tile
  if (tile) handleClick(tile);
});

function displayWinModal() {
  function closeModal() {
    //close modal on 'x'
    winModal.style.display = "none"; //set modal to exit
  }
  playAgain.addEventListener('click', function () {
    resetGame();
    closeModal();
  })
  const modalClose = document.querySelector('.close');
  winModal.style.display = "block"; //set modal to show
  modalClose.addEventListener('click', closeModal);
}


function displayLoseModal() {
  function closeModal() {
    //close modal on 'x'
    loseModal.style.display = "none"; //set modal to exit
  }
  startOver.addEventListener('click', function () {
    resetGame();
    closeModal();
  })
  const modalClose = document.querySelectorAll('.close')[1];
  loseModal.style.display = "block"; //set modal to show
  modalClose.addEventListener('click', closeModal);
}