const { Server } = require('socket.io');
const io = new Server(2447, { cors: { origin: '*' } });
const fs = require('fs');
const crosswordClues = fs.readFileSync('./clues.txt', 'utf8')
const miniCrosswordClues = fs.readFileSync('./twos.txt', 'utf8')

let rooms = {}
let puzzleOne = {
	wordNums: [[0, 0, 1], [1, 0, 2], [2, 0, 3], [3, 0, 4], [5, 0, 5], [6, 0, 6], [7, 0, 7], [8, 0, 8], [9, 0, 9], [0, 1, 10], [5, 1, 11], [0, 2, 12], [4, 2, 13], [3, 3, 14], [7, 3, 15], [0, 4, 16], [1, 4, 17], [2, 4, 18], [6, 4, 19], [0, 5, 20], [5, 5, 21], [0, 6, 22], [4, 6, 23], [0, 7, 24], [3, 7, 25], [7, 7, 26], [8, 7, 27], [9, 7, 28], [0, 8, 29], [6, 8, 30], [0, 9, 31], [6, 9, 32]],
	solution: [	
		['f', 'a', 'v', 'a', null, 'b', 'l', 'a', 'c', 'k'],
		['c', 'a', 'i', 'n', null, 'l', 'a', 'n', 'a', 'i'],
		['c', 'r', 'e', 'd', 'i', 't', 'c', 'a', 'r', 'd'],	
		[null, null, null, 'e', 's', 's', null, 'l', 'o', 'n'],
		['l', 'i', 'd', 'a', 'r', null, 'v', 'o', 'l', 'e'],
		['e', 't', 'o', 'n', null, 'c', 'a', 'g', 'e', 'y'],
		['n', 'w', 't', null, 'r', 'o', 'c', null, null, null],
		['t', 'a', 'c', 'o', 't', 'r', 'u', 'c', 'k', 's'],	
		['i', 's', 'o', 'n', 'e', null, 'u', 'r', 'i', 'e'],
		['l', 'i', 'm', 'a', 's', null, 'm', 'u', 'n', 'g']
	],
	clues: crosswordClues.split('\r\n')
}
let puzzleTwo = {
	wordNums: [[1, 0, 1], [2, 0, 2], [3, 0, 3], [4, 0, 4],[0, 1, 5], [0, 2, 6], [0, 3, 7], [0, 4, 8] ],
	solution:
	[
		[null, 'c', 'o', 'd', 'e'],
		['h', 'a', 'r', 'e', 's'],
		['a', 'n', 'i', 's', 'e'],
		['c', 'o', 'o', 'k', null],
		['k', 'e', 'n', null, null]
	],
	clues: miniCrosswordClues.split('\r\n')
}

const createRoom = (game, args) => {
	let id = Math.floor(Math.random() * 100000);
	if(!rooms[id]) {
		rooms[id] = {
			type: game,
			game: {}
		}
	}
	console.log(args)
	switch(game) {
		case 'crossword':
			let puzzle
			if(args == "mini") puzzle = puzzleTwo
			else puzzle = puzzleOne
			rooms[id].game.board = []
			for(let i = 0; i < puzzle.solution.length; i++) {
				rooms[id].game.board.push([])
				for(let j = 0; j < puzzle.solution.length; j++) {
					rooms[id].game.board[i].push({
						value: '',
						block: puzzle.solution[j][i] === null ? true : false,
						num: puzzle.wordNums.find((box) => box[0] === i && box[1] === j)?.[2] ?? null
					})
				}
			}
			rooms[id].game.clues = puzzle.clues
			break;
	}
	return id;
}

const roomComplete = (id) => {
	let room = rooms[id];
	switch(room.type) {
		case 'crossword':
			let puzzle = puzzleOne
			if(room.game.board.length === 5) puzzle = puzzleTwo
			for(let i = 0; i < puzzle.solution.length; i++) {
				for(let j = 0; j < puzzle.solution.length; j++) {
					if(puzzle.solution[i][j] !== null && 
						room.game.board[j][i].value.toUpperCase() !== puzzle.solution[i][j].toUpperCase()) {
						return false;
					}
				}
			}
			return true;
	}
}

io.on('connection', (socket) => {
	let socketRoomId = null;

	socket.on('create', (info) => {
		let { game, args } = info
		let id = createRoom(game, args);
		console.log(Object.keys(rooms))
		socket.join(id);
		socketRoomId = id;
		socket.emit('room', {
			id: id,
			type: game,
			board: rooms[id].board
		})
	})
	socket.on('joinroom', (id) => {
		if(!rooms[id]) {
			socket.emit('error', 'Room does not exist');
			return;
		};
		socket.join(id);
		socketRoomId = id;
		socket.emit('room', {
			id: id,
			type: rooms[id].type,
			game: rooms[id].game
		})
		io.to(socketRoomId).emit('chat', "A new friend has joined the room!")
	})

	// socket.on('game', (data) => {
	// 	console.log(socketRoomId)
	// 	if(!socketRoomId) return;
	// 	rooms[socketRoomId].game = {
	// 		...rooms[socketRoomId].game,
	// 		...data
	// 	};
	// 	let complete = roomComplete(socketRoomId)
	// 	if(complete) {
	// 		io.to(socketRoomId).emit('win');
	// 	}
	// 	socket.to(socketRoomId).emit('game', rooms[socketRoomId].game);
	// })

	socket.on('tile', (data) => {
		let { x, y, value } = data;
		if(!socketRoomId) return;
		rooms[socketRoomId].game.board[x][y].value = value;
		let complete = roomComplete(socketRoomId)
		if(complete) {
			io.to(socketRoomId).emit('win');
		}
		socket.to(socketRoomId).emit('game', rooms[socketRoomId].game);
	})

	socket.on('chat', (data) => {
		if(!socketRoomId) return;
		io.to(socketRoomId).emit('chat', data);
	})

	socket.on('getGame', () => {
		if(!socketRoomId) return;
		socket.emit('game', rooms[socketRoomId].game);
	})
})