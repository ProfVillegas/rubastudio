<template>
  <div class="min-h-screen bg-slate-100 flex flex-col antialiased font-sans">
    
    <header class="bg-indigo-600 text-white pb-28 pt-4 px-6 shadow-inner">
      <div class="max-w-7xl mx-auto flex flex-col gap-4">
        
        <div class="flex justify-between items-center border-b border-indigo-500/40 pb-3">
          <div class="flex items-center gap-2">
            <span class="text-2xl font-bold tracking-wider"> 👰🏼 Ruba Studio</span>
          </div>
          <div class="flex items-center gap-4">
            <button class="hover:bg-indigo-700 p-2 rounded-full transition-colors relative">
              💡 <span class="absolute top-1 right-1 bg-red-500 w-2 h-2 rounded-full"></span>
            </button>
            <div class="flex items-center gap-2">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                   alt="Avatar" class="w-8 h-8 rounded-full border-2 border-indigo-400">
            </div>
          </div>
        </div>

        <slot name="navbar" />

      </div>
    </header>

    <main class="max-w-7xl w-full mx-auto px-6 flex-1 -mt-16 mb-12 z-10">
      <slot />
    </main>

    <footer class="bg-white border-t border-slate-200 py-4 text-center text-sm text-slate-500">
      <p>&copy; 2026 DepaRent, Inc. Todos los derechos reservados.</p>
    </footer>

  </div>
</template>