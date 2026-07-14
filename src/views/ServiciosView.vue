<template>
  <DashboardLayout>
    <template #navbar>
      <NavBar />
    </template>
    <div class="bg-white rounded-2xl shadow-sm p-6">

      <!-- ── Encabezado ──────────────────────────────────────────── -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-slate-800">Tipos de servicios</h2>
          <p class="text-sm text-slate-400 mt-0.5">
            {{ store.totaltiposervicios }} registro{{ store.totaltiposervicios !== 1 ? 's' : '' }} guardado{{
              store.totaltiposervicios !== 1 ? 's' : '' }}
          </p>
        </div>
        <button @click="store.iniciarCrear(); mostrarForm = true"
          class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nuevo Servicio
        </button>
      </div>

      <!-- ── Toast éxito ─────────────────────────────────────────── -->
      <transition name="fade">
        <div v-if="store.exito"
          class="flex items-center gap-2 mb-4 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {{ store.exito }}
        </div>
      </transition>

      <!-- ── Error global ────────────────────────────────────────── -->
      <div v-if="store.error && !mostrarForm"
        class="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
        {{ store.error }}
      </div>

      <!-- ── Layout principal ────────────────────────────────────── -->
      <div class="flex flex-col xl:flex-row gap-6">

        <!-- ── Tabla ─────────────────────────────────────────────── -->
        <div class="flex-1 min-w-0">

          <div v-if="store.cargando" class="flex flex-col gap-3">
            <div v-for="i in 3" :key="i" class="h-14 rounded-xl bg-slate-100 animate-pulse"></div>
          </div>

          <div v-else-if="store.lista.length === 0"
            class="flex flex-col items-center justify-center py-16 text-slate-400 text-sm gap-2">
            <svg vwidth="36" height="36" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.2"
              stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
              fill="#000000">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <g id="layer1">
                  <path
                    d="M 18 0 C 18 0 16.323261 -0.03029237 15.146484 1.1464844 L 11.646484 4.6464844 C 11.087559 5.2054099 10.796472 5.7785513 10.650391 6.2167969 C 10.582611 6.4201304 10.600608 6.4420659 10.580078 6.5800781 C 10.442066 6.6006091 10.42013 6.5826086 10.216797 6.6503906 C 9.7785481 6.796473 9.2054099 7.0875588 8.6464844 7.6464844 L 7.6464844 8.6464844 A 0.50005 0.50005 0 0 0 7.6464844 9.3535156 L 8.1914062 9.8984375 L 3.0078125 15.083984 L 1.5878906 15.746094 A 0.50005 0.50005 0 0 0 1.3730469 15.939453 L 0.171875 17.908203 A 0.50005 0.50005 0 0 0 0.05859375 18.123047 A 0.50005 0.50005 0 0 0 0.05859375 18.125 A 0.50005 0.50005 0 0 0 0.05078125 18.158203 A 0.50005 0.50005 0 0 0 0.296875 18.705078 L 1.2910156 19.697266 A 0.50005 0.50005 0 0 0 1.828125 19.951172 A 0.50005 0.50005 0 0 0 2.0878906 19.830078 L 4.0605469 18.626953 A 0.50005 0.50005 0 0 0 4.2539062 18.412109 L 4.9160156 16.992188 L 10.099609 11.806641 L 10.646484 12.353516 A 0.50005 0.50005 0 0 0 11.353516 12.353516 L 12.353516 11.353516 C 12.912441 10.79459 13.203528 10.221449 13.349609 9.7832031 C 13.417389 9.5798696 13.399392 9.5579341 13.419922 9.4199219 C 13.557934 9.3993909 13.57987 9.4173914 13.783203 9.3496094 C 14.221449 9.2035275 14.79459 8.9124412 15.353516 8.3535156 L 18.853516 4.8535156 C 20.030295 3.6767384 20 2 20 2 A 0.50005 0.50005 0 0 0 19.853516 1.6464844 L 19.103516 0.89648438 L 18.353516 0.14648438 A 0.50005 0.50005 0 0 0 18 0 z M 17.820312 1.0273438 L 18.396484 1.6035156 L 18.972656 2.1796875 C 18.957046 2.4321014 18.872876 3.4200923 18.146484 4.1464844 L 14.646484 7.6464844 C 14.20541 8.0875588 13.778551 8.2964725 13.466797 8.4003906 C 13.155042 8.5043088 13 8.5 13 8.5 A 0.50005 0.50005 0 0 0 12.5 9 C 12.5 9 12.504301 9.1550424 12.400391 9.4667969 C 12.296472 9.7785513 12.087559 10.20541 11.646484 10.646484 L 11 11.292969 L 9.8535156 10.146484 L 8.7070312 9 L 9.3535156 8.3535156 C 9.7945901 7.9124412 10.221449 7.7035275 10.533203 7.5996094 C 10.844958 7.4956912 11 7.5 11 7.5 A 0.50005 0.50005 0 0 0 11.5 7 C 11.5 7 11.495699 6.8449576 11.599609 6.5332031 C 11.703528 6.2214487 11.912441 5.7945901 12.353516 5.3535156 L 15.853516 1.8535156 C 16.579908 1.1271236 17.567901 1.042949 17.820312 1.0273438 z M 8.8984375 10.605469 L 9.1464844 10.853516 L 9.3925781 11.099609 L 4.1464844 16.345703 A 0.50005 0.50005 0 0 0 4.046875 16.488281 L 3.4101562 17.851562 L 1.8261719 18.818359 L 1.1816406 18.173828 L 2.1484375 16.589844 L 3.5117188 15.953125 A 0.50005 0.50005 0 0 0 3.6523438 15.853516 L 8.8984375 10.605469 z "
                    style="fill:#222222; fill-opacity:1; stroke:none; stroke-width:0px;"></path>
                </g>
              </g>
            </svg>
            <span>Sin tipos de servicios registrados</span>
          </div>
          <!--
id, nombre, categoria,    // "amenidad" | "cuota" | "mantenimiento" | "reparacion"
  descripcion,
  precioBase,               // MXN, fijo por tipo
  unidad,                   // "evento" | "mensual" | "hora" | "m2"
  activo,                   // false = no aparece en el selector de solicitudes
  requiereProgramacion,     // si true, el form de solicitud muestra fecha/hora
  duracionEstimadaMin,
  stripe: {                 // preparado para integración futura
    productId: null,
    priceId:   null,
  },
  creadoEn, actualizadoEn
}
          
-->
          <div v-else class="overflow-x-auto rounded-xl border border-slate-100">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                  <th class="text-left px-4 py-3 font-medium">Servicio</th>
                  <th class="text-left px-4 py-3 font-medium">Categoría</th>
                  <th class="text-left px-4 py-3 font-medium">Precio</th>
                  <th class="text-left px-4 py-3 font-medium">Unidad</th>
                  <th class="text-left px-4 py-3 font-medium">Estado</th>
                  <th class="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="t in store.lista" :key="t.id" class="hover:bg-slate-50 transition-colors">
                  <td class="px-4 py-3">
                    <p class="font-medium text-slate-800">{{ t.nombre }}</p>
                    <p class="text-xs text-slate-400 mt-0.5 max-w-xs truncate">{{ t.descripcion }}</p>
                  </td>
                  <td class="px-4 py-3">
                    <span class="px-2.5 py-1 rounded-full text-xs font-medium" :class="categoriaClase(t.categoria)">
                      {{ categoriaEtiqueta(t.categoria) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">
                    ${{ t.precioBase.toLocaleString('es-MX') }} MXN
                  </td>
                  <td class="px-4 py-3 text-slate-500 whitespace-nowrap">{{ t.unidad }}</td>
                  <td class="px-4 py-3">
                    <span class="px-2.5 py-1 rounded-full text-xs font-medium"
                      :class="t.activo ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'">
                      {{ t.activo ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="flex items-center gap-2 justify-end">
                      <button @click="editar(t.id)"
                        class="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Editar">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button @click="confirmarEliminar(t)"
                        class="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Eliminar">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ── Formulario CRUD ──────────────────────────────────── -->
        <transition name="slide">
          <div v-if="mostrarForm"
            class="w-full xl:w-[500px] shrink-0 border border-slate-200 rounded-2xl overflow-hidden flex flex-col">

            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 class="text-sm font-semibold text-slate-700">
                {{ store.modoEdicion ? 'Editar ubicación' : 'Nueva ubicación' }}
              </h3>
              <button @click="cerrarForm"
                class="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                aria-label="Cerrar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div class="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">

              <div v-if="store.error" class="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
                {{ store.error }}
              </div>

              <CampoInput v-model="store.form.nombre" label="Nombre del servicio" placeholder="Ej. Uso de alberca" />

              <CampoSelect v-model="store.form.categoria" label="Categoría">
                <option value="cuota">Cuota</option>
                <option value="amenidad">Amenidad</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="reparacion">Reparación</option>
              </CampoSelect>

              <div class="flex flex-col gap-1">
                <label class="text-xs font-medium text-slate-500 uppercase tracking-wide">Descripción</label>
                <textarea v-model="store.form.descripcion" rows="2" placeholder="Detalle del servicio…"
                  class="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"></textarea>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <CampoInput v-model.number="store.form.precioBase" label="Precio base (MXN)" type="number"
                  placeholder="500" />
                <CampoSelect v-model="store.form.unidad" label="Unidad">
                  <option value="evento">Por evento</option>
                  <option value="mensual">Mensual</option>
                  <option value="hora">Por hora</option>
                  <option value="m2">Por m²</option>
                </CampoSelect>
              </div>

              <CampoInput v-model.number="store.form.duracionEstimadaMin" label="Duración estimada (min)" type="number"
                placeholder="60" />

              <div class="flex flex-col gap-3 pt-2">
                <label class="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
                  <input type="checkbox" v-model="store.form.requiereProgramacion"
                    class="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400" />
                  Requiere programación (fecha/hora)
                </label>
                <div v-if="store.form.requiereProgramacion" class="flex flex-col gap-3 pt-2">
                  <CampoInput v-model="store.form.fecha" label="Fecha" type="date"
                  placeholder="12/05/2026" />
                  <CampoInput v-model="store.form.hora" label="Hora" type="time"
                  placeholder="6:30 pm" />

                </div>
              </div>
              <div class="flex flex-col gap-3 pt-2">
                <label class="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
                  <input type="checkbox" v-model="store.form.activo"
                    class="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400" />
                  Servicio activo (disponible para nuevas solicitudes)
                </label>
              </div>



            </div>

            <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
              <button @click="cerrarForm"
                class="px-5 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-100 transition-colors">
                Cancelar
              </button>
              <button @click="store.guardar()" :disabled="store.guardando"
                class="px-6 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 transition-colors flex items-center gap-2">
                <div v-if="store.guardando"
                  class="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin"></div>
                {{ store.guardando ? 'Guardando…' : store.modoEdicion ? 'Actualizar' : 'Guardar' }}
              </button>
            </div>

          </div>
        </transition>
      </div>

      <!-- ── Modal confirmación eliminar ────────────────────────── -->
      <div v-if="itemAEliminar" class="fixed inset-0 z-50 flex items-center justify-center p-4"
        style="background:rgba(0,0,0,0.35)" @click.self="itemAEliminar = null">
        <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
          <h4 class="text-base font-semibold text-slate-800 mb-2">¿Eliminar ubicación?</h4>
          <p class="text-sm text-slate-500 mb-6">
            Se eliminará <strong class="text-slate-700">{{ itemAEliminar.nombre }}</strong> de forma permanente.
          </p>
          <div class="flex justify-end gap-3">
            <button @click="itemAEliminar = null"
              class="px-5 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-100 transition-colors">
              Cancelar
            </button>
            <button @click="ejecutarEliminar" :disabled="store.eliminando"
              class="px-5 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-60 transition-colors flex items-center gap-2">
              <div v-if="store.eliminando"
                class="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin"></div>
              {{ store.eliminando ? 'Eliminando…' : 'Sí, eliminar' }}
            </button>
          </div>
        </div>
      </div>

    </div>
  </DashboardLayout>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { usetiposervicioStore } from '@/stores/tiposervicioStore'
/**DashBoard y Menu */
import CampoInput from '@/components/CampoInput.vue'
import CampoSelect from '@/components/CampoSelect.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import NavBar from '../components/NavBar.vue'

const store = usetiposervicioStore()
const mostrarForm = ref(false)
const itemAEliminar = ref(null)

onMounted(() => store.cargarLista())

async function editar(id) {
  await store.iniciarEditar(id)
  mostrarForm.value = true
}

function cerrarForm() {
  mostrarForm.value = false
  store.iniciarCrear()
}

function confirmarEliminar(item) { itemAEliminar.value = item }

async function ejecutarEliminar() {
  await store.eliminar(itemAEliminar.value.id)
  itemAEliminar.value = null
}
// Ejecutar Guardar
async function ejecutarGuardar() {
  // Guardamos y esperamos el booleano
  const exito = await store.guardar()

  // Si la respuesta en Firestore fue exitosa, cerramos el formulario de la UI
  if (exito) {
    mostrarForm.value = false
  }
}

const data_categoria = {
  cuota: { etiqueta: 'Cuota', clase: 'bg-purple-50 text-purple-700' },
  amenidad: { etiqueta: 'Amenidad', clase: 'bg-blue-50 text-blue-700' },
  mantenimiento: { etiqueta: 'Mantenimiento', clase: 'bg-teal-50 text-teal-700' },
  reparacion: { etiqueta: 'Reparación', clase: 'bg-amber-50 text-amber-700' },
}
function categoriaEtiqueta(c) { return data_categoria[c]?.etiqueta ?? c }
function categoriaClase(c) { return data_categoria[c]?.clase ?? 'bg-slate-100 text-slate-600' }
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(16px);
}
</style>
