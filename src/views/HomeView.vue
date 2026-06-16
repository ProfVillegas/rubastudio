<script setup>
import DashboardLayout from '../layouts/DashboardLayout.vue'
import NavBar from '../components/NavBar.vue'
</script>

<template>
  <DashboardLayout>
    <template #navbar><NavBar /></template>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm min-h-[300px]">
        <h2 class="text-xl font-bold text-slate-800 mb-4">Dashboard de Control de Rentas</h2>
        <p class="text-slate-600 text-sm mb-4">Selecciona un módulo en la barra de navegación superior para comenzar a administrar los registros de la propiedad.</p>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div class="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
            <h3 class="text-sm font-semibold text-indigo-900">Total Recaudado</h3>
            <p class="text-2xl font-black text-indigo-600 mt-1">$142,500 MXN</p>
          </div>
          <div class="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
            <h3 class="text-sm font-semibold text-emerald-900">Ocupación Actual</h3>
            <p class="text-2xl font-black text-emerald-600 mt-1">92%</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hidden lg:block">
        <h3 class="text-md font-bold text-slate-800 mb-2">Estatus General</h3>
        <p class="text-xs text-slate-500">Módulo de monitoreo en tiempo real.</p>
      </div>
    </div>
  </DashboardLayout>
</template>