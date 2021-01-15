const cards = document.querySelectorAll(".card");
const finished = document.querySelector("#finished");
const clickStart = document.querySelector("#start");
const clickReset = document.querySelector("#reset");

class AudioController {
  constructor() {
    this.bgMusic = new Audio("./assets/Audio/bensound-clearday.mp3");
    this.flipSound = new Audio("./assets/Audio/flip.wav");
    this.bgMusic.loop = true;
    this.bgMusic.volume = 0.3;
    this.flipSound.volume = 1;
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

clickStart.addEventListener("click", runGame);

//Main function
function runGame() {
  resetBoard();
  shuffle();
  audioController.startBgMusic();
  cards.forEach((card) => {
    card.addEventListener("click", flip);
  });

  //Timer to limit game rounds
  let timer = setInterval(() => {
    counter--;
    finished.innerText = `Timer: ${counter}`;
    if (counter === 0) {
      clearInterval(timer);
      gameOver();
    }
    console.log(counter);
  }, 1000);

  //Reset the game
  clickReset.addEventListener("click", () => {
    audioController.stopBgMusic();
    clearInterval(timer);
    //Unflip all of the cards, before click event added to all of them
    resetBoard();
    clickStart.classList.remove("invisible");
    clickReset.classList.add("invisible");
  });
  changeButtontoReset();
}

function flip() {
  if (!busy) {
    audioController.startFlipSound();
    if (firstCard === undefined) {
      //firstCard is assigned to the card that is clicked
      firstCard = this;
      console.dir(this);
      this.classList.add("visible");
    } else if (firstCard !== this) {
      //else if condition to remove the possibility of assigning the same exact card to secondCard variable
      secondCard = this;
      this.classList.add("visible");
      console.log(this);
      checkForMatch();
    }
  }
}

//In sequence, check for match > if match, disable the two cards : else reset the two by removing visible class
function checkForMatch() {
  if (firstCard.dataset.id === secondCard.dataset.id) {
    firstCard.removeEventListener("click", flip);
    secondCard.removeEventListener("click", flip);
    score++;
    resetLastTwoCards();
    console.log(score);
    if (score === 8) {
      finished.style.color = "green";
      finished.innerText = "You have won!!!";
      audioController.stopBgMusic();
    }
  } else {
    busy = true;
    setTimeout(() => {
      firstCard.classList.remove("visible");
      secondCard.classList.remove("visible");
      resetLastTwoCards();
    }, 800);
    console.log(firstCard, secondCard);
  }
}

function resetLastTwoCards() {
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
