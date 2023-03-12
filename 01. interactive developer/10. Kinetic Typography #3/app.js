//import { Text } from './text.js';
import { Visual } from './visual.js';

class App {

	constructor() {

		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
		
		document.body.appendChild(this.canvas);

		WebFont.load({
			google: {
				families: ['Hind:700'],
			},
			fontactive: () => {
				
				//this.text = new Text();
				//this.text.setText('A', 2, document.body.clientWidth, document.body.clientHeight);

				this.visual = new Visual();

				this.resize();
				window.addEventListener('resize', this.resize.bind(this), false);
				window.requestAnimationFrame(this.animate.bind(this));
			}
		});
	}

	resize() {

		this.stageWidth = document.body.clientWidth;
		this.stageHeight = document.body.clientHeight;

		this.canvas.width = this.stageWidth * this.pixelRatio;
		this.canvas.height = this.stageHeight * this.pixelRatio;
		
		this.ctx.scale(this.pixelRatio, this.pixelRatio);
		this.visual.show(this.stageWidth, this.stageHeight);
	}

	animate(t) {
		window.requestAnimationFrame(this.animate.bind(this));
		this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
		this.visual.animate(this.ctx, t);
	}
}

window.onload = () => {
	new App();
};