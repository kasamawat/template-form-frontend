import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import './assets/main.css'
import Notifications from "@kyvg/vue3-notification";

const app = createApp(App);

app.use(Notifications);

app.mount('#app')