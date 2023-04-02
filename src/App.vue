<template>
  <div class="fixed top-4 left-4 z-50">
    <router-link to="/"
      class="w-8 h-8 rounded-full bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600 flex items-center justify-center transition-colors">
      <svg viewBox="0 0 486.196 486.196" id="homeButton" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="w-5 h-5 fill-slate-500">
        <path d="M481.708,220.456l-228.8-204.6c-0.4-0.4-0.8-0.7-1.3-1c-5-4.8-13-5-18.3-0.3l-228.8,204.6c-5.6,5-6,13.5-1.1,19.1
          		c2.7,3,6.4,4.5,10.1,4.5c3.2,0,6.4-1.1,9-3.4l41.2-36.9v7.2v106.8v124.6c0,18.7,15.2,34,34,34c0.3,0,0.5,0,0.8,0s0.5,0,0.8,0h70.6
          		c17.6,0,31.9-14.3,31.9-31.9v-121.3c0-2.7,2.2-4.9,4.9-4.9h72.9c2.7,0,4.9,2.2,4.9,4.9v121.3c0,17.6,14.3,31.9,31.9,31.9h72.2
          		c19,0,34-18.7,34-42.6v-111.2v-34v-83.5l41.2,36.9c2.6,2.3,5.8,3.4,9,3.4c3.7,0,7.4-1.5,10.1-4.5
          		C487.708,233.956,487.208,225.456,481.708,220.456z M395.508,287.156v34v111.1c0,9.7-4.8,15.6-7,15.6h-72.2c-2.7,0-4.9-2.2-4.9-4.9
          		v-121.1c0-17.6-14.3-31.9-31.9-31.9h-72.9c-17.6,0-31.9,14.3-31.9,31.9v121.3c0,2.7-2.2,4.9-4.9,4.9h-70.6c-0.3,0-0.5,0-0.8,0
          		s-0.5,0-0.8,0c-3.8,0-7-3.1-7-7v-124.7v-106.8v-31.3l151.8-135.6l153.1,136.9L395.508,287.156L395.508,287.156z"
          class="stroke-slate-500" />
      </svg>
    </router-link>
  </div>

  <div class="fixed top-4 right-4 z-50">
    <button type="button" id="themeButton" onclick="handleTheme()"
      class="w-8 h-8 rounded-full bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600 flex items-center justify-center transition-colors">
      <svg viewBox="0 0 24 24" id="themeButton" fill="none" stroke-width="2" stroke-linecap="round"
        stroke-linejoin="round" class="w-6 h-6">
        <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" class="stroke-slate-500"></path>
        <path
          d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836"
          class="stroke-slate-500"></path>
      </svg>
    </button>

    <ul id="themeDropdown"
      class="hidden fixed right-4 top-14 rounded border-2 border-slate-200 bg-slate-100 w-24 min-w-fit z-1 dark:border-slate-800 dark:text-slate-50 dark:bg-slate-900">
      <li>
        <button id="themeLight" type="button" onclick="handleLight()"
          class="text-left hover:bg-slate-300 dark:hover:bg-slate-600 rounded p-1 pl-2 w-full">
          Light</button>
      </li>
      <li>
        <button id="themeDark" type="button" onclick="handleDark()"
          class="text-left hover:bg-slate-300 dark:hover:bg-slate-600 rounded p-1 pl-2 w-full">
          Dark</button>
      </li>
      <li>
        <button id="themeSystem" type="button" onclick="handleSystem()"
          class="text-left hover:bg-slate-300 dark:hover:bg-slate-600 rounded p-1 pl-2 w-full">
          System</button>
      </li>
    </ul>

  </div>
  <router-view />
</template>

<script setup>
import io from 'socket.io-client'
import { onBeforeUnmount } from 'vue';
window.socket = io('http://10.50.42.110:2447')

let params = new URLSearchParams(window.location.search)
let room = params.get('room')
if (room) {
  window.socket.emit('joinroom', room)
}

onBeforeUnmount(() => {
  window.socket.disconnect()
})
</script>
