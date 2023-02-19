import { Point } from './point.js';

export class Wave {

	constructor(index, totalPoints, color) {
		/**
		 * Wave에도 역시 index 값을 넘겨주고
		 * totalPoints를 넘겨줘서 몇개의 Point를 생성할 것인지 각각의 Wave마다 지정
		 */
		this.index = index;
		//console.log(this.index);
		this.totalPoints = totalPoints;
		this.color = color;
		this.points = [];
	}

	resize(stageWidth, stageHeight) {
		/**
		 * 애니메이션을 그릴 때 가장 중요한 것은
		 * 내가 그리고자 하는 애니메이션의 좌표 값을 가져오는 것
		 * 그러기 위해서는 애니메이션의 크기를 알아야 하므로, 스테이지의 넓이와 높이를 가져오는 것이 굉장히 중요
		 */
		this.stageWidth = stageWidth;
		this.stageHeight = stageHeight;

		/**
		 * 이 웨이브는 화면의 중간에 그려질 것이기 때문에, centerX와 centerY를 정의
		 * centerX: 스테이지 넓이의 반
		 * centerY: 스테이지 높이의 반
		 */
		this.centerX = stageWidth / 2;
		this.centerY = stageHeight / 2;

		/**
		 * Point의 간격 := 스테이지 넓이에서 totalPoints만큼 나눈 값
		 */
		this.pointGap = this.stageWidth / (this.totalPoints - 1);

		/**
		 * centerX와 centerY가 정해진 다음에, 즉 resize 함수가 호출된 후
		 * init() 함수를 호출해 Point를 생성
		 */
		this.init();
	}

	init() {

		// center X, Y의 위치를 넘겨줘서 각각의 Point가 화면의 중간을 기준으로 그려질 수 있도록 정의
		//this.point = new Point(this.centerX, this.centerY);
		this.points = [];

		// 간격에 맞춰서 Point를 화면에 그린다
		for (let i = 0; i < this.totalPoints; i++) {
			const point = new Point(
				this.index + i,
				this.pointGap * i,
				this.centerY
			);
			this.points[i] = point;
		}
	}

	draw(ctx) {
		/**
		 * 업데이트 된 Point 갯수에 맞춰서 draw 함수 업데이트
		 */
		ctx.beginPath();
		ctx.fillStyle = this.color;

		/**
		 * 처음과 마지막 Point는 움직이지 않고, 가운데 Point만 위 아래로 움직여서 웨이브의 움직임을 만듦
		 * index가 0이거나 total-1과 같으면 update함수를 실행하지 않는다
		 */
		let prevX = this.points[0].x;
		let prevY = this.points[0].y;

		ctx.moveTo(prevX, prevY);

		for (let i = 1; i < this.totalPoints; i++) {
			if (i < this.totalPoints - 1) {
				this.points[i].update();
			}

			const cx = (prevX + this.points[i].x) / 2;
			const cy = (prevY + this.points[i].y) / 2;

			//ctx.lineTo(cx, cy);
			ctx.quadraticCurveTo(prevX, prevY, cx, cy);

			prevX = this.points[i].x;
			prevY = this.points[i].y;
		}

		ctx.lineTo(prevX, prevY);
		ctx.lineTo(this.stageWidth, this.stageHeight);
		ctx.lineTo(this.points[0].x, this.stageHeight);
		ctx.fill();
		ctx.closePath();
	}
}