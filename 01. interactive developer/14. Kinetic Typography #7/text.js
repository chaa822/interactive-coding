import { pointCircle } from './utils.js';

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
			((stageHeight - fontSize) / 2) + fontPos.actualBoundingBoxAscent + fontPos.actualBoundingBoxDescent
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
		//return particles;
		return this.getOutline(particles, density);
	}

	getOutline(particles, density) {

		let minX = particles[0].x;
		let maxX = particles[0].x;

		let minY = particles[0].y;
		let maxY = particles[0].y;
		
		for (let i = 1; i < particles.length; i += 1) {

			const item = particles[i];
			
			minX = Math.min(minX, item.x);
			maxX = Math.max(maxX, item.x);

			minY = Math.min(minY, item.x);
			maxY = Math.max(maxY, item.x);
		}

		const gap = density * 2;
		
		const distX = maxX - minX;
		const distY = maxY - minY;

		const xTotal = (distX / gap) | 0;
		const yTotal = (distY / gap) | 0;

		const outline = [];
		const xArray = [];
		
		for (let i = 0; i < xTotal; i += 1) {
			
			const tx = i * gap + minX;
			xArray[i] = [];
			
			for (let j = 0; j < yTotal; j += 1) {
				
				const ty = j * gap + minY;

				for (let k = 0; k < particles.length; k += 1) {
					const item = particles[k];

					if (pointCircle(item.x, item.y, tx, ty, gap)) {
						xArray[i].push({
							x: tx,
							item,
						});
					}
				}
			}
		}

		let check = 0;
		let prevY;

		for (let i = 0; i < xArray.length; i += 1) {
			
			check = 0;

			for (let j = 0; j < xArray[i].length; j += 1) {
				
				const pos = xArray[i][j];
				
				if (check === 0) {
					
					prevY = pos.item.y;
					
					outline.push({
						x: pos.x,
						minY: pos.item.y,
						maxY: pos.item.y,
					});

					check = 1;
				
				} else if (check === 1) {
					
					if (pointCircle(pos.x, pos.item.y, pos.x, prevY, gap)) {
						
						const cur = outline[outline.length - 1];
						
						cur.minY = Math.min(cur.minY, pos.item.y);
						cur.maxY = Math.max(cur.maxY, pos.item.y);
						
						check = 1;
						prevY = pos.item.y;

					} else {

						check = 2;
					}

				} else if (check === 2) {
					
					prevY = pos.item.y;

					outline.push({
						x: pos.x,
						minY: pos.item.y,
						maxY: pos.item.y,
					});
					
					check = 1;
				}
			}
		}
		return {
			particles,
			minX,
			maxX,
			minY,
			maxY,
			outline,
		}
	}
}