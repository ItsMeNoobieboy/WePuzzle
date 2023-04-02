<template>
	<div class="fixed top-8 left-1/2 transform -translate-x-1/2 roomID">Room code: {{ roomID }}
		<!-- (<button
			class="hover:underline" id="copyRoomCode" @click="handleCopyRoomCode()">Click here to copy join link</button>) -->
	</div>
	<div class="w-screen h-screen flex justify-center items-center">
		<div class="clues z-15">
			<div v-for="clue in clues">{{ clue }}</div>
		</div>
		<div class="grid" :style="`--size: ${grid.length}`">
			<div v-for="(row, x) in grid" class="row">
				<div v-for="(cell, y) in row" class="cell" :class="{ block: cell?.block }">
					<div class="number font-bold" v-if="cell.num">{{ cell.num }}</div>
					<input class="caret-transparent" :value="cell.value" maxlength="1" @keydown="update($event, x, y)"
						:disabled="cell.block" />
				</div>
			</div>
		</div>
	</div>
	<canvas class="complete z-20" v-show="complete || false"></canvas>
	<div
		class="victory fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-400 dark:bg-slate-900 text-4xl md:text-6xl lg:text-8xl p-10 text-center z-30 rounded-full" v-if="complete || false">
		Congrats!</div>
	<div class="chat bg-slate-200 dark:bg-slate-800 m-4">
		<div class="messages">
			<div v-for="message in chatMessages">{{ message }}</div>
		</div>
		<input type="text chat" class="bg-slate-300 dark:bg-slate-700" @keydown="sumbit" />
	</div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const complete = ref(false);
const grid = ref([])
const clues = ref([])
const chatMessages = ref([])
let params = new URLSearchParams(window.location.search)
const roomID = params.get('room')

window.socket.on('game', (data) => {
	grid.value = data.board
	clues.value = data.clues
	console.log(data)
})

const sumbit = (e) => {
	if (e.key == "Enter") {
		window.socket.emit('chat', e.target.value)
		e.target.value = ""
	}
}

window.socket.on('chat', (data) => {
	chatMessages.value.push(data)
	if (chatMessages.value.length > 100) chatMessages.value.shift()
	// scroll to bottom
	document.querySelector('.messages').scrollTop = document.querySelector('.messages').scrollHeight
})

let can = new Image()
can.src = "/can.png"

window.socket.on('win', () => {
	complete.value = true
	let c = document.querySelector('.complete')
	let ctx = c.getContext('2d')
	console.log(c)
	c.width = window.innerWidth
	c.height = window.innerHeight
	const placeCan = (x, y) => {
		// rotate the can randomly
		ctx.save()
		ctx.translate(x, y)
		ctx.rotate(Math.random() * Math.PI * 2)
		ctx.drawImage(can, -can.width / 2, -can.height / 2, 200, 200)
		ctx.restore()
	}
	let canLocations = []
	for (let i = 0; i < c.width; i += 50) {
		for (let j = 0; j < c.height; j += 50) {
			canLocations.push([i, j])
		}
	}
	const addBeans = () => {
		for (let i = 0; i < 3; i++) {
			let canIndex = Math.floor(Math.random() * canLocations.length)
			let canPos = canLocations[canIndex]
			if (!canPos) return
			canLocations.splice(canIndex, 1)
			placeCan(canPos[0], canPos[1])
		}
		window.requestAnimationFrame(addBeans)
	}
	addBeans()
})

onMounted(() => {
	window.socket.emit('getGame')
})

function update(e, x, y) {
	if (e.key == "ArrowDown") document.querySelectorAll('input')[x * grid.value.length + y + 1]?.focus?.()
	if (e.key == "ArrowUp") document.querySelectorAll('input')[x * grid.value.length + y - 1]?.focus?.()
	if (e.key == "ArrowLeft") document.querySelectorAll('input')[(x - 1) * grid.value.length + y]?.focus?.()
	if (e.key == "ArrowRight") document.querySelectorAll('input')[(x + 1) * grid.value.length + y]?.focus?.()
	if (e.key == "Backspace" || e.key == "Delete") {
		e.target.value = "";
		grid.value[x][y].value = "";
		window.socket.emit('tile', { x, y, value: "" });
		return;
	}
	if (e.key.length > 1) return
	let valid = e.key.match(/^[a-zA-Z]$/)
	if (!valid) {
		e.preventDefault()
		return
	}
	// replace the content with only letters and uppercase
	e.target.value = e.key.replace(/[^a-zA-Z]/g, '').toUpperCase()

	// update the grid
	grid.value[x][y].value = e.target.value.toUpperCase()

	// send the update to the server
	window.socket.emit('tile', { x, y, value: e.target.value.toUpperCase() })
}

// function handleCopyRoomCode() {
// 	navigator.clipboard.writeText("test")
// 		.then(() => {
// 			console.log(`Copied room code to clipboard`);
// 		})
// 		.catch(err => {
// 			console.error(`Error copying room code to clipboard: ${err}`);
// 		});
// }
</script>

<style scoped>
/* mobile */
@media (max-width: 768px) {
	.chat {
		display: none;
	}

	.roomID {
		display: none;
	}
}

.chat {
	position: absolute;
	left: 0;
	bottom: 0;
	width: 15%;
	height: 40%;
}

.chat .messages {
	width: 100%;
	height: 90%;
	overflow-y: scroll;
}

.chat input {
	width: 100%;
	height: 10%;
	position: absolute;
	bottom: 0;
}

.complete {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
}

.complete .banner {
	width: 100%;
	background-color: white;
	height: 50%;
	margin: 3rem;
	border-radius: 3rem;
}

.clues {
	display: flex;
	flex-direction: column;
	width: 45vmin;
	height: 75vmin;
	overflow-y: scroll;
}

.grid {
	display: grid;
	grid-template-columns: repeat(var(--size), 1fr);
	grid-template-rows: repeat(var(--size), 1fr);
	width: 75vmin;
	height: 75vmin;
}

.cell {
	background-color: white;
	border: 3px solid black !important;
	height: calc(75vmin / var(--size));
	width: calc(75vmin / var(--size));
	display: flex;
	justify-content: center;
	align-items: center;
	color: black;
	/* font-weight: bold; */
	font-family: Verdana, Geneva, Tahoma, sans-serif;
	text-align: center;
	outline: none !important;
	position: relative;
}

.cell div {
	position: absolute;
	top: 0;
	left: 0;
	font-size: calc(20vmin / var(--size));
}

.cell input {
	width: 100%;
	height: 100%;
	font-size: calc(45vmin / var(--size));
	text-align: center;
}

.cell.block {
	background-color: black;
}</style>

<div class="bgblue"></div>