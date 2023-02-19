export class Ball {

	constructor(stageWidth, stageHeight, radius, speed) {
		
		this.radius = radius;	// 반지름
		this.vx = speed;		// x좌표를 움직이는 속도
		this.vy = speed;		// y좌표를 움직이는 속도

		// 지름
		const diameter = this.radius * 2;

		// 스테이지에 랜덤으로 위치할 수 있도록
		this.x = diameter + (Math.random() * stageWidth - diameter);
		this.y = diameter + (Math.random() * stageHeight - diameter);
	}

	draw(ctx, stageWidth, stageHeight, block) {

		this.x += this.vx;	// x좌표 속도만큼 증가
		this.y += this.vy;	// y좌표 속도만큼 증가

		// 스테이지상에 닿았는지 체크
		this.bounceWindow(stageWidth, stageHeight);

		// 블락에 닿았는지 체크
		this.bounceBlock(block);

		ctx.fillStyle = '#fdd700';
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		ctx.fill();
	}

	/**
	 * 스테이지상에 닿았는지를 판단하는 함수 (스테이지상에 닿았으면 방향을 돌린다)
	 * min: 반지름
	 * max: 스테이지 크기 - 반지름
	 * */
	bounceWindow(stageWidth, stageHeight) {

		const minX = this.radius;
		const maxX = stageWidth - this.radius;
		
		const minY = this.radius;
		const maxY = stageHeight - this.radius;

		if (this.x <= minX || maxX <= this.x) {
			this.vx *= -1;
			this.x += this.vx;
		} else if (this.y <= minY || maxY <= this.y) {
			this.vy *= -1;
			this.y += this.vy;
		}
	}

	bounceBlock(block) {
		const minX = block.x - this.radius;
		const maxX = block.maxX + this.radius;
		
		const minY = block.y - this.radius;
		const maxY = block.maxY + this.radius;

		if (minX < this.x && this.x < maxX && minY < this.y && this.y < maxY) {
			const x1 = Math.abs(minX - this.x);
			const x2 = Math.abs(this.x - maxX);

			const y1 = Math.abs(minY - this.y);
			const y2 = Math.abs(this.y - maxY);

			const min1 = Math.min(x1, x2);
			const min2 = Math.min(y1, y2);

			const min = Math.min(min1, min2);

			if (min == min1) {
				this.vx *= -1;
				this.x += this.vx;
			} else if (min == min2) {
				this.vy *= -1;
				this.y += this.vy;
			}
		}
	}
}

