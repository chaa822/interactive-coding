import { Text } from './text.js';
import { BounceString } from './bouncestrings.js';

export class Visual {

	constructor() {

		this.strings = [];
		this.text = new Text();
		
		this.mouse = {
			x: 0,
			y: 0,
			radius: 100,
		};

		document.addEventListener('pointermove', this.onMove.bind(this), false);
	}

	show(stageWidth, stageHeight) {

		this.strings = [];
		this.pos = this.text.setText('M', 5, stageWidth, stageHeight);

		for (let i = 0; i < this.pos.outline.length; i += 1) {
			this.strings[i] = new BounceString({
				x1: this.pos.outline[i].x,
				y1: this.pos.outline[i].minY,
				x2: this.pos.outline[i].x,
				y2: this.pos.outline[i].maxY,
			});
		}
	}

	animate(ctx) {
		for (let i = 0; i < this.strings.length; i += 1) {
			this.strings[i].animate(ctx, this.mouse.x, this.mouse.y);
		}
	}

	onMove(event) {
		this.mouse.x = event.clientX;
		this.mouse.y = event.clientY;
	}
}