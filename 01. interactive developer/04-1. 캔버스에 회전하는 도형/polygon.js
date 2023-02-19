
// 지름
const PI2 = Math.PI * 2;

// 다각형 클래스
export class Polygon {

	constructor(x, y, radius, sides) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.sides = sides;
		this.rotate = 0;
	}

	animate(ctx, moveX) {
		ctx.save();
		ctx.fillStyle = '#000';
		ctx.beginPath();
		ctx.translate(this.x, this.y);

		this.rotate -= moveX * 0.008;
		ctx.rotate(this.rotate);
		
		const angle = PI2 / this.sides;
		for (let i = 0; i < this.sides; i += 1) {
			const x = this.radius * Math.cos(angle * i);
			const y = this.radius * Math.sin(angle * i);
			(i == 0) ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
		}
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}
}