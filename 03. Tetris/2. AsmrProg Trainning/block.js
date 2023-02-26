export class Block {
	static pieces = {
		'I': [
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0],
			[0, 1, 0, 0],
		],
		'L': [
			[0, 2, 0],
			[0, 2, 0],
			[0, 2, 2],

		],
		'J': [
			[0, 3, 0],
			[0, 3, 0],
			[3, 3, 0],
		],
		'O': [
			[4, 4],
			[4, 4],
		],
		'Z': [
			[5, 5, 0],
			[0, 5, 5],
			[0, 0, 0],
		],
		'S': [
			[0, 6, 6],
			[6, 6, 0],
			[0, 0, 0],
		],
		'T': [
			[0, 7, 0],
			[7, 7, 7],
			[0, 0, 0],
		]
	};

	constructor() {
		const pieces = 'ILJOZST';
		const randomIndex = Math.floor(Math.random() * pieces.length);
		return Block.pieces[pieces[randomIndex]];
	}
}