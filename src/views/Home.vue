<template>
	<div class="bg">
		<h1 class="font-bold py-10 text-center text-7xl">WePuzzle</h1>
		<p class="text-center">Play crosswords online with your friends!</p>
		<div class ="flex justify-center py-5">
			<img src="/GeneralCrossword.png" alt="GeneralArt" class="art"/>
		</div>
		<div class="flex justify-center py-5">
			<router-link to="/create" class="bg-slate-700 hover:bg-slate-500 text-slate-50 font-bold py-2 px-4 mx-5 rounded" >
				Create a room
			</router-link>

			<router-link to="/join" class="bg-slate-700 hover:bg-slate-500 text-slate-50 font-bold py-2 px-4 mx-5 rounded" >
				Join a room
			</router-link>
		</div>
	</div>
</template>

<style scoped>
.bg {
	height: 100%;
}

.art {
	width: 400px;
	height: 400px;
}

/* mobile */
@media (max-width: 640px) {
	.art {
		width: 300px;
		height: 300px;
	}
}

/* horizontal devices */
@media (max-width: 1024px) {
	.art {
		display: none;
	}
}
</style>