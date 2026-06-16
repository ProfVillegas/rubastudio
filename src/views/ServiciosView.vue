<script setup>
import DashboardLayout from '../layouts/DashboardLayout.vue'
import NavBar from '../components/NavBar.vue'
</script>

<template>
  <DashboardLayout>
    <template #navbar><NavBar /></template>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 class="font-bold text-slate-800 text-lg mb-2">Solicitudes de Reparación</h3>
        <p class="text-xs text-slate-500 mb-4">Reportes generados por los residentes de los departamentos.</p>
        
        <div class="p-4 bg-amber-50/60 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
          <p class="font-bold">⚠️ Fuga de Agua - Torre B Depto 304</p>
          <p class="text-slate-600">Prioridad Alta • Asignado a personal de Plomería.</p>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 class="font-bold text-slate-800 text-lg mb-2">Historial de Trabajos</h3>
        <p class="text-xs text-slate-500 mb-4">Servicios técnicos concluidos con éxito este mes.</p>
        <p class="text-sm text-slate-400 italic">No hay servicios finalizados el día de hoy.</p>
      </div>
    </div>
  </DashboardLayout>
</template>