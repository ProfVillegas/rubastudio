<template>
  <DashboardLayout>
    <template #navbar><NavBar /></template>
  <div class="bg-white rounded-2xl shadow-sm p-6">

    <!-- ── Encabezado ──────────────────────────────────────────── -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-slate-800">Ubicaciones</h2>
        <p class="text-sm text-slate-400 mt-0.5">
          {{ store.totalUbicaciones }} registro{{ store.totalUbicaciones !== 1 ? 's' : '' }} guardado{{ store.totalUbicaciones !== 1 ? 's' : '' }}
        </p>
      </div>
      <button
        @click="store.iniciarCrear(); mostrarForm = true"
        class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Nueva ubicación
      </button>
    </div>

    <!-- ── Toast éxito ─────────────────────────────────────────── -->
    <transition name="fade">
      <div v-if="store.exito"
        class="flex items-center gap-2 mb-4 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
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
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>Sin ubicaciones registradas</span>
        </div>

        <div v-else class="overflow-x-auto rounded-xl border border-slate-100">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <th class="text-left px-4 py-3 font-medium">Nombre</th>
                <th class="text-left px-4 py-3 font-medium">Dirección</th>
                <th class="text-left px-4 py-3 font-medium">Ciudad</th>
                <th class="text-left px-4 py-3 font-medium">Teléfono</th>
                <th class="text-left px-4 py-3 font-medium">Coords</th>
                <th class="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="u in store.lista" :key="u.id"
                class="hover:bg-slate-50 transition-colors"
                :class="store.seleccionada === u.id ? 'bg-indigo-50' : ''">
                <td class="px-4 py-3 font-medium text-slate-800 whitespace-nowrap">{{ u.nombre }}</td>
                <td class="px-4 py-3 text-slate-500 whitespace-nowrap">{{ u.calle }} {{ u.numero }}, {{ u.colonia }}</td>
                <td class="px-4 py-3 text-slate-500 whitespace-nowrap">{{ u.ciudad }}, {{ u.estado }}</td>
                <td class="px-4 py-3 text-slate-500 whitespace-nowrap">{{ u.telefono }}</td>
                <td class="px-4 py-3 text-slate-400 text-xs whitespace-nowrap font-mono">
                  <span v-if="u.latitud">{{ u.latitud.toFixed(4) }}, {{ u.longitud.toFixed(4) }}</span>
                  <span v-else class="italic">sin coords</span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="flex items-center gap-2 justify-end">
                    <button @click="editar(u.id)"
                      class="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" title="Editar">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button @click="confirmarEliminar(u)" :disabled="store.eliminando"
                      class="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Eliminar">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
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

          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h3 class="text-sm font-semibold text-slate-700">
              {{ store.modoEdicion ? 'Editar ubicación' : 'Nueva ubicación' }}
            </h3>
            <button @click="cerrarForm"
              class="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors" aria-label="Cerrar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <!-- Body scrollable -->
          <div class="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

            <div v-if="store.error"
              class="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
              {{ store.error }}
            </div>

            <!-- Identificación -->
            <fieldset>
              <legend class="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-3">Identificación</legend>
              <CampoInput v-model="store.form.nombre" label="Nombre de la ubicación" placeholder="Ej. Sede Central" />
            </fieldset>

            <!-- Dirección -->
            <fieldset>
              <legend class="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-3">Dirección</legend>
              <div class="grid grid-cols-2 gap-3">
                <CampoInput v-model="store.form.calle"      label="Calle"      placeholder="Av. Insurgentes Sur" class-extra="col-span-2" />
                <CampoInput v-model="store.form.numero"     label="Número"     placeholder="1234" />
                <CampoInput v-model="store.form.colonia"    label="Colonia"    placeholder="Del Valle" />
                <CampoInput v-model="store.form.ciudad"     label="Ciudad"     placeholder="Ciudad de México" />
                <CampoInput v-model="store.form.estado"     label="Estado"     placeholder="CDMX" />
                <CampoInput v-model="store.form.cp"         label="C.P."       placeholder="03100" />
                <CampoInput v-model="store.form.referencia" label="Referencia" placeholder="Frente al parque" class-extra="col-span-2" />
              </div>
            </fieldset>

            <!-- Contacto -->
            <fieldset>
              <legend class="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-3">Contacto</legend>
              <div class="grid grid-cols-2 gap-3">
                <CampoInput v-model="store.form.telefono" label="Teléfono" placeholder="55 5678 9012" type="tel" />
                <CampoInput v-model="store.form.celular"  label="Celular"  placeholder="55 1234 5678" type="tel" />
                <CampoInput v-model="store.form.correo"   label="Correo"   placeholder="contacto@ejemplo.mx" type="email" class-extra="col-span-2" />
              </div>
            </fieldset>

            <!-- Coordenadas -->
            <fieldset>
              <legend class="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-3">Coordenadas y mapa</legend>

              <!-- GPS -->
              <button type="button" @click="store.usarMiUbicacion()" :disabled="store.geocodificando"
                class="w-full mb-3 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-indigo-300 text-sm text-indigo-600 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                <svg v-if="!store.geocodificando" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></svg>
                <div v-else class="w-4 h-4 rounded-full border-2 border-indigo-300 border-t-indigo-600 animate-spin"></div>
                {{ store.geocodificando ? 'Obteniendo ubicación…' : 'Usar mi ubicación actual' }}
              </button>

              <!-- Lat / Lng manuales -->
              <div class="grid grid-cols-2 gap-3 mb-3">
                <CampoInput
                  v-model.number="store.form.latitud"
                  label="Latitud"
                  placeholder="19.3730"
                  type="number"
                  step="0.0000001"
                  @change="onCoordsManual"
                />
                <CampoInput
                  v-model.number="store.form.longitud"
                  label="Longitud"
                  placeholder="-99.1728"
                  type="number"
                  step="0.0000001"
                  @change="onCoordsManual"
                />
              </div>

              <!-- Google Maps interactivo -->
              <div class="rounded-xl overflow-hidden border border-slate-200" style="height: 280px">
                <MapaGMaps
                  :posicion="store.posicionMapa"
                  :popup-texto="store.form.nombre || 'Ubicación'"
                  :zoom="15"
                  :interactivo="true"
                  @coordenadas-seleccionadas="onMapaClick"
                />
              </div>
              <p class="text-xs text-slate-400 mt-2 text-center">
                Busca una dirección, haz clic o arrastra el marcador para ajustar
              </p>
            </fieldset>

          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50">
            <button type="button" @click="cerrarForm"
              class="px-5 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-100 transition-colors">
              Cancelar
            </button>
            <button type="button" @click="store.guardar()" :disabled="store.guardando"
              class="px-6 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
              <div v-if="store.guardando" class="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin"></div>
              {{ store.guardando ? 'Guardando…' : store.modoEdicion ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>

        </div>
      </transition>
    </div>

    <!-- ── Modal confirmación eliminar ────────────────────────── -->
    <div v-if="itemAEliminar"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background:rgba(0,0,0,0.35)"
      @click.self="itemAEliminar = null">
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
            <div v-if="store.eliminando" class="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin"></div>
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
import { useUbicacionStore } from '@/stores/ubicacionStore'
import MapaGMaps  from '@/components/MapaGMaps.vue'
import CampoInput from '@/components/CampoInput.vue'
/**DashBoard y Menu */
import DashboardLayout from '../layouts/DashboardLayout.vue'
import NavBar from '../components/NavBar.vue'

const store         = useUbicacionStore()
const mostrarForm   = ref(false)
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

// El mapa emite coords → el store actualiza y geocodifica
async function onMapaClick({ lat, lng }) {
  store.actualizarCoordenadas(lat, lng)
  await store.autocompletarDesdeCoordenadas(lat, lng)
}

// Coords escritas a mano → autocompletar dirección
function onCoordsManual() {
  const { latitud, longitud } = store.form
  if (latitud && longitud) {
    store.autocompletarDesdeCoordenadas(latitud, longitud)
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: all 0.25s ease; }
.slide-enter-from, .slide-leave-to       { opacity: 0; transform: translateX(16px); }
</style>
