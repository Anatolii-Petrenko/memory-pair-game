const imgsUrl = [
  'avocado-fruit-icon.svg',
  'almond-icon.svg',
  'banana-icon.svg',
  'beet-icon.svg',
  'blueberry-icon.svg',
  'carrots-icon.svg',
  'cashew-icon.svg',
  'cherries-icon.svg',
  'coconut-icon.svg',
  'corn-icon.svg',
  'eggplant-icon.svg',
  'fresh-apple-icon.svg',
  'garlic-icon.svg',
  'hazelnut-icon.svg',
  'kiwi-food-icon.svg',
  'mango-fruit-icon.svg',
  'olive-icon.svg',
  'onion-icon.svg',
  'orange-icon.svg',
  'papaya-icon.svg',
  'peach-fruit-icon.svg',
  'pineapple-fruit-icon.svg',
  'pomegranate-fruit-icon.svg',
  'pumpkin-icon.svg',
  'purple-grapes-icon.svg',
  'strawberry-fruit-icon.svg',
  'tomato-icon.svg',
  'watermelon-fruit-icon.svg',
];

const playingField = [
  [2, 2],
  [3, 4],
  [4, 4],
  [4, 5],
  [4, 6],
  [5, 6],
  [6, 6],
  [6, 7],
  [7, 8],
];

const cardsQuantityArr = playingField.map(item => item[0] * item[1]);

let cardsQuantityIndex = 0;
let cardsQuantity = cardsQuantityArr[cardsQuantityIndex] / 2;

//Start Game
const startBtn = document.querySelector('.start-button');

startBtn.addEventListener('click', startGame);
startBtn.addEventListener('click', () => console.log(cardsQuantityIndex));

function startGame() {
  let numberOfPairs = getNumberOfPairs();
  cardsQuantityIndex = cardsQuantityArr.indexOf(numberOfPairs);
  cardsQuantity = numberOfPairs / 2;
}

const cardsImgsArr = generateCardsData(imgsUrl, cardsQuantity);

function generateCardsData(arr, num) {
  let cardsData = arr.sort(() => 0.5 - Math.random()).slice(0, num);
  cardsData = [...cardsData, ...cardsData].sort(() => 0.5 - Math.random());
  return cardsData;
}

function getNumberOfPairs() {
  const checkedNavBtn = document.querySelector(
    'input[name="cards-quantity"]:checked'
  );
  if (checkedNavBtn !== null) {
    startBtn.classList.add('button-active', 'locked');
    return Number(checkedNavBtn.value);
  } else {
    alert('Please select number of pairs');
  }
}

//Start page:

function showStartPage() {}

function hideStartPage() {}

createNavbarItems(cardsQuantityArr);

function createNavbarItems(arr) {
  const navbar = document.querySelector('.start-page__navbar');
  for (item of arr) {
    navbar.insertAdjacentHTML(
      'beforeend',
      `
			<input type="radio" id="${item}" name="cards-quantity" value="${item}">
			<label for="${item}">
				<span class="start-page__navbar-label-content">${item}</span>
			</label>
			`
    );
  }
}

// add cards to field
for (let i = 0; i < cardsQuantity * 2; i++) {
  createCard(cardsImgsArr[i], cardsImgsArr[i]);
}

function createCard(item, dataId) {
  const card = document.createElement('div');
  card.innerHTML = `
	<div class="card" data-id="${dataId}">
			<img class="card__front-face" src="./images/${item}" alt="">
		<div class="card__back-face"></div>
	</div>`;
  document.querySelector('.game-field').append(card);
}

createGameField(
  playingField[cardsQuantityIndex][0],
  playingField[cardsQuantityIndex][1]
);

function createGameField(rows, columns) {
  //styling Playing Field
  const GameFieldStyle = document.querySelector('.game-field');
  GameFieldStyle.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  GameFieldStyle.style.gridTemplateRovs = `repeat(${rows}, 1fr)`;

  //styling card Template
  const cardStyle = document.querySelectorAll('.card');
  for (item of cardStyle) {
    item.style.width = `calc(60vmin / ${columns})`;
    item.style.height = `calc(70vmin / ${rows})`;
  }
}

const cards = document.querySelectorAll('.card');

let pairsCounter = 0;
let hasFlippedCard = false;
let boardLocked = false;
let firstCard, secondCard;

const flipcard = e => {
  if (boardLocked) {
    return;
  }

  const target = e.target.closest('.card');

  if (target === firstCard) {
    return;
  }

  target.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = target;
  } else {
    hasFlippedCard = false;
    secondCard = target;

    checkForMatch();
  }
};

cards.forEach(card => {
  card.addEventListener('click', flipcard);
});

const checkForMatch = () => {
  const areEqual = firstCard.dataset.id === secondCard.dataset.id;
  areEqual ? disableCards() : unflipCards();
};

const checkWin = () => {
  pairsCounter++;
  if (pairsCounter < cardsQuantity) {
    console.log(pairsCounter);
  } else {
    alert('Passed!');
    window.location.reload();
  }
};

function disableCards() {
  firstCard.removeEventListener('click', flipcard);
  secondCard.removeEventListener('click', flipcard);
  boardLocked = true;
  // console.log('CARDS ARE EQUAL');
  setTimeout(() => {
    firstCard.classList.add('disabled');
    secondCard.classList.add('disabled');
    boardLocked = false;
    setTimeout(() => {
      checkWin();
    }, 1000);
  }, 1000);
}

function unflipCards() {
  boardLocked = true;
  // console.log('CARDS ARE NOT EQUAL');
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    boardLocked = false;
  }, 1000);
}
