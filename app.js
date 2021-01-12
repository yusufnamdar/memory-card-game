const cards = document.querySelectorAll(".card");

cards.forEach((card) => {
  card.addEventListener("click", flip);
});

let flipped = false;
let firstCard, secondCard;

function flip(e) {
  this.classList.add("visible");
  const className = e.target.className;
  if (!flipped) {
    flipped = true;
    firstCard = this;
    console.dir(e.target);
  } else if (
    className === "symbol-img" ||
    className === "both-side back-side"
  ) {
    flipped = false;
    secondCard = this;
    console.log(firstCard, secondCard);
  }
}
//var p = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6]
//  .map((a) => [a, Math.random()])
//  .sort((a, b) => a[1] - b[1])
//  .map((p) => p[0]);
//console.log(p);
