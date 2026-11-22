import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

// 引入 Vant 组件库全局样式
import 'vant/lib/index.css'

const app = createApp(App)
app.mount('#app')