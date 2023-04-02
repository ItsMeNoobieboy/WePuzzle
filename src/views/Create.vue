<template>
	<div class="gamemodes">
		<div>
			<h1>"Beans, Beans, Beans!!!"</h1>
			<img src="/NormalCrossword.png" alt="Crossword" />
			<button @click="create('crossword')"
			class="bg-slate-700 hover:bg-slate-500 text-slate-50 font-bold py-2 px-4 mx-5 rounded mt-3">Create Room Now</button>
		</div>
		<div>
			<h1>"It's Programmin' Time!"</h1>
			<img src="/MiniCrossword.png" alt="Crossword" />
			<button @click="create('crossword', 'mini')"
			class="bg-slate-700 hover:bg-slate-500 text-slate-50 font-bold py-2 px-4 mx-5 rounded mt-3">Create Room Now</button>
		</div>
	</div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
	name: 'Join',
	setup() {
		const router = useRouter()
		window.socket.on('room', (room) => {
			router.push({ path: `/${room.type}`, query: { room: room.id }})
		})

		const create = (game, args) => {
			window.socket.emit('create', {game, args})
		}
		return { create }
	}
}
</script>

<style scoped>
.gamemodes {
	display: flex;
	justify-content: center;
	align-items: center;
}

.gamemodes h1 {
	text-align: center;
	font-weight: bold;
	font-size: 2rem;
}

.gamemodes > div {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin: 1rem;
	border: 3px solid black;
	padding: 1rem;
	border-radius: 3rem;
}

.gamemodes img {
	width: 300px;
	height: 300px;
}
</style>