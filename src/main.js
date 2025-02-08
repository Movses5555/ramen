import { createApp } from 'vue'
import App from './App.vue'

window.Telegram?.WebApp.setHeaderColor('#F9F7F0')

const app = createApp(App)

app.config.globalProperties.$log = (...args) => {
  console.log(...args)
}

app.mount('#app')
