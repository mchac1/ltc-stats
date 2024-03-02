import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from "pinia-plugin-persistedstate"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

const pinia = createPinia();
pinia.use(piniaPluginPersistedState)

createApp(App).use(pinia).mount('#app')