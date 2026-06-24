<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
    <!-- Ilustración / Icono animado -->
    <div class="relative mb-6">
      <h1 class="text-9xl font-black text-indigo-500/20 select-none animate-pulse">
        404
      </h1>
      <span class="absolute inset-0 flex items-center justify-center text-6xl">
        🔍
      </span>
    </div>

    <!-- Mensaje de Error -->
    <h2 class="text-2xl md:text-3xl font-bold text-white mb-2">
      Página no encontrada
    </h2>
    <p class="text-indigo-200 max-w-md mb-8 text-sm md:text-base">
      Lo sentimos, la ruta que estás intentando buscar no existe o ha sido movida a otra ubicación.
    </p>

    <!-- Botón de regreso -->
    <RouterLink
      to="/"
      class="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 font-semibold rounded-xl shadow-md hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all duration-200 text-sm md:text-base"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Regresar al Inicio
    </RouterLink>
  </div>
</template>