import { Sheep } from './sheep.js';

export class SheepController {

	constructor() {
		this.image = new Image();
		this.image.onload = () => {
			this.loaded();
		};
		this.image.src = './sheep.png';
		this.items = [];
		this.cur = 0;
		this.isLoaded = false;
	}

	resize(stageWidth, stageHeight) {
		this.stageWidth = stageWidth;
		this.stageHeight = stageHeight;
	}

	loaded() {
		this.isLoaded = true;
		this.addSheep();
	}

	addSheep() {
		const sheep = new Sheep(this.image, this.stageWidth);
		this.items.push(sheep);
	}

	draw(ctx, timestamp, dots) {
		if (this.isLoaded) {
			this.cur += 1;

			if (this.cur > 200) {
				this.cur = 0;
				this.addSheep();
			}

			for (let i = this.items.length - 1; i >= 0; i -= 1) {
				const item = this.items[i];
				if (item.x < -item.width) {
					this.items.splice(i, 1);
				} else {
					item.draw(ctx, timestamp, dots);
				}
			}
		}
	}
}