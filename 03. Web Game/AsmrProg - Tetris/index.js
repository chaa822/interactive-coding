'use strict';

const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(20, 20);

let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

// 블럭의 색상 정의
const colors = [
	null,
	'#ff0d72',
	'#0dc2ff',
	'#0dff72',
	'#f538ff',
	'#ff8e0d',
	'#ffe138',
	'#3877ff',
];

// 테트리스 보드 생성
const arena = createMatrix(12, 20);

// 플레이어가 현재 조작하는 블럭의 정보, 현재 점수를 저장
const player = {
	pos: { x: 0, y: 0 },
	matrix: null,
	score: 0,
};

// 테트리스 보드 초기화
playerReset();
// 점수 초기화
updateScore();
//
update();

/**
 * 테트리스 보드의 최하단 줄부터 올라오면서
 * 없앨 줄이 있는지 확인한다.
 */
function arenaSweep() {
	let rowCount = 1;

	// y := 테트리스 보드의 가장 아랫 줄 ~ 가장 윗 줄
	outer: for (let y = arena.length - 1; y > 0; --y) {
		// x := y 번째 줄의 왼쪽 ~ 오른쪽 x 좌표
		for (let x = 0; x < arena[y].length; ++x) {
			// y 번째 줄에서 비어있는 블럭이 있으면 건너뛰고 윗줄을 확인한다.
			if (arena[y][x] === 0) {
				continue outer;
			}
		}

		// 비어있는 블럭이 없을 때
		// 현재 y 번째 줄의 블럭을 빼서 0으로 초기화하고 맨 윗줄에 삽입한다.
		const row = arena.splice(y, 1)[0].fill(0);
		arena.unshift(row);

		// y 번째 줄을 삭제하고 위에 줄이 한 줄 내려왔으니까
		// 다시 같은 y 번째 줄을 검사해야 하므로 y += 1 해준다.
		++y;

		// 한번에 여러 줄을 없앨 경우 가중치를 주기 위해 2를 곱함
		player.score += rowCount * 10;
		rowCount *= 2;
	}
}

/**
 * 플레이어의 현재 블럭과 기존의 블럭이 충돌 되는지 체크
 * @param arena, player
 * @return boolean
 */
function collide(arena, player) {
	// 플레이어의 블럭의 모양 (ex: [[5, 5, 0], [0, 5, 5], [0, 0, 0]])
	const m = player.matrix;
	// 플레이어의 블럭의 x, y 좌표 (ex: { x: 0, y: 0 })
	const o = player.pos;

	// 플레이어의 블럭 배열을 돌면서, 실시간으로 업데이트 되는 플레이어의 블럭 위치를 더했을 때
	// 현재 테트리스 전체 보드의 기존의 블럭에 닿는지 확인한다.
	for (let y = 0; y < m.length; ++y) {
		for (let x = 0; x < m[y].length; ++x) {
			if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
				return true;
			}
		}
	}
	return false;
}

/**
 * 테트리스 보드 생성
 * @param w, h
 */
function createMatrix(w, h) {
	const matrix = [];
	while (h--) {
		matrix.push(new Array(w).fill(0));
	}
	return matrix;
}

/**
 * 테트리스 블럭 생성
 * @param {*} type 
 */
function createPiece(type) {
	const piece = {
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
	return piece[type];
}

/**
 * 전체 테트리스 보드 또는 현재 블럭의 정보를 기준으로 화면에 그린다.
 * @param matrix, offset
 */
function drawMatrix(matrix, offset) {
	// y 좌표 반복 (맨 윗줄 -> 맨 아랫줄)
	matrix.forEach((row, y) => {
		// x 좌표 반복 (왼쪽 -> 오른쪽)
		row.forEach((value, x) => {
			if (value !== 0) {	// 0은 빈 공간이므로 그릴 필요 없음
				// 배열의 value 숫자를 기준으로 컬러 지정
				context.fillStyle = colors[value];

				// 전체 테트리스 보드는 offset의 x, y가 0, 0이므로 현재 위치를 뜻함
				// 현재 블럭 모양의 x, y에 현재 위치 (offset의 x, y)를 더해줘야 함
				context.fillRect(x + offset.x, y + offset.y, 1, 1);
			}
		});
	});
}

/**
 *
 */
function draw() {
	
	// canvas 애니메이션을 연속해서 그리면 그림이 이어지면서 늘어지기 때문에
	// 배경 화면과 기존의 블럭, 플레이어의 블럭을 계속 다시 그려서 초기화함
	context.fillStyle = '#000';
	context.fillRect(0, 0, canvas.width, canvas.height);

	// 전체 테트리스 보드를 기준으로 화면을 먼저 그린다.
	drawMatrix(arena, { x: 0, y: 0 });

	// 현재 블럭의 모양과 위치를 기반으로 화면을 그린다.
	// console.log(player.matrix);
	// console.log(player.pos);
	drawMatrix(player.matrix, player.pos);
}

/**
 * 현재 테트리스 보드에 현재 테트리스 블럭을 더해준다. (취합)
 * @param arena, player
 */
function merge(arena, player) {
	player.matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if (value !== 0) {
				arena[y + player.pos.y][x + player.pos.x] = value;
			}
		});
	});
}

/**
 * 현재의 블럭을 회전한다.
 * @param matrix
 * @param dir
 */
function rotate(matrix, dir) {
	// console.log(JSON.parse(JSON.stringify(matrix)));
	for (let y = 0; y < matrix.length; ++y) {
		for (let x = 0; x < y; ++x) {
			[matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
		}
	}
	// console.log(JSON.parse(JSON.stringify(matrix)));

	if (dir > 0) {
		matrix.forEach((row) => row.reverse());
	} else {
		matrix.reverse();
	}
	// console.log(JSON.parse(JSON.stringify(matrix)));
}

/**
 * 현재의 블럭을 아래로 한 칸 이동
 */
function playerDrop() {

	// 현재 블럭의 y좌표 값 1 증가 := 현재 블럭을 한칸 밑으로 이동
	player.pos.y++;

	// 한칸 밑으로 내려온 블럭이 기존의 블럭과 충돌되거나 제일 밑에 닿으면
	if (collide(arena, player)) {

		// 현재 블럭의 y좌표 값 1 감소 := 다시 한칸 위로 이동
		player.pos.y--;

		// 현재 테트리스 보드에 현재 테트리스 블럭을 더해준다.
		merge(arena, player);

		// 새로운 블럭을 생성
		playerReset();

		// 테트리스 보드의 최하단 줄부터 올라오면서 없앨 줄이 있는지 확인한다.
		arenaSweep();

		// 실시간 점수 업데이트
		updateScore();
	}
	dropCounter = 0;
}

/**
 * 현재의 테트리스 블럭 좌우 이동
 * @param offset
 */
function playerMove(offset) {
	// 현재 블럭의 x 좌표를 offset(1, -1)만큼 이동
	player.pos.x += offset;

	// 블럭이 테트리스 보드에 닿거나 기존의 블럭과 충돌 되는지 확인
	// 충돌한다면 다시 원 위치 := 이동하지 않음
	if (collide(arena, player)) {
		player.pos.x -= offset;
	}
}

/**
 * 새로운 블럭을 생성하고 충돌할 경우 초기화한다.
 */
function playerReset() {

	// 블럭들의 모양
	const pieces = 'TJLOSZI';

	// 랜덤 블럭 생성 -> player.matrix 속성에 바인딩 (저장)
	const index = (pieces.length * Math.random()) | 0;
	player.matrix = createPiece(pieces[index]);

	// player.pos 속성에 위치 정보 초기화
	// y => 제일 첫 번째 줄 := 0
	// x => 중앙에 위치 := 4 ~ 5
	player.pos.y = 0;
	player.pos.x = ((arena[0].length / 2) | 0) - ((player.matrix[0].length / 2) | 0);

	// 플레이어의 블럭이 기존의 블럭에 닿는지 체크 한다.
	// 만약 닿을 경우 테트리스 보드를 초기화하고 점수를 0으로 업데이트 한다.
	if (collide(arena, player)) {
		arena.forEach(row => row.fill(0));
		player.score = 0;
		updateScore();
	}
}

/**
 * 사용자가 특정 키(위 화살표)를 눌러 블럭을 회전 시킨다.
 * @param dir
 */
function playerRotate(dir) {

	let offset = 1;
	const pos = player.pos.x;

	// 블럭 회전을 회전한다.
	rotate(player.matrix, dir);

	// 블럭이 기존의 블럭과 닿거나 보드의 끝에 닿았을 경우
	while (collide(arena, player)) {

		// 현재 블럭의 x 좌표를 한칸 이동한다.
		player.pos.x += offset;

		//
		offset = -(offset + (offset > 0 ? 1 : -1));

		if (offset > player.matrix[0].length) {
			rotate(player.matrix, -dir);
			player.pos.x = pos;
			return;
		}
	}
}

/**
 * window 객체의 requestAnimationFrame 함수는 첫 번째 파라미터로 timestamp를 받는다.
 *
 * 현재 프레임에서 다음 프레임이 시작 되기 전에 lastTime 변수에 timestamp를 저장하고
 * 다음 프레임에서, timestamp (프레임을 그리기 시작하고 현재까지의 누적 시간) - lastTime (이전 프레임까지의 누적시간)하여
 * 프레임당 시간 deltaTime(ex: 8ms)을 구한다.
 *
 * 프레임당 시간 (deltaTime)을 dropCounter 전역 변수에 누적하여 1000ms를 넘길 경우
 * 현재 블럭의 위치를 한칸 아래로 이동시킨다.
 *
 * 이렇게 하면 일정 시간마다 한칸씩 밑으로 떨어지는 동작을 만들어낼 수 있다.
 *
 * 해당 update 함수는 재귀 호출로 지속적으로 호출된다.
 * @param time
 */
function update(time = 0) {

	// deltaTime := 현재 프레임이 실행되기까지의 시간 (ex: 8ms)
	const deltaTime = time - lastTime;

	// dropCounter := deltaTime의 누적시간
	dropCounter += deltaTime;

	// dropCounter(deltaTime의 누적시간)가 dropInterval(1000ms)보다 크면
	// 현재 블럭의 위치를 아래로 한칸 이동 (y 좌표를 + 1)하고 값을 0으로 초기화
	if (dropCounter > dropInterval) {
		playerDrop();
	}

	// 다음 프레임에서 사용하기 위해 현재 프레임의 위치를 lastTime 전역 변수에 저장한다.
	lastTime = time;

	// 전체 테트리스 보드와 변경된 현재 블럭의 위치를 다시 그린다.
	draw();

	// 재귀호출
	window.requestAnimationFrame(update);
}

/**
 * 점수 업데이트
 */
function updateScore() {
	document.getElementById('score').innerText = 'score : ' + player.score;
}

// 키 조작 이벤트 바인딩
document.addEventListener('keydown', (event) => {
	switch (event.keyCode) {
		case 37: // arrow left
			playerMove(-1);
			break;
		case 39: // arrow right
			playerMove(1);
			break;
		case 38: // arrow up
			playerRotate(-1);
			break;
		case 40: // arrow down
			playerDrop();
			break;
		
		//case 87:
			//playerRotate(1);
			//break;
	}
});