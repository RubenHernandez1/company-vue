import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import { createPersistedState } from 'pinia-plugin-persistedstate'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'
import { markRaw } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import App from './App.vue'
import router from './router'
import axios from 'axios'

window.axios = axios
// window.axios.defaults.baseURL = 'http://localhost/company/public'
window.axios.defaults.baseURL = 'http://company.test'
window.axios.defaults.headers.common['Accept'] = 'application/json'
window.axios.defaults.headers.common['Content-Type'] = 'application/json'
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
window.axios.defaults.withCredentials = true

const pinia = createPinia()
pinia.use(({store}) => {
    store.router = markRaw(router)
})
// pinia.use(createPersistedState)
pinia.use(piniaPluginPersistedState)



const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
