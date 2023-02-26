import { Block } from "./block.js";

class App {

	constructor() {

		this.canvas = document.getElementById('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.ctx.scale(20, 20);

		this.lastTime = 0;
		this.interval = 1000;
		this.dropCounter = 0;

		this.board = this.createMatrix(12, 20);
		this.player = {
			matrix: null,
			pos: { x: 0, y: 0 },
			score: 0
		};

		this.colors = [
			null,
			'#ff0d72',
			'#0dc2ff',
			'#0dff72',
			'#f538ff',
			'#ff8e0d',
			'#ffe138',
			'#3877ff',
		];

		this.playerReset();
		this.updateScore();
		this.render();

		window.addEventListener('keydown', this.move.bind(this), false);
	}

	createMatrix(width, height) {
		const matrix = [];
		for (let i = 0; i < height; i += 1) {
			const row = new Array(width).fill(0);
			matrix.push(row);
		}
		return matrix;
	}

	drawMatrix(matrix, offset) {
		matrix.forEach((row, y) => {
			row.forEach((value, x) => {
				if (value !== 0) {
					this.ctx.fillStyle = this.colors[value];
					this.ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
				}
			});
		});
	}

	collide(board, player) {
		const matrix = player.matrix;
		const pos = player.pos;
		for (let y = 0; y < matrix.length; y += 1) {
			for (let x = 0; x < matrix[y].length; x += 1) {
				if (matrix[y][x] !== 0 && (board[y + pos.y] && board[y + pos.y][x + pos.x]) !== 0) {
					return true;
				}
			}
		}
		return false;
	}

	updateScore() {
		document.getElementById('score').innerHTML = 'Score : ' + this.player.score;
	}

	playerReset() {
		this.player.matrix = new Block();
		this.player.pos.y = 0;
		this.player.pos.x = Math.floor(this.board[0].length / 2) - Math.floor(this.player.matrix[0].length / 2);

		if (this.collide(this.board, this.player)) {
			this.board.forEach(row => row.fill(0));
			this.player.score = 0;
			this.updateScore();
		}
	}

	merge(board, player) {
		player.matrix.forEach((row, y) => {
			row.forEach((value, x) => {
				if (value !== 0) {
					board[y + player.pos.y][x + player.pos.x] = value;
				}
			});
		});
	}

	sweep() {
		let rowCount = 1;
		outer: for (let y = this.board.length - 1; y > 0; y -= 1) {
			for (let x = 0; x < this.board[y].length; x += 1) {
				if (this.board[y][x] === 0)
					continue outer;
			}
			const row = this.board.splice(y, 1)[0].fill(0);
			this.board.unshift(row);
			y += 1;

			this.player.score += rowCount * 10;
			rowCount *= 2;
		}
	}

	playerDrop() {
		this.player.pos.y += 1;
		if (this.collide(this.board, this.player)) {
			this.player.pos.y -= 1;
			this.merge(this.board, this.player);
			this.playerReset();
			this.sweep();
			this.updateScore();
		}
		this.dropCounter = 0;
	}

	playerMove(offset) {
		this.player.pos.x += offset;
		if (this.collide(this.board, this.player)) {
			this.player.pos.x -= offset;
		}
	}

	rotate(matrix, direction) {
		for (let y = 0; y < matrix.length; ++y) {
			for (let x = 0; x < y; ++x) {
				[matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
			}
		}

		if (direction > 0) {
			matrix.forEach((row) => row.reverse());
		} else {
			matrix.reverse();
		}
	}

	playerRotate(direction) {
		let offset = 1;
		const pos = this.player.pos.x;

		this.rotate(this.player.matrix, direction);

		while (this.collide(this.board, this.player)) {
			this.player.pos.x += offset;
			offset = -(offset + (offset > 0 ? 1 : -1));

			if (offset > this.player.matrix[0].length) {
				rotate(this.player.matrix, -direction);
				this.player.pos.x = pos;
				return;
			}
		}
	}

	move(event) {
		const key = event.keyCode || event.key;
		switch (key) {
			case 37: // arrow left
				this.playerMove(-1);
				break;
			case 39: // arrow right
				this.playerMove(1);
				break;
			case 38: // arrow up
				this.playerRotate(-1);
				break;
			case 40: // arrow down
				this.playerDrop();
				break;
		}
	}

	draw() {
		this.ctx.fillStyle = '#000';
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.drawMatrix(this.board, { x: 0, y: 0 });
		this.drawMatrix(this.player.matrix, this.player.pos);
	}

	render(timestamp) {
		if (!timestamp) timestamp = 0;
		const deltaTime = timestamp - this.lastTime;
		this.dropCounter += deltaTime;
		if (this.dropCounter > this.interval) {
			this.playerDrop();
		}
		this.lastTime = timestamp;
		this.draw();
		window.requestAnimationFrame(this.render.bind(this));
	}
}

window.onload = () => {
	new App();
};