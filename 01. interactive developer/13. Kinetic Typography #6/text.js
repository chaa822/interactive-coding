
export class Text {

	constructor() {

		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');

		//this.canvas.style.position = 'absolute';
		//this.canvas.style.top = '0';
		//this.canvas.style.left = '0';

		//document.body.appendChild(this.canvas);
	}

	setText(str, density, stageWidth, stageHeight) {

		this.canvas.width = stageWidth;
		this.canvas.height = stageHeight;

		const myText = str;
		const fontWidth = 700;
		const fontSize = 800;
		const fontName = 'Hind';

		this.ctx.clearRect(0, 0, stageWidth, stageHeight);
		this.ctx.font = `${fontWidth} ${fontSize}px ${fontName}`;
		this.ctx.fillStyle = `rgba(0, 0, 0, 0.3)`;
		this.ctx.textBaseline = `middle`;

		const fontPos = this.ctx.measureText(myText);

		this.ctx.fillText(
			myText,
			(stageWidth - fontPos.width) / 2,
			fontPos.actualBoundingBoxAscent + fontPos.actualBoundingBoxDescent + ((stageHeight - fontSize) / 2)
		);

		return this.dotPos(density, stageWidth, stageHeight);
	}

	dotPos(density, stageWidth, stageHeight) {
		
		const imageData = this.ctx.getImageData(0, 0, stageWidth, stageHeight).data;

		let i = 0;
		let width = 0;
		let pixel = 0;

		const particles = [];
		for (let height = 0; height < stageHeight; height += density) {
			i += 1;
			width = (i % 2 === 0) ? 6 : 0;

			for (width; width < stageWidth; width += density) {
				const index = ((width + (height * stageWidth)) * 4) - 1;
				pixel = imageData[index];

				if (pixel !== 0 && (0 < width && width < stageWidth) && (0 < height && height < stageHeight)) {
					particles.push({
						x: width,
						y: height,
					});
				}
			}
		}

		return particles;
	}
}