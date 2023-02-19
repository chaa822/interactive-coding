import { Sun } from './sun.js';
import { Hill } from './hill.js';
import { SheepController } from './sheep-controller.js';

class App {

	constructor() {
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.pixelRatio = (window.devicePixelRatio > 1) ? 2 : 1;

		this.sun = new Sun(); // 해
		
		this.hills = [	// 언덕 (3개)
			new Hill('#fd6bea', 0.2, 12),
			new Hill('#ff59c2', 0.5, 8),
			new Hill('#ff4674', 1.4, 6),
		];

		this.sheepController = new SheepController(); // 양 컨트롤러

		document.body.appendChild(this.canvas);

		document.addEventListener('resize', this.resize.bind(this), false);
		this.resize();

		window.requestAnimationFrame(this.animate.bind(this));
	}

	resize() {
		this.stageWidth = document.body.clientWidth;
		this.stageHeight = document.body.clientHeight;

		this.canvas.width = this.stageWidth * this.pixelRatio;
		this.canvas.height = this.stageHeight * this.pixelRatio;

		this.ctx.scale(this.pixelRatio, this.pixelRatio);

		this.sun.resize(this.stageWidth, this.stageHeight);	// 해

		for (let i = 0; i < this.hills.length; i += 1) {
			this.hills[i].resize(this.stageWidth, this.stageHeight); // 언덕
		}

		this.sheepController.resize(this.stageWidth, this.stageHeight); // 양
	}

	animate(timestamp) {
		window.requestAnimationFrame(this.animate.bind(this));
		this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
		
		this.sun.draw(this.ctx, timestamp);	// 해
		
		let dots;
		for (let i = 0; i < this.hills.length; i += 1) {
			dots = this.hills[i].draw(this.ctx);	// 언덕
		}

		this.sheepController.draw(this.ctx, timestamp, dots);	// 양
	}
}

window.onload = () => {
	new App();
};