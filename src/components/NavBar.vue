<template>
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
    <!-- Header para Móvil (Botón Hamburguesa) y Vista de Escritorio -->
    <div class="flex items-center justify-between w-full md:w-auto">
      <!-- Botón Hamburguesa (Solo visible en móvil) -->
      <button 
        @click="isOpen = true" 
        class="md:hidden p-2 rounded-lg text-indigo-100 hover:bg-indigo-700/50 focus:outline-none"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- Menú de Escritorio (Oculto en móvil) -->
    <nav class="hidden md:flex flex-wrap items-center gap-1 md:gap-2">
      <RouterLink 
        v-for="link in links" 
        :key="link.to"
        :to="link.to" 
        class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
        exact-active-class="bg-white text-indigo-700 shadow-sm font-semibold"
        inactive-class="text-indigo-100 hover:bg-indigo-700/50 hover:text-white"
      >
        {{ link.text }}
      </RouterLink>
    </nav>

    <!-- Buscador (Visible siempre, se adapta al ancho) -->
    <div class="relative w-full md:w-64">
      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300">🔍</span>
      <input 
        type="text" 
        placeholder="Buscar registros..." 
        class="w-full bg-indigo-700/40 border border-indigo-400/30 rounded-lg pl-9 pr-4 py-1.5 text-sm placeholder-indigo-200 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
      />
    </div>

    <!-- Menú Lateral Móvil (Off-Canvas) -->
    <div 
      class="fixed inset-0 z-50 md:hidden transition-all duration-300"
      :class="isOpen ? 'visible' : 'invisible'"
    >
      <!-- Fondo oscuro (Backdrop) -->
      <div 
        @click="isOpen = false"
        class="absolute inset-0 bg-black/50 transition-opacity duration-300"
        :class="isOpen ? 'opacity-100' : 'opacity-0'"
      ></div>

      <!-- Panel Deslizable (Izquierda) -->
      <div 
        class="absolute top-0 left-0 h-full w-64 bg-indigo-900 shadow-xl transform transition-transform duration-300 flex flex-col p-6 border-r border-indigo-700/50"
        :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <!-- Encabezado del Menú Móvil -->
        <div class="flex justify-between items-center mb-6">
          <span class="font-bold text-white text-lg">Menú</span>
          <button @click="isOpen = false" class="text-indigo-200 hover:text-white focus:outline-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Enlaces del Menú Móvil -->
        <nav class="flex flex-col space-y-2">
          <RouterLink 
            v-for="link in links" 
            :key="link.to"
            :to="link.to" 
            @click="isOpen = false"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 block"
            exact-active-class="bg-white text-indigo-700 shadow-sm font-semibold"
            inactive-class="text-indigo-100 hover:bg-indigo-700/50 hover:text-white"
          >
            {{ link.text }}
          </RouterLink>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref , computed} from 'vue'
import { useRouter } from 'vue-router'

const isOpen = ref(false)
const router = useRouter()

// Filtramos y mapeamos las rutas dinámicamente
const links = computed(() => {
  return router.getRoutes()
    .filter(route => route.meta && route.meta.title) // Solo rutas con título definido
    .map(route => ({
      to: route.path,
      text: route.meta.title
    }))
})
</script>
