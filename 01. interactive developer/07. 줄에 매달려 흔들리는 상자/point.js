export class Point {

	constructor(x, y) {

		this.x = x || 0;
		this.y = y || 0;
	}

	// 덧셈연산
	add(point) {
		this.x += point.x;
		this.y += point.y;
		return this;
	}

	// 뺄셈연산
	subtract(point) {
		this.x -= point.x;
		this.y -= point.y;
		return this;
	}

	// 곱셈연산
	reduce(value) {
		this.x *= value;
		this.y *= value;
		return this;
	}

	// 충돌(?)
	collide(point, width, height) {
		if ((point.x <= this.x && this.x <= point.x + width) && (point.y <= this.y && this.y <= point.y + height)) {
			return true;
		} else {
			return false;
		}
	}

	clone() {
		return new Point(this.x, this.y);
	}
}