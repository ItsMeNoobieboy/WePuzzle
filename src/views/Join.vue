<template>
	<div class="join">
		<h1 class="text-2xl m-10">Enter room code below</h1>
		<div class="input">
			<input @keydown="submit"/>
			<button @click="join" class="bg-slate-700 hover:bg-slate-500 text-slate-50 font-bold py-2 px-4 mx-5 rounded">Join</button>
		</div>
		<h1 class="text-2xl m-10">Don't have a code? Go to the "Create Room" page instead</h1>

	</div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
	name: 'Join',
	setup() {
		function join() {
			window.socket.emit('joinroom', document.querySelector('input').value)
			// clear the input
			document.querySelector('input').value = ''
		}

		function submit(e) {
			if (e.key === 'Enter') {
				join()
			}
		}

		window.socket.on('error', (error) => {
			alert(error)
		})

		const router = useRouter()
		window.socket.on('room', (room) => {
			console.log(room)
			router.push({ path: `/${room.type}`, query: { room: room.id }})
		})

		return { join, submit }
	}
}
</script>

<style scoped>
.join {
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 75%;
}

.join input {
	width: 300px;
	height: 50px;
	font-size: 20px;
	border-radius: 1.5rem;
	color: black !important;
	padding: 1rem;
}
</style>