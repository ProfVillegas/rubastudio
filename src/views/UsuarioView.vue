<script setup>
import { ref } from 'vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import NavBar from '../components/NavBar.vue'

const cargando = ref(false)
const simularAlta = () => {
  cargando.value = true
  setTimeout(() => { cargando.value = false; alert('Empleado registrado con éxito (Simulación)') }, 600)
}
</script>

<template>
  <DashboardLayout>
    <template #navbar><NavBar /></template>

    <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-3xl mx-auto">
      <h2 class="text-xl font-bold text-slate-800 mb-2">Alta de Empleados / Personal</h2>
      <p class="text-xs text-slate-500 mb-6">Ingresa las credenciales del nuevo operador del sistema de rentas.</p>

      <form @submit.prevent="simularAlta" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Nombre Completo</label>
            <input type="text" required class="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-indigo-600" placeholder="Ej. Juan Pérez">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Puesto / Rol</label>
            <select class="w-full border border-slate-200 rounded-lg p-2 text-sm focus:outline-indigo-600">
              <option>Administrador</option>
              <option>Mantenimiento Técnico</option>
              <option>Recepcionista</option>
            </select>
          </div>
        </div>
        <button type="submit" :disabled="cargando" class="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow transition-all active:scale-95 disabled:opacity-50">
          {{ cargando ? 'Guardando...' : 'Registrar Empleado' }}
        </button>
      </form>
    </div>
  </DashboardLayout>
</template>