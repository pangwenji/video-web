import './assets/main.css'

import { createApp } from 'vue'
// import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import store from './store'
import directives from './directives'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import i18n from './locale'
import Vue3Marquee from 'vue3-marquee'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
  .use(store)
  .use(directives)
  .use(ElementPlus)
  .use(i18n)
  .use(Vue3Marquee)

app.mount('#app')
