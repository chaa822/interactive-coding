import { Text } from './text.js';

class App {

	constructor() {

		WebFont.load({
			google: {
				families: ['Hind:700'],
			},
			fontactive: () => {
				this.text = new Text();
				this.text.setText('A', 2, document.body.clientWidth, document.body.clientHeight);

				this.resize();
				//window.addEventListener('resize', this.resize.bind(this), false);
				//window.requestAnimationFrame(this.animate.bind(this));
			}
		});
	}

	resize() {

	}

	animate(t = 0) {

	}
}

window.onload = () => {
	new App();
};