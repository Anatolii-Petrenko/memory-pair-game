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
const startPage = document.querySelector('.start-page');
const startBtn = document.querySelector('.start-btn');
const playingFieldSection = document.querySelector('.playing-field');
const resultsPage = document.querySelector('.results');

createNavbarItems(cardsQuantityArr);

startBtn.addEventListener('click', startGame);

function startGame() {
  //hide start page
  startPage.classList.add('anim-hide-short');

  let numberOfPairs = getNumberOfPairs();
  cardsQuantityIndex = cardsQuantityArr.indexOf(numberOfPairs);
  cardsQuantity = numberOfPairs / 2;

  setTimeout(() => {
    startPage.classList.add('hidden');
    generatePlayingField();

    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
      card.addEventListener('click', flipcard);
    });
    document.querySelector('.playing-field').classList.add('anim-show-short');
  }, 1250);
}

function generatePlayingField() {
  const cardsImgsArr = generateCardsData(imgsUrl, cardsQuantity);

  // Add cards to field
  for (let i = 0; i < cardsQuantity * 2; i++) {
    createCard(cardsImgsArr[i]);
  }
  //Create playing field
  createGameField(
    playingField[cardsQuantityIndex][0],
    playingField[cardsQuantityIndex][1]
  );
}

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
    window.location.reload();
  }
}

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

// -------------------------------------------

// Playing field
function createCard(item) {
  document.querySelector('.playing-field').insertAdjacentHTML(
    'beforeend',
    `
		<div class="card" data-id="${item.split('.')[0]}">
			<img class="card__front-face" src="./images/${item}" alt="">
			<div class="card__back-face"></div>
		</div>
		`
  );
}

function createGameField(rows, columns) {
  //styling Playing Field
  const GameFieldStyle = document.querySelector('.playing-field');
  GameFieldStyle.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  GameFieldStyle.style.gridTemplateRovs = `repeat(${rows}, 1fr)`;

  //styling card Template
  const cardStyle = document.querySelectorAll('.card');
  for (item of cardStyle) {
    item.style.width = `calc(60vmin / ${columns})`;
    item.style.height = `calc(70vmin / ${rows})`;
  }
}

// -------------------------------------------

// Creating results page
function createResultsPage() {
  resultsPage.insertAdjacentHTML(
    'beforeend',
    `
		<div class="results-container">
			<p class="results-win-text">
				Congratulations, you passed this level !!!
			</p>
			<p class="results-win-text">
				Try another levels ;)
			</p>
			<div class="restart-btn-container">
				<button class="restart-btn button">Continue...</button>
			</div>
		</div>
		`
  );
  resultsPage.classList.remove('hidden');
  resultsPage.classList.add('anim-show');
}

// -------------------------------------------

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
    firstCard.classList.add('locked');
  } else {
    hasFlippedCard = false;
    secondCard = target;
    secondCard.classList.add('locked');

    checkForMatch();
  }
};

const checkForMatch = () => {
  const areEqual = firstCard.dataset.id === secondCard.dataset.id;
  areEqual ? disableCards() : unflipCards();
};

const checkWin = () => {
  pairsCounter++;
  if (pairsCounter < cardsQuantity) {
    console.log(pairsCounter);
  } else {
    initResultsPage();
  }
};

function initResultsPage() {
  playingFieldSection.remove();
  createResultsPage();
  document.querySelector('.restart-btn').addEventListener('click', () => {
    resultsPage.classList.add('anim-hide-short');
    setTimeout(() => {
      window.location.reload();
    }, 1250);
  });
}

function disableCards() {
  boardLocked = true;
  firstCard.removeEventListener('click', flipcard);
  secondCard.removeEventListener('click', flipcard);
  // console.log('CARDS ARE EQUAL');
  setTimeout(() => {
    firstCard.classList.add('disabled');
    secondCard.classList.add('disabled');
    setTimeout(() => {
      checkWin();
      boardLocked = false;
    }, 10);
  }, 1000);
}

function unflipCards() {
  boardLocked = true;
  // console.log('CARDS ARE NOT EQUAL');
  setTimeout(() => {
    firstCard.classList.remove('flip', 'locked');
    secondCard.classList.remove('flip', 'locked');
    boardLocked = false;
  }, 1000);
}
