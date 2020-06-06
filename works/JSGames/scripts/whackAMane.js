const score = document.querySelector('#molescore');
const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const start = document.querySelector('#newGame');
let currScore = 0;
let finished = false;

start.addEventListener('click', function() {
	score.textContent = 0;
	finished = false;
	currScore = 0;
	//start moles/manes to appear

	//setTimeout(() => finished = true, xxxx ms)
});

function appear() {
	//const time = make moles appear at a somewhat random time
	//const hole = pick hole to appear
	//make mole appear and disappear after a certain amount of time
}

function hit() {
	//remove mole
	//update score
}
