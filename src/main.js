import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import HomeView from './views/HomeView.vue'
import UsuarioView from './views/UsuarioView.vue'
import InquilinoView from './views/InquilinoView.vue'
import ServiciosView from './views/ServiciosView.vue'
import SucursalView from './views/SucursalView.vue'
import './assets/main.css'

const router = createRouter({
    history:createWebHistory(),
    routes:[
        {path:'/',component:HomeView},
        {path:'/Usuarios', component:UsuarioView},
        {path:'/Inquilinos', component:InquilinoView},
        {path:'/Servicios', component:ServiciosView},
        {path:'/Sucursales', component:SucursalView},

    ]

})

//createApp(App).mount('#app')
const app = createApp(App);
app.use(router);
app.mount("#app");