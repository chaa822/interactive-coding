export class Text {
	constructor() {
		this.canvas = document.createElement('canvas');
		this.context = this.canvas.getContext('2d');

		//this.canvas.style.position = 'absolute';
		//this.canvas.style.left = '0';
		//this.canvas.style.top = '0';
		
		//document.body.appendChild(this.canvas);
	}

	setText(str, density, stageWidth, stageHeight) {
		this.canvas.width = stageWidth;
		this.canvas.height = stageHeight;

		const myText = str;
		const fontWidth = 700;
		const fontSize = 800;
		const fontName = 'Hind';

		this.context.clearRect(0, 0, stageWidth, stageHeight);
		this.context.font = `${fontWidth} ${fontSize}px ${fontName}`;
		this.context.fillStyle = `rgba(0, 0, 0, 0.3)`;
		this.context.textBaseline = `middle`;

		const fontPos = this.context.measureText(myText);
		this.context.fillText(
			myText,
			(stageWidth - fontPos.width) / 2,
			fontPos.actualBoundingBoxAscent + fontPos.actualBoundingBoxDescent + ((stageHeight - fontSize) / 2)
		);

		return this.dotPos(density, stageWidth, stageHeight);
	}

	dotPos(density, stageWidth, stageHeight) {
		const particles = [];
		const imageData = this.context.getImageData(0, 0, stageWidth, stageHeight).data;

		let i = 0;
		let width = 0;
		let pixel;

		for (let height = 0; height < stageHeight; height += density) {
			++i;
			const slide = (i % 2) == 0;
			width = 0;
			if (slide) {
				width += 6;
			}

			for (width; width < stageWidth; width += density) {
				const index = ((width + (height * stageWidth)) * 4) - 1;
				pixel = imageData[index];
				if (pixel !== 0 && 0 < width && width < stageWidth && 0 < height && height < stageHeight) {
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