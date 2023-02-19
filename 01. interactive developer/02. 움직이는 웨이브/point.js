/**
 * 웨이브를 그린다는 것은 웨이브를 그린다기 보단 간격을 가진 좌표를 하나씩 만들어서
 * 좌표의 Y값을 위 아래로 이동시키고 각각의 좌표를 하나의 선으로 연결하는 것을 그린다
 * Point 클래스는 X, Y 값을 가지고 있고, 얼만큼 움직일 것인가에 대한 Max 값을 가지고 있으며
 * 현재 값을 speed 만큼 증가시켜주고 Sin 함수를 써서 위 아래로 움직일 수 있도록 함
 * 위 아래로 움직이는 포인트들을 일정 간격으로 나열하고, 포인트를 곡선으로 연결하면 움직이는 웨이브가 완성 됨
*/
export class Point {
	
	constructor(index, x, y) {

		//console.log(index, x, y);

		// 포인트의 현재 위치
		this.x = x;
		this.y = y;
		
		this.fixedY = y;
		this.speed = 0.07;
		
		/**
		 * Point에 index를 넘겨서 Point가 몇번째 Point인지 정의
		 * 
		 * 포인트가 동시에 위 아래로 움직이면 웨이브처럼 안보이고 하나의 선처럼 보이기 때문에
		 * 고유의 인덱스 넘버를 넘겨줘서 웨이브가 약간의 차이를 두고 움직일 수 있도록
		 * Y위치가 다른 Point가 될 수 있게 정의
		 */
		this.cur = index;

		this.max = Math.random() * 100 + 150;
	}

	update() {
		// 위 아래로 움직이도록하는 함수
		this.cur += this.speed;
		this.y = this.fixedY + (Math.sin(this.cur) * this.max);
	}
}