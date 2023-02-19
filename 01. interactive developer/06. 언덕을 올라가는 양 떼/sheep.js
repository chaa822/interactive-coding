export class Sheep {

	constructor(image, stageWidth) {

		this.image = image;

		this.totalFrame = 8;
		this.curFrame = 0;

		this.imageWidth = 360;
		this.imageHeight = 300;

		this.sheepWidth = 180;
		this.sheepHeight = 150;

		this.speed = Math.random() * 2 + 1;
		this.sheepWidthHalf = this.sheepWidth / 2;
		
		this.x = stageWidth + this.sheepWidth;
		this.y = 0;
		
		this.fps = 24;
		this.fpsTime = 1000 / this.fps;
	}

	draw(ctx, timestamp, dots) {

		//this.curFrame += 1;
		//if (this.curFrame == this.totalFrame) {
		//	this.curFrame = 0;
		//}

		if (!this.time) {
			this.time = timestamp;
		}

		const now = timestamp - this.time;
		if (now > this.fpsTime) {
			this.time = timestamp;
			this.curFrame += 1;
			if (this.curFrame == this.totalFrame) {
				this.curFrame = 0;
			}
		}
		
		this.animate(ctx, dots);
	}

	animate(ctx, dots) {
		//this.x = 650;
		//this.y = 550;
		this.x -= this.speed;
		const closest = this.getY(this.x, dots);
		this.y = closest.y;

		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(closest.rotation);
		ctx.fillStyle = '#000000';
		//ctx.fillRect(
		//	-this.sheepWidthHalf,
		//	-this.sheepHeight + 20,
		//	this.sheepWidth,
		//	this.sheepHeight
		//);
		ctx.drawImage(
			this.image,
			this.imageWidth * this.curFrame,
			0,
			this.imageWidth,
			this.imageHeight,
			-this.sheepWidthHalf,
			-this.sheepHeight + 20,
			this.sheepWidth,
			this.sheepHeight
		);
		ctx.restore();	// 저장했던 캔버스를 복귀
	}

	getY(x, dots) {
		for (let i = 1; i < dots.length; i += 1) {
			if (dots[i].x1 <= x && x <= dots[i].x3) {
				return this.getY2(x, dots[i]);
			}
		}
		return {
			y: 0,
			rotation: 0
		};
	}

	getY2(x, dot) {
		const total = 200;
		let pt = this.getPointOnQuad(dot.x1, dot.y1, dot.x2, dot.y2, dot.x3, dot.y3, 0);
		let prevX = pt.x;
		for (let i = 0; i < total; i += 1) {
			const t = i / total;
			pt = this.getPointOnQuad(dot.x1, dot.y1, dot.x2, dot.y2, dot.x3, dot.y3, t);
			if (prevX <= x && x <= pt.x) {
				return pt;
			}
			prevX = pt.x;
		}
		return pt;
	}

	getPointOnQuad(x1, y1, x2, y2, x3, y3, t) {
		const tx = this.quadTangent(x1, x2, x3, t);
		const ty = this.quadTangent(y1, y2, y3, t);
		const rotation = -Math.atan2(tx, ty) + (90 * Math.PI / 180);
		return {
			x: this.getQuadValue(x1, x2, x3, t),
			y: this.getQuadValue(y1, y2, y3, t),
			rotation: rotation,
		};
	}

	getQuadValue(p0, p1, p2, t) {
		return (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;
	}

	quadTangent(a, b, c, t) {
		return 2 * (1 - t) * (b - a) + 2 * (c - b) * t;
	}
}