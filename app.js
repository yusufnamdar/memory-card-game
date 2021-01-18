const cards = document.querySelectorAll(".card");
const finished = document.querySelector("#finished");
const clickStart = document.querySelector("#start");
const clickReset = document.querySelector("#reset");

class AudioController {
  constructor() {
    this.bgMusic = new Audio("./assets/Audio/bensound-clearday.mp3");
    this.flipSound = new Audio("./assets/Audio/flip.wav");
    this.bgMusic.loop = true;
    this.bgMusic.volume = 0.06;
    this.flipSound.volume = 0.5;
  }
  startBgMusic() {
    this.bgMusic.play();
  }
  stopBgMusic() {
    this.bgMusic.load();
  }
  startFlipSound() {
    this.flipSound.play();
  }
}
const audioController = new AudioController();

//Variables to determine the two cards that are going to be checked for a match
let firstCard, secondCard;
//When score reaches 8, player won
let score = 0;
//When counter reaches 0, player lost
let counter = 100;
//stopFlip will prevent another flip during unflipping by setTimeout()
let busy = false;
//Have to create global timer variable of setTimeInterval(), otherwise victory() function does not work due to timer being undefined
let timer;

clickStart.addEventListener("click", runGame);

//Main function
function runGame() {
  shuffle();
  audioController.startBgMusic();

  cards.forEach((card) => {
    card.addEventListener("click", flip);
  });

  //Timer to limit game rounds
  timer = setInterval(() => {
    counter--;
    finished.innerText = `Timer: ${counter}`;
    if (counter === 0) {
      clearInterval(timer);
      gameOver();
    }
  }, 1000);

  //Reset the game
  clickReset.addEventListener("click", () => {
    audioController.stopBgMusic();
    clearInterval(timer);
    //Unflip all of the cards, before click event added to all of them
    resetBoard();
    changeButtontoStart();
  });
  changeButtontoReset();
}

function flip() {
  if (!busy) {
    audioController.startFlipSound();
    if (firstCard === undefined) {
      //firstCard is assigned to the card that is clicked
      firstCard = this;
      this.classList.add("visible");
    } else if (firstCard !== this) {
      //else if condition to remove the possibility of assigning the same exact card to secondCard variable
      secondCard = this;
      this.classList.add("visible");
      checkForMatch();
    }
  }
}

//In sequence, check for match > if match, disable the two cards : else reset the two by removing visible class
function checkForMatch() {
  if (firstCard.dataset.id === secondCard.dataset.id) {
    disableTwoCards();
    score++;
    resetTwoCards();
    if (score === 8) {
      victory();
    }
  } else {
    busy = true;
    unFlipTwoCards();
  }
}

//--Functions that are used--

function resetTwoCards() {
  firstCard = undefined;
  secondCard = undefined;
  busy = false;
}

//Reverting the variables back to their initial values
function resetBoard() {
  counter = 100;
  score = 0;
  finished.style.color = "whitesmoke";
  finished.innerText = `Timer: ${counter}`;
  cards.forEach((card) => {
    card.classList.remove("visible");
    card.removeEventListener("click", flip);
  });
}

function gameOver() {
  audioController.stopBgMusic();
  cards.forEach((card) => {
    card.removeEventListener("click", flip);
  });
  finished.style.color = "rgb(146, 0, 0)";
  finished.innerText = "Game Over!!!";
}

function shuffle() {
  cards.forEach((card) => {
    const randomOrder = Math.floor(Math.random() * 16) + 1;
    card.style.order = randomOrder;
  });
}

function changeButtontoReset() {
  clickStart.classList.add("invisible");
  clickReset.classList.remove("invisible");
}

function changeButtontoStart() {
  clickStart.classList.remove("invisible");
  clickReset.classList.add("invisible");
}

function disableTwoCards() {
  firstCard.removeEventListener("click", flip);
  secondCard.removeEventListener("click", flip);
}

function unFlipTwoCards() {
  setTimeout(() => {
    firstCard.classList.remove("visible");
    secondCard.classList.remove("visible");
    resetTwoCards();
  }, 800);
}

function victory() {
  clearInterval(timer);
  finished.style.color = "white";
  finished.innerText = "You have won!!!";
  audioController.stopBgMusic();
}
