'use strict';

const colors = [
	null,
	'#ff0d72',
	'#0dc2ff',
	'#0dff72',
	'#f538ff',
	'#ff8e0d',
	'#ffe138',
	'#3877ff',
];

const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(20, 20);

let lastTime = 0;
let dropCounter = 0;
const dropInterval = 1000;

const board = createMatrix(12, 20);
// console.log(board);
const player = {
	pos: { x: 0, y: 0},
	matrix: null,
	score: 0,
};

function createMatrix(width, height) {
	let matrix = [];
	for (let i = 0; i < height; i += 1) {
		matrix.push(new Array(width).fill(0));
	}
	// console.log(matrix);
	return matrix;
}

function createPiece(type) {
	const pieces = {
		'I': [
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0]
		],
		'L': [
			[0, 2, 0],
			[0, 2, 0],
			[0, 2, 2],
		],
		'J': [
			[0, 3, 0],
			[0, 3, 0],
			[3, 3, 0],
		],
		'O': [
			[4, 4],
			[4, 4],
		],
		'Z': [
			[5, 5, 0],
			[0, 5, 5],
			[0, 0, 0],
		],
		'S': [
			[0, 6, 6],
			[6, 6, 0],
			[0, 0, 0],
		],
		'T': [
			[0, 7, 0],
			[7, 7, 7],
			[0, 0, 0],
		]
	}
	return pieces[type];
}

function collide(board, player) {
	const m = player.matrix;
	const o = player.pos;

	for (let y = 0; y < m.length; y += 1) {
		for (let x = 0; x < m[y].length; x += 1) {
			if (m[y][x] !== 0 && (board[y + o.y] && board[y + o.y][x + o.x]) !== 0) {
				return true;
			}
		}
	}
	return false;
}

function merge(matrix, player) {
	player.matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value !== 0) {
				matrix[y + player.pos.y][x + player.pos.x] = value;
			}
		});
	});
}

function updateScore() {
	document.getElementById('score').innerText = 'score :' + player.score;
}

function playerReset() {
	const pieces = 'ILJOSZT';
	const index = pieces.length * Math.random() | 0;
	player.matrix = createPiece(pieces[index]);
	// console.log(player.matrix);

	player.pos.y = 0;
	player.pos.x = (board[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);

	if (collide(board, player)) {
		board.forEach(row => row.fill(0));
		player.score = 0;
		updateScore();
	}
}

function arenaSweep() {
	let rowCount = 1;
	outer: for (let y = board.length - 1; y > 0; y -= 1) {
		for (let x = 0; x < board[y].length; x += 1) {
			if (board[y][x] === 0) {
				continue outer;
			}
		}

		const row = board.splice(y, 1).fill(0);
		board.unshift(row);
		y += 1;

		player.score += rowCount * 10;
		rowCount *= 2;
	}
}

function playerDrop() {
	player.pos.y += 1;
	if (collide(board, player)) {
		player.pos.y -= 1;
		merge(board, player);
		playerReset();
		arenaSweep();
		updateScore();
	}
	dropCounter = 0;
}

function playerMove(offset) {
	player.pos.x += offset;
	if (collide(board, player)) {
		player.pos.x -= offset;
	}
}

function rotate(matrix, dir) {
	for (let y = 0; y < matrix.length; ++y) {
		for (let x = 0; x < y; ++x) {
			[matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
		}
	}
	if (dir > 0) {
		matrix.forEach((row) => row.reverse());
	} else {
		matrix.reverse();
	}
}

function playerRotate(direction) {

	let offset = 1;
	const pos = player.pos.x;

	rotate(player.matrix, direction);

	while (collide(board, player)) {
		player.pos.x += offset;

		offset = -(offset + (offset > 0 ? 1 : -1));

		if (offset > player.matrix[0].length) {
			rotate(player.matrix, -dir);
			player.pos.x = pos;
			return;
		}
	}
}

function drawMatrix(matrix, offset) {
	matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value !== 0) {
				context.fillStyle = colors[value];
				context.fillRect(x + offset.x, y + offset.y, 1, 1);
			}
		});
	});
}

function draw() {
	context.fillStyle = '#000';
	context.fillRect(0, 0, canvas.width, canvas.height);

	drawMatrix(board, { x: 0, y: 0 });
	drawMatrix(player.matrix, player.pos);
}

function update(timestamp) {
	if (!timestamp) timestamp = 0;
	const deltaTime = timestamp - lastTime;
	dropCounter += deltaTime;
	if (dropCounter > dropInterval) {
		playerDrop();
	}
	lastTime = timestamp;

	draw();
	window.requestAnimationFrame(update);
}

playerReset();
updateScore();
update();

window.addEventListener('keydown', (event) => {
	const keyCode = event.keyCode;
	console.log(keyCode);
	switch (keyCode) {
		case 37:
			playerMove(-1);
			break;
		case 39:
			playerMove(1);
			break;
		case 38:
			playerRotate(-1);
			break;
		case 40:
			playerDrop();
			break;
	}
});