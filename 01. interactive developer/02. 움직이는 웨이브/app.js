//import { Wave } from './wave.js';
import { WaveGroup } from './wavegroup.js';

class App {

	constructor() {

		// canvas 영역 생성
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');

		// 화면에 붙임
		document.body.appendChild(this.canvas);

		//this.wave = new Wave();
		this.waveGroup = new WaveGroup();

		// 윈도우 리사이즈 이벤트 바인딩
		window.addEventListener('resize', this.resize.bind(this), false);
		this.resize();

		// 애니메이션 시작
		window.requestAnimationFrame(this.animate.bind(this));
	}

	resize() {

		// 스테이지 사이즈 계산
		this.stageWidth = document.body.clientWidth;
		this.stageHeight = document.body.clientHeight;

		// 레티나 디스플레이에서 선명하게 보이게 하기 위해 두배로 설정
		this.canvas.width = this.stageWidth * 2;
		this.canvas.height = this.stageHeight * 2;

		// 배율 조정: 한 단위에 2픽셀로 설정 됨
		this.ctx.scale(2, 2);

		// Wave 그리기
		//this.wave.resize(this.stageWidth, this.stageHeight);
		this.waveGroup.resize(this.stageWidth, this.stageHeight);

	}

	animate(t) {
		this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);	// canvas 클리어

		//this.wave.draw(this.ctx);
		this.waveGroup.draw(this.ctx);

		window.requestAnimationFrame(this.animate.bind(this));			// 애니메이션 시작
	}
}

window.onload = () => {
	new App();
};