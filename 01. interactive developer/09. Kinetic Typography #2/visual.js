import { Text } from './text.js';
import { Particle } from './particle.js';

export class Visual {

	constructor() {
		this.text = new Text();
		this.texture = PIXI.Texture.from('particle.png');
		this.particles = [];
		this.mouse = {
			x: 0,
			y: 0,
			radius: 100
		};

		document.addEventListener('pointermove', this.onMove.bind(this), false);
	}

	show(stageWidth, stageHeight, stage) {
		if (this.container) {
			stage.removeChild(this.container);
		}
		this.pos = this.text.setText('M', 2, stageWidth, stageHeight);
		this.container = new PIXI.ParticleContainer(
			this.pos.length,
			{
				vertices: false,
				position: true,
				rotation: false,
				scale: false,
				uvs: false,
				tint: true,
			}
		);
		stage.addChild(this.container);
		
		this.particles = [];
		for (let i = 0; i < this.pos.length; i += 1) {
			const item = new Particle(this.pos[i], this.texture);
			this.container.addChild(item.sprite);
			this.particles.push(item);
		}
	}

	animate(t = 0) {
		for (let i = 0; i < this.particles.length; i += 1) {
			const item = this.particles[i];
			const dx = this.mouse.x - item.x;
			const dy = this.mouse.y - item.y;
			const distance = Math.sqrt(dx * dx + dy * dy);
			const minDistance = item.radius + this.mouse.radius;

			if (distance < minDistance) {
				const angle = Math.atan2(dy, dx);
				
				const tx = item.x + Math.cos(angle) * minDistance;
				const ty = item.y + Math.cos(angle) * minDistance;
				
				const ax = tx - this.mouse.x;
				const ay = ty - this.mouse.y;

				item.vx -= ax;
				item.vy -= ay;

				item.collide();
			}

			item.draw();
		}
	}

	onMove(event) {
		this.mouse.x = event.clientX;
		this.mouse.y = event.clientY;

	}
}