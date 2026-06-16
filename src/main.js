import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import HomeView from './views/HomeView.vue'
import UsuarioView from './views/UsuarioView.vue'
import './assets/main.css'

const router = createRouter({
    history:createWebHistory(),
    routes:[
        {path:'/',component:HomeView},
        {path:'/Usuarios', component:UsuarioView}
    ]

})

//createApp(App).mount('#app')
const app = createApp(App);
app.use(router);
app.mount("#app");