<template>
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
    <nav class="flex flex-wrap items-center gap-1 md:gap-2">
      
      <RouterLink 
        to="/" 
        class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
        exact-active-class="bg-white text-indigo-700 shadow-sm font-semibold"
        inactive-class="text-indigo-100 hover:bg-indigo-700/50 hover:text-white"
      >
        Inicio
      </RouterLink>

      <RouterLink 
        to="/Usuarios" 
        class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
        exact-active-class="bg-white text-indigo-700 shadow-sm font-semibold"
        inactive-class="text-indigo-100 hover:bg-indigo-700/50 hover:text-white"
      >
        Alta de Empleados
      </RouterLink>

      <RouterLink 
        to="/Inquilinos" 
        class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
        exact-active-class="bg-white text-indigo-700 shadow-sm font-semibold"
        inactive-class="text-indigo-100 hover:bg-indigo-700/50 hover:text-white"
      >
        Inquilinos
      </RouterLink>

      <RouterLink 
        to="/Servicios" 
        class="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
        exact-active-class="bg-white text-indigo-700 shadow-sm font-semibold"
        inactive-class="text-indigo-100 hover:bg-indigo-700/50 hover:text-white"
      >
        Mantenimiento
      </RouterLink>

    </nav>

    <div class="relative w-full md:w-64">
      <span class="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300">🔍</span>
      <input 
        type="text" 
        placeholder="Buscar registros..." 
        class="w-full bg-indigo-700/40 border border-indigo-400/30 rounded-lg pl-9 pr-4 py-1.5 text-sm placeholder-indigo-200 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
      />
    </div>
  </div>
</template>