import { Text } from './text.js';
import { Particle } from './particle.js';
import { hslToHex } from './utils.js';

export class Visual {
	
	constructor() {
		
		this.particles = [];
		this.text = new Text();

		this.mouse = {
			x: 0,
			y: 0,
			radius: 100,
		};

		document.addEventListener('pointermove', this.onMove.bind(this), false);
	}

	show(stageWidth, stageHeight) {
		this.pos = this.text.setText('W', 20, stageWidth, stageHeight);
		this.posTotal = this.pos.length - 1;
	}

	animate(ctx) {

		if (!this.pos) {
			return;
		}

		for (let i = 0; i < 10; i += 1) {
			const index = (Math.random() * this.posTotal) | 0;
			const myPos = this.pos[index];
			this.particles.push(new Particle(myPos, this.getColor()));
		}

		for (let i = 0; i < this.particles.length; i += 1) {
			const item = this.particles[i];

			if (item.radius <= 1) {
				this.particles.splice(i, 1);
			}

			const dx = this.mouse.x - item.x;
			const dy = this.mouse.y - item.y;
			
			const distance = Math.sqrt(dx * dx + dy * dy);
			const minDistance = item.radius + this.mouse.radius;

			if (distance < minDistance) {
				item.progress += 100;
			}

			item.draw(ctx);
		}
	}

	getColor() {
		const minHue = 80;
		const maxHue = 340;
		const hue = (maxHue - minHue) * Math.random() + minHue;
		return hslToHex(hue, 84, 50);
	}

	onMove(event) {
		this.mouse.x = event.clientX;
		this.mouse.y = event.clientY;
	}
}