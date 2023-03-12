const FRICTION = 0.98;
const COLOR_SPEED = 0.12;

export class Particle {

	constructor(pos) {
		
		this.savedX = pos.x;
		this.savedY = pos.y;

		this.x = pos.x;
		this.y = pos.y;

		
	}
}