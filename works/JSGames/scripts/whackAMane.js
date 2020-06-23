const score = document.querySelector('#molescore');
const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const start = document.querySelector('#newGame');
const scoreList = document.querySelector('.topscores__list');
let currScore = 0;
let finished = false;
let lastHole;
let highscores = JSON.parse(localStorage.getItem('highscores')) || [];
//Start with current topscores visible
fillTopscore();

start.addEventListener('click', newGame);

function newGame() {
	//reset counters
	score.textContent = 0;
	finished = false;
	currScore = 0;

	//manés starts appearing
	appear();

	//finish game after 15s
	setTimeout(() => {
		finished = true;
	}, 15000);
}

function getTime(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function getHole(holes) {
	//get random hole index
	const idx = Math.floor(Math.random() * holes.length);
	const hole = holes[idx];

	//don't appear in same hole twice
	if (hole === lastHole) return getHole(holes);

	lastHole = hole;
	return hole;
}

function appear() {
	const time = getTime(250, 1000);
	const hole = getHole(holes);
	//mole appears
	hole.classList.add('appear');
	//mole disappears after time
	setTimeout(() => {
		hole.classList.remove('appear');
		if (!finished) {
			appear();
		} else {
			//push score to highscores, sort then save
			highscores.push(currScore);
			highscores.sort((a, b) => b - a);
			if (highscores.length > 20) highscores.pop();
			localStorage.setItem('highscores', JSON.stringify(highscores));
			//Rewrite topscores
			fillTopscore();
		}
	}, time);
}

function hit(e) {
	//check for cheating
	if (!e.isTrusted) return;
	//update score
	currScore++;
	score.textContent = currScore;
	//remove mané
	this.parentElement.classList.remove('appear');
}

function fillTopscore() {
	//Remove scores from topscore list
	scoreList.innerHTML = '';
	//Write scores back to topscore list
	highscores.forEach((highscore) => {
		const node = document.createElement('li');
		node.setAttribute('class', 'topscores__score');
		const textnode = document.createTextNode(`${highscore}`);
		node.appendChild(textnode);
		scoreList.appendChild(node);
	});
}

moles.forEach((mole) => mole.addEventListener('click', hit));
