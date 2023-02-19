
export class Hill {

	constructor(color, speed, total) {
		/**
		 * 하나가 아닌 여러개의 다양한 언덕을 만들 수 있도록
		 * 색상, 속도, 언덕의 포인트 개수를 파라미터로 받음
		 */
		this.color = color;
		this.speed = speed;
		this.total = total;
	}

	resize(stageWidth, stageHeight) {
		this.stageWidth = stageWidth;
		this.stageHeight = stageHeight;

		/**
		 * 간격 := 포인트의 개수 만큼 띄움
		 * 포인트의 개수 - 2를 해서 간격의 총합이 스테이지 넓이(stageWidth)보다 크게 그려지도록 함
		 * 이렇게 하면 양이 보이지 않는 바깥 영역에서부터 들어오는 효과를 줄 수 있음
		 */
		this.gap = Math.ceil(this.stageWidth / (this.total - 2));
		
		this.points = [];
		for (let i = 0; i < this.total; i += 1) {
			this.points[i] = {
				x: i * this.gap,
				y: this.getY()	// 랜덤
			}
		}
	}

	draw(ctx) {
		// 언덕을 그리는 함수
		ctx.fillStyle = this.color;
		ctx.beginPath();

		let cur = this.points[0];
		let prev = cur;
		let dots = [];
		
		// 언덕이 짤리지 않도록 refresh
		cur.x += this.speed;
		if (cur.x > -this.gap) {
			this.points.unshift({
				x: -(this.gap * 2),
				y: this.getY()
			});
		} else if (cur.x > this.stageWidth + this.gap) {
			this.points.splice(-1);	// 맨 뒤 요소 삭제
		}
		// end

		ctx.moveTo(cur.x, cur.y);

		let prevCx = cur.x;
		let prevCy = cur.y;

		for (let i = 1; i < this.points.length; i += 1) {
			cur = this.points[i];
			cur.x += this.speed;	// 움직이도록
			const cx = (prev.x + cur.x) / 2;
			const cy = (prev.y + cur.y) / 2;
			ctx.quadraticCurveTo(prev.x, prev.y, cx, cy);	// 곡선을 그림

			dots.push({
				x1: prevCx, y1: prevCy,
				x2: prev.x, y2: prev.y,
				x3: cx,
				y3: cy,
			});

			prev = cur;
			prevCx = cx;
			prevCy = cy;
		}

		ctx.lineTo(prev.x, prev.y);
		ctx.lineTo(this.stageWidth, this.stageHeight);
		ctx.lineTo(this.points[0].x, this.stageHeight);
		ctx.fill();

		return dots;	// 나중에 곡선(점)의 좌표를 양을 찾는데 써야해서 리턴해줌
	}

	getY() {
		// Y 값을 랜덤으로 가져오기 위한 함수
		const min = this.stageHeight / 8;
		const max = this.stageHeight - min;
		return min + Math.random() * max;
	}
}