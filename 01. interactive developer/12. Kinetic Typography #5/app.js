import { Text } from './text.js';
import { Visual } from './visual.js';
import { setColor } from './color.js';

class App {

	constructor() {

		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
		this.thumbs = [];

		document.body.appendChild(this.canvas);

		WebFont.load({
			google: {
				families: ['Hind:700'],
			},
			fontactive: () => {

				//this.text = new Text();
				//this.text.setText('A', 2, document.body.clientWidth, document.body.clientHeight);

				const ul = document.getElementsByTagName('ul')[0];
				const lis = ul.getElementsByTagName('li');

				for (let i = 0; i < lis.length; i += 1) {
					const item = lis[i];
					const img = item.getElementsByTagName('img')[0];
					
					item.addEventListener('click', e => this.show(i), false);
					this.thumbs[i] = {
						item,
						img: img.src,
					};
				}

				this.text = new Text();
				
				this.resize();
				window.addEventListener('resize', this.resize.bind(this), false);
				
				window.requestAnimationFrame(this.animate.bind(this));
			}
		})
	}

	async show(index) {

		for (let i = 0; i < this.thumbs.length; i += 1) {
			const item = this.thumbs[i].item;
			if (i === index) {
				item.classList.add('selected');
			} else {
				item.classList.remove('selected');
			}
		}

		const img = this.thumbs[index].img;

		await setColor(img).then(obj => {
			this.visual = new Visual(this.pos, obj.colorCtx, obj.width, obj.height);
		});
	}

	resize() {
		
		this.stageWidth = document.body.clientWidth;
		this.stageHeight = document.body.clientHeight;
		
		this.canvas.width = this.stageWidth * this.pixelRatio;
		this.canvas.height = this.stageHeight * this.pixelRatio;

		this.ctx.scale(this.pixelRatio, this.pixelRatio);

		this.pos = this.text.setText('M', 6, this.stageWidth, this.stageHeight);
	}

	animate(t) {

		window.requestAnimationFrame(this.animate.bind(this));

		if (this.visual) {
			this.visual.animate(this.ctx);
		}
	}
}

window.onload = () => {
	new App();
};