export class Sun {

	constructor() {

		// 반지름
		this.radius = 200;

		this.total = 60;
		this.gap = 1 / this.total;
		
		this.pos = [];
		this.originPos = [];

		for (let i = 0; i < this.total; i += 1) {
			const pos = this.getCirclePoint(this.radius, this.gap * i);
			this.originPos[i] = pos;
			this.pos[i] = pos;
		}

		this.fps = 30;
		this.fpsTime = 1000 / this.fps;
	}

	resize(stageWidth, stageHeight) {
		
		this.stageWidth = stageWidth;
		this.stageHeight = stageHeight;

		this.x = this.stageWidth - this.radius - 140;
		this.y = this.radius + 100;
	}

	draw(ctx, timestamp) {

		if (!this.time) {
			this.time = timestamp;
		}

		const now = timestamp - this.time;
		if (now > this.fpsTime) {
			this.time = timestamp;
			this.updatePoints();
		}

		ctx.fillStyle = '#ffb200';
		ctx.beginPath();
		
		//ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		//ctx.fill();

		let pos = this.pos[0];
		ctx.moveTo(pos.x + this.x, pos.y + this.y);
		for (let i = 0; i < this.total; i += 1) {
			const pos = this.pos[i];
			ctx.lineTo(pos.x + this.x, pos.y + this.y);
		}
		ctx.fill();
	}

	updatePoints() {
		for (let i = 0; i <this.total; i += 1) {
			const pos = this.originPos[i];
			this.pos[i] = {
				x: pos.x + this.ranInt(5),
				y: pos.y + this.ranInt(5),
			}
		}
	}

	ranInt(max) {
		return Math.random() * max;
	}

	getCirclePoint(radius, timestamp) {
		const theta = Math.PI * 2 * timestamp;

		return {
			x: (Math.cos(theta) * radius),
			y: (Math.sin(theta) * radius),
		}
	}
}