<script setup>
import DashboardLayout from '../layouts/DashboardLayout.vue'
import NavBar from '../components/NavBar.vue'

const inquilinosMock = [
  { id: 1, nombre: 'Carlos Mendoza', depto: '102-A', estatus: 'Al corriente' },
  { id: 2, nombre: 'Ana María Silva', depto: '304-B', estatus: 'Adeudo Mantenimiento' }
]
</script>

<template>
  <DashboardLayout>
    <template #navbar><NavBar /></template>

    <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-slate-800">Padrón de Inquilinos</h2>
        <span class="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">Total: 2</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-100">
            <tr>
              <th class="p-3">Inquilino</th>
              <th class="p-3">Departamento</th>
              <th class="p-3">Estado de Pago</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="i in inquilinosMock" :key="i.id" class="hover:bg-slate-50/80 transition-colors">
              <td class="p-3 font-medium text-slate-800">{{ i.nombre }}</td>
              <td class="p-3">{{ i.depto }}</td>
              <td class="p-3">
                <span :class="['px-2 py-0.5 rounded text-xs font-semibold', i.estatus === 'Al corriente' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700']">
                  {{ i.estatus }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </DashboardLayout>
</template>