import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'

const router = createRouter({
	history: createWebHistory(),
	routes: [
		{ path: '/', component: () => import('./views/Home.vue') },
		{ path: '/crossword', component: () => import('./views/Crossword.vue') },
		{ path: '/create', component: () => import('./views/Create.vue') },
		{ path: '/join', component: () => import('./views/Join.vue')}
	]
})

createApp(App)
.use(router)
.mount('#app')