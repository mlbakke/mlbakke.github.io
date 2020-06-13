document.addEventListener('DOMContentLoaded', () => {
	//cards
	const cards = [
		{
			name : 'Angry Klopp',
			img  : 'img/memory/angryKlopp.jpg'
		},
		{
			name : 'Angry Klopp',
			img  : 'img/memory/angryKlopp.jpg'
		},
		{
			name : 'Celebrating Klopp',
			img  : 'img/memory/celebratingKlopp.jpg'
		},
		{
			name : 'Celebrating Klopp',
			img  : 'img/memory/celebratingKlopp.jpg'
		},
		{
			name : 'Clapping Klopp',
			img  : 'img/memory/clappingKlopp.jpg'
		},
		{
			name : 'Clapping Klopp',
			img  : 'img/memory/clappingKlopp.jpg'
		},
		{
			name : 'Crazy Klopp',
			img  : 'img/memory/crazyKlopp.jpg'
		},
		{
			name : 'Crazy Klopp',
			img  : 'img/memory/crazyKlopp.jpg'
		},
		{
			name : 'Cutie Klopp',
			img  : 'img/memory/cutieKlopp.jpg'
		},
		{
			name : 'Cutie Klopp',
			img  : 'img/memory/cutieKlopp.jpg'
		},
		{
			name : 'Funny Klopp',
			img  : 'img/memory/funnyKlopp.jpg'
		},
		{
			name : 'Funny Klopp',
			img  : 'img/memory/funnyKlopp.jpg'
		},
		{
			name : 'Happy Klopp',
			img  : 'img/memory/happyKlopp.jpg'
		},
		{
			name : 'Happy Klopp',
			img  : 'img/memory/happyKlopp.jpg'
		},
		{
			name : 'Laughing Klopp',
			img  : 'img/memory/laughingKlopp.jpg'
		},
		{
			name : 'Laughing Klopp',
			img  : 'img/memory/laughingKlopp.jpg'
		},
		{
			name : 'Nervous Klopp',
			img  : 'img/memory/nervousKlopp.jpg'
		},
		{
			name : 'Nervous Klopp',
			img  : 'img/memory/nervousKlopp.jpg'
		},
		{
			name : 'Playing Klopp',
			img  : 'img/memory/playingKlopp.jpg'
		},
		{
			name : 'Playing Klopp',
			img  : 'img/memory/playingKlopp.jpg'
		},
		{
			name : 'Pointing Klopp',
			img  : 'img/memory/pointingKlopp.jpg'
		},
		{
			name : 'Pointing Klopp',
			img  : 'img/memory/pointingKlopp.jpg'
		},
		{
			name : 'Rejected Klopp',
			img  : 'img/memory/rejectedKlopp.jpg'
		},
		{
			name : 'Rejected Klopp',
			img  : 'img/memory/rejectedKlopp.jpg'
		},
		{
			name : 'Relieved Klopp',
			img  : 'img/memory/relievedKlopp.jpg'
		},
		{
			name : 'Relieved Klopp',
			img  : 'img/memory/relievedKlopp.jpg'
		},
		{
			name : 'Serious Klopp',
			img  : 'img/memory/seriousKlopp.jpg'
		},
		{
			name : 'Serious Klopp',
			img  : 'img/memory/seriousKlopp.jpg'
		},
		{
			name : 'Shouting Klopp',
			img  : 'img/memory/shoutingKlopp.jpg'
		},
		{
			name : 'Shouting Klopp',
			img  : 'img/memory/shoutingKlopp.jpg'
		},
		{
			name : 'Smiling Klopp',
			img  : 'img/memory/smilingKlopp.jpg'
		},
		{
			name : 'Smiling Klopp',
			img  : 'img/memory/smilingKlopp.jpg'
		},
		{
			name : 'Smug Klopp',
			img  : 'img/memory/smugKlopp.jpg'
		},
		{
			name : 'Smug Klopp',
			img  : 'img/memory/smugKlopp.jpg'
		},
		{
			name : 'Young Klopp',
			img  : 'img/memory/youngKlopp.jpg'
		},
		{
			name : 'Young Klopp',
			img  : 'img/memory/youngKlopp.jpg'
		}
	];

	//variables
	const grid = document.querySelector('.grid');
	const resultDisplay = document.querySelector('#results');
	const newGame = document.querySelector('#newGame');
	newGame.addEventListener('click', createBoard);
	let cardsChosen = [];
	let cardsChosenId = [];
	let cardsMatched = [];

	//creating our grid/gameboard
	function createBoard() {
		//reset previous game
		resultDisplay.textContent = 0;
		cardsChosen = [];
		cardsChosenId = [];
		cardsMatched = [];
		//check if game is in progress
		var element = document.getElementsByClassName('card');
		if (element[0]) {
			removeBoard();
		}
		//shuffle cards
		for (let i = cards.length - 1; i > 0; i--) {
			// const j: 0 <= j <= i
			const j = Math.floor(Math.random() * (i + 1));
			//swap card [i] and [j]
			[ cards[i], cards[j] ] = [ cards[j], cards[i] ];
		}
		//get width
		const canvasWidth = grid.clientWidth;
		//create board
		for (let i = 0; i < cards.length; i++) {
			const card = document.createElement('img');
			card.setAttribute('src', 'img/memory/blank.jpg');
			card.setAttribute('data-id', i);
			card.setAttribute('class', 'card');
			card.width = canvasWidth / 6;
			card.addEventListener('click', flipCard);
			grid.appendChild(card);
		}
	}

	//check for matches
	function checkForMatch() {
		const twoCards = document.querySelectorAll('img');
		const optionOneId = cardsChosenId[0];
		const optionTwoId = cardsChosenId[1];
		const match = document.querySelector('.match');

		//Check for match
		if (cardsChosen[0] === cardsChosen[1]) {
			match.style.display = 'inline-block';
			match.innerHTML = 'You got a match!';
			//push matched cards
			cardsMatched.push(cardsChosen);
			//update score
			resultDisplay.textContent = cardsMatched.length;
			//remove cards from board
			match.addEventListener('click', removeCards);
		} else {
			match.style.display = 'inline-block';
			match.innerHTML = 'No match!';
			//turn cards back around after no-match
			match.addEventListener('click', resetCards);
		}

		//remove cards after match
		function removeCards() {
			match.style.display = 'none';
			match.innerHTML = '';
			twoCards[optionOneId].setAttribute('src', 'img/memory/white.jpg');
			twoCards[optionTwoId].setAttribute('src', 'img/memory/white.jpg');
			cardsChosen = [];
			cardsChosenId = [];
		}
		//turn around card if no match
		function resetCards() {
			match.style.display = 'none';
			match.innerHTML = '';
			twoCards[optionOneId].setAttribute('src', 'img/memory/blank.jpg');
			twoCards[optionTwoId].setAttribute('src', 'img/memory/blank.jpg');
			cardsChosen = [];
			cardsChosenId = [];
		}
		//Check for victory
		if (cardsMatched.length === cards.length / 2) {
			removeBoard();
			match.innerHTML = "You're a winner!!";
		}
	}

	function removeBoard() {
		//removes all cards from game
		const el = document.getElementsByClassName('card');
		while (el[0]) {
			el[0].parentNode.removeChild(el[0]);
		}
	}

	//flip your card
	function flipCard() {
		const cardId = this.getAttribute('data-id');

		//Checks if card is already facing up
		if (cardsChosenId.length === 1 && cardsChosenId[0] == cardId) {
			return;
		}
		//Checks if card is already matched
		if (this.src.search('white.jpg') !== -1) {
			return;
		}

		cardsChosen.push(cards[cardId].name);
		cardsChosenId.push(cardId);
		this.setAttribute('src', cards[cardId].img);

		if (cardsChosen.length === 2) {
			setTimeout(checkForMatch, 250);
		}
	}
});
