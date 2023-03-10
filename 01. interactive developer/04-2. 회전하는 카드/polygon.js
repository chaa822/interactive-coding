
// 지름
const PI2 = Math.PI * 2;

const COLORS = [
	'#4b56ab',
	'#554fb8',
	'#605ac7',
	'#2a91a8',
	'#2e9ab2',
	'#32a5bf',
	'#81b144',
	'#85b944',
	'#8fc549',
	'#e0af27',
	'#eeba2a',
	'#fec72e',
	'#bf342d',
	'#ca3931',
	'#d7423a',
];


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
		//ctx.fillStyle = '#000';
		//ctx.beginPath();
		
		const angle = PI2 / this.sides;
		const angle2 = PI2 / 4;

		ctx.translate(this.x, this.y);

		this.rotate -= moveX * 0.008;
		ctx.rotate(this.rotate);
		
		for (let i = 0; i < this.sides; i += 1) {
			const x = this.radius * Math.cos(angle * i);
			const y = this.radius * Math.sin(angle * i);
			
			ctx.save();
			ctx.fillStyle = COLORS[i];
			ctx.translate(x, y);
			ctx.rotate(((360 / this.sides) * i + 45) * Math.PI / 180);
			ctx.beginPath();

			for(let j = 0; j < 4; j += 1){
				const x2 = 160 * Math.cos(angle2 * j);
				const y2 = 160 * Math.sin(angle2 * j);
				(j == 0) ? ctx.moveTo(x2, y2) : ctx.lineTo(x2, y2);
			}
			ctx.fill();
			ctx.closePath();
			ctx.restore();
		}
		//ctx.fill();
		//ctx.closePath();
		ctx.restore();
	}
}