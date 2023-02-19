import { Wave } from './wave.js';

export class WaveGroup {

	constructor() {
		
		// 전체 웨이브의 수
		this.totalWaves = 3;

		// 하나의 웨이브에 포인트의 수
		this.totalPoints = 6;

		// 웨이브 별 색상: 각각의 웨이브가 다른 색상을 가지고 있어야 구분이 가능하므로
		// 약 40%의 opacity(투명도)를 가진 여러가지의 파란색을 정의
		//this.color = ['rgba(0, 199, 235, 0.4)', 'rgba(0, 146, 199, 0.4)', 'rgba(0, 87, 158, 0.4)'];
		this.color = ['rgba(255, 0, 0, 0.4)', 'rgba(255, 255, 0, 0.4)', 'rgba(0, 255, 255, 0.4)'];
		
		//
		this.waves = [];

		// totlaWaves 수 만큼 Wave를 생성
		for(let i = 0; i < this.totalWaves; i++) {
			const wave = new Wave(
				i,
				this.totalPoints,
				this.color[i]
			);
			this.waves[i] = wave;
		}
		//console.log(this.waves);
	}

	resize(stageWidth, stageHeight) {
		//console.log(stageWidth, stageHeight);
		// WaveGroup 안에 있는 전체 Wave만큼 함수를 실행
		for(let i = 0; i < this.totalWaves; i++) {
			const wave = this.waves[i];
			console.log(wave);
			wave.resize(stageWidth, stageHeight);
		}
	}

	draw(ctx) {
		for(let i = 0; i < this.totalWaves; i++) {
			const wave = this.waves[i];
			wave.draw(ctx);
		}
	}
}