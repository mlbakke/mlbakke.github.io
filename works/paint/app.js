// CANVAS
const canvas = document.querySelector('#draw');
const ctx = canvas.getContext('2d');
// canvas widht and height
let w = canvas.width,
	h = canvas.height;
const toolsHeight = document.querySelector('.tools').offsetHeight;

// FIT CANVAS TO WINDOW
function resize() {
	// save current painting
	let temp = ctx.getImageData(0, 0, w, h);
	canvas.width = window.innerWidth - 4;
	canvas.height = window.innerHeight - toolsHeight - 8;
	(w = canvas.width), (h = canvas.height);
	//keep current painting when resizing window
	ctx.putImageData(temp, 0, 0);
}

window.addEventListener('load', resize);
window.addEventListener('resize', resize);

// TOOLBAR
// tool variables
const brush = document.querySelector('.brush-icon');
const thickness = document.querySelector('#thickness');
const eraser = document.querySelector('#eraser');
const colorIcon = document.querySelector('#color');
const colorPicker = document.querySelector('#hex');
let currCol;
let erase = false;

// tools eventListeners
colorIcon.addEventListener('click', () => colorPicker.click());
eraser.addEventListener('click', () => {
	eraser.classList.toggle('active');
	if (erase === false) {
		currCol = colorPicker.value;
		colorPicker.value = '#ffffff';
		join = 'round';
		cap = 'round';
		erase = true;
	} else {
		colorPicker.value = currCol;
		erase = false;
	}
});

// BRUSH TOOL
// brush stroke variables
let join = 'round';
let cap = 'round';
let rotation;
let currentBrush = 'paint';
const select = document.querySelector('.dropdown');
//default lineWidth
ctx.lineWidth = '1';

// get random float for spray paint
function getRandomFloat(min, max) {
	return Math.random() * (max - min) + min;
}

//choosing a brush
select.addEventListener('change', changeBrush);

function changeBrush(e) {
	const target = e.target.value;
	ctx.restore;
	currentBrush = target;

	if (target === 'paint') {
		join = 'round';
		cap = 'round';
	}
	if (target === 'spray') {
		join = 'round';
		cap = 'round';
	}
	if (target === 'connecting') {
		join = 'round';
		cap = 'round';
	}
	if (target === 'spikes') {
		join = 'miter';
		cap = 'butt';
	}
}

// DRAWING
// drawing variables
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// density for spray
let density = 50;
// tracker for connecting brush
let points = [];

// drawing functionality
function draw(e) {
	if (!isDrawing) return; //don't run when not moused
	ctx.lineWidth = thickness.value;
	ctx.lineJoin = join;
	ctx.lineCap = cap;
	//start painting
	if (currentBrush === 'paint' || erase) {
		ctx.strokeStyle = colorPicker.value;
		ctx.beginPath();
		//start from -> go to
		ctx.moveTo(lastX, lastY);
		ctx.lineTo(e.offsetX, e.offsetY);

		ctx.stroke();
		//update lastX and lastY
		lastX = e.offsetX;
		lastY = e.offsetY;
	} else if (currentBrush === 'spray') {
		for (let i = density; i--; ) {
			ctx.fillStyle = colorPicker.value;
			let angle = getRandomFloat(0, Math.PI * 2);
			let radius = getRandomFloat(0, thickness.value);
			// fill 1*1 dots within a round radius of the pointer
			ctx.fillRect(e.offsetX + radius * Math.cos(angle), e.offsetY + radius * Math.sin(angle), 1, 1);
		}
	} else if (currentBrush === 'connecting') {
		ctx.strokeStyle = colorPicker.value;
		ctx.lineWidth = 1;
		// add current point to points array to keep track of our lines
		points.push({ x: e.offsetX, y: e.offsetY });
		ctx.beginPath();
		ctx.moveTo(points[points.length - 2].x, points[points.length - 2].y);
		ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
		ctx.stroke();

		//Get rgb color for strokestyle when connecting lines
		const rgb = colorPicker.value
			.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b)
			.substring(1)
			.match(/.{2}/g)
			.map((x) => parseInt(x, 16));

		// go through each point we're drawing to find points closeby
		for (let i = 0, len = points.length; i < len; i++) {
			// for each point.x/point.y subtract last point.x/y
			dx = points[i].x - points[points.length - 1].x;
			dy = points[i].y - points[points.length - 1].y;

			// If a previous point is closeby, draw a line between them
			d = dx * dx + dy * dy;
			if (d < thickness.value * 100) {
				ctx.beginPath();
				ctx.strokeStyle = `rgba(${rgb.toString()}, 0.25)`;
				ctx.moveTo(points[points.length - 1].x + dx * 0.2, points[points.length - 1].y + dy * 0.2);
				ctx.lineTo(points[i].x - dx * 0.2, points[i].y - dy * 0.2);
				ctx.stroke();
			}
		}
	} else if (currentBrush === 'spikes') {
		ctx.strokeStyle = colorPicker.value;
		ctx.beginPath();
		ctx.moveTo(lastX, lastY);
		ctx.lineTo(e.offsetX * getRandomFloat(0.9, 1.1), e.offsetY * getRandomFloat(0.9, 1.1));
		ctx.stroke();
		//update lastX and lastY
		lastX = e.offsetX;
		lastY = e.offsetY;
	}
}

// Draw while mouse is clicked and moving
// TOUCH DEVICES
canvas.addEventListener('touchstart', (e) => {
	isDrawing = true;
	const mouseEvent = new MouseEvent('mousedown', {
		lastX : e.touches[0].offsetX,
		lastY : e.touches[0].offsetY
	});

	canvas.dispatchEvent(mouseEvent);
});

canvas.addEventListener('touchmove', (e) => {
	const mouseEvent = new MouseEvent('mousemove', {
		lastX : e.touches[0].offsetX,
		lastY : e.touches[0].offsetY
	});
	canvas.dispatchEvent(mouseEvent);
});
// Don't draw when mouse isn't clicked
canvas.addEventListener('touchend', (e) => {
	const mouseEvent = new MouseEvent('mouseup', {});
	canvas.dispatchEvent(mouseEvent);
});

// Prevent scrolling on touchevents
document.body.addEventListener(
	'touchstart',
	function(e) {
		if (e.target == canvas) {
			e.preventDefault();
		}
	},
	false
);
document.body.addEventListener(
	'touchend',
	function(e) {
		if (e.target == canvas) {
			e.preventDefault();
		}
	},
	false
);
document.body.addEventListener(
	'touchmove',
	function(e) {
		if (e.target == canvas) {
			e.preventDefault();
		}
	},
	false
);

// DESKTOP / LAPTOP
canvas.addEventListener('mousedown', (e) => {
	isDrawing = true;
	[ lastX, lastY ] = [ e.offsetX, e.offsetY ];

	if (currentBrush === 'connecting') {
		points.push({ x: e.offsetX, y: e.offsetY });
	}
});
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => (isDrawing = false));
canvas.addEventListener('mouseout', () => (isDrawing = false));
canvas.addEventListener('mouseup', () => (points.length = 0));
