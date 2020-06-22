const score = document.querySelector('#molescore');
const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const start = document.querySelector('#newGame');
let currScore = 0;
let finished = false;
let lastHole;

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
		if (!finished) appear();
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

moles.forEach((mole) => mole.addEventListener('click', hit));
