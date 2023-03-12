import { Text } from './text.js';
import { Particle } from './particle.js';

export const RANDOM_TEXT = 'ABCMNRSTUXZ';

export class Visual {

	constructor() {
		
		this.text = new Text();
		this.textArr = RANDOM_TEXT.split('');

		this.particles = [];
		this.mouse = {
			x: 0,
			y: 0,
			radius: 100,
		};
		
		window.addEventListener('pointermove', this.onMove.bind(this), false);
	}

	show(stageWidth, stageHeight) {
		
		const index = Math.round(Math.random() * (this.textArr.length - 1));
		const str = this.textArr[index];

		this.pos = this.text.setText(str, 26, stageWidth, stageHeight);

		this.particles = [];
		for (let i = 0; i < this.pos.length; i += 1) {
			const item = new Particle(this.pos[i]);
			this.particles.push(item);
		}
	}

	animate(ctx, t) {

		for (let i = 0; i < this.particles.length; i += 1) {

			const item = this.particles[i];

			const dx = this.mouse.x - item.x;
			const dy = this.mouse.y - item.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			const minDistance = item.radius + this.mouse.radius;

			if (distance < minDistance) {
				
				const angle = Math.atan2(dy, dx);
				
				const tx = item.x + Math.cos(angle) * minDistance;
				const ty = item.y + Math.sin(angle) * minDistance;
				
				const ax = tx - this.mouse.x;
				const ay = ty - this.mouse.y;

				item.vx -= ax;
				item.vy -= ay;

				item.collide();
			}

			item.draw(ctx, t);
		}
	}

	onMove(event) {
		this.mouse.x = event.clientX;
		this.mouse.y = event.clientY;
	}
}