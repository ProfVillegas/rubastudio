<template>
  <DashboardLayout>
    <template #navbar><NavBar /></template>

  <div class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

    <!-- Header -->
    <div class="bg-[#1a1a2e] px-8 py-6">
      <h1 class="text-2xl font-bold text-white">Mi Ubicación</h1>
      <p class="text-sm text-slate-400 mt-1">Mostrando tu posición actual en el mapa</p>
    </div>

    <!-- Barra de estado -->
    <div class="flex items-center gap-3 px-8 py-3 bg-white border-b border-slate-200 text-sm">

      <template v-if="status === 'cargando'">
        <div class="w-4 h-4 rounded-full border-2 border-slate-200 border-t-indigo-500 animate-spin"></div>
        <span class="text-slate-500">Obteniendo tu ubicación…</span>
      </template>

      <template v-else-if="status === 'error'">
        <span class="text-red-500 font-medium">⚠ {{ geoError }}</span>
      </template>

      <template v-else-if="status === 'ok'">
        <span class="inline-block w-2 h-2 rounded-full bg-green-400"></span>
        <span class="text-slate-600">
          Lat: <strong class="text-slate-800">{{ coords.lat.toFixed(6) }}</strong>
          &nbsp;·&nbsp;
          Lng: <strong class="text-slate-800">{{ coords.lng.toFixed(6) }}</strong>
        </span>
        <button
          @click="centrarEnMiUbicacion"
          class="ml-auto text-xs font-semibold text-indigo-500 hover:text-indigo-700 transition-colors"
        >
          Centrar mapa →
        </button>
      </template>

    </div>

    <!-- Mapa -->
    <div class="relative flex-1">
      <div
        v-if="cargando"
        class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-50 z-10"
      >
        <div class="w-8 h-8 rounded-full border-[3px] border-slate-200 border-t-indigo-500 animate-spin"></div>
        <span class="text-sm text-slate-400">Cargando mapa…</span>
      </div>

      <div ref="mapaRef" class="w-full h-full min-h-[500px]"></div>
    </div>

  </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
/**DashBoard y Menu */
import DashboardLayout from '../layouts/DashboardLayout.vue'
import NavBar from '../components/NavBar.vue'

// ─── API Key ─────────────────────────────────────────────────────
// La API Key debe tener habilitada la biblioteca "Maps JavaScript API"
// y el Map ID se crea en: console.cloud.google.com → Google Maps → Map Management
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const MAP_ID  = import.meta.env.VITE_GOOGLE_MAPS_ID

// ─── Estado ──────────────────────────────────────────────────────
const mapaRef      = ref(null)
const cargando = ref(true)
const status    = ref('cargando')
const geoError     = ref('')
const coords       = ref({ lat: 0, lng: 0 })

let map    = null
let marker = null

// ─── 1. Cargar script de Google Maps con librería "marker" ───────
// AdvancedMarkerElement requiere importar la biblioteca "marker"
// y que el Map tenga un mapId configurado.
function cargarGoogleMaps() {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) { resolve(); return }
    const cb = '__gmInit'
    window[cb] = () => { delete window[cb]; resolve() }
    const s = document.createElement('script')
    // Agrega "marker" a las libraries para usar AdvancedMarkerElement
    s.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=marker&callback=${cb}&loading=async`
    s.async = true
    s.defer = true
    s.onerror = () => reject(new Error('No se pudo cargar Google Maps'))
    document.head.appendChild(s)
  })
}

// ─── 2. Geolocalización del navegador ────────────────────────────
function obtenerUbicacion() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Tu navegador no soporta geolocalización'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => {
        const mensajes = {
          1: 'Permiso de ubicación denegado',
          2: 'No se pudo obtener la posición',
          3: 'Tiempo de espera agotado',
        }
        reject(new Error(mensajes[err.code] || 'Error desconocido'))
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  })
}

// ─── 3. Inicializar mapa + marcador ──────────────────────────────
async function init() {
  try {
    const [, posicion] = await Promise.all([
      cargarGoogleMaps(),
      obtenerUbicacion(),
    ])

    coords.value   = posicion
    status.value = 'ok'

    // Map ID es obligatorio para AdvancedMarkerElement
    map = new window.google.maps.Map(mapaRef.value, {
      center: posicion,
      zoom: 16,
      mapId: MAP_ID,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    })

    // Importar AdvancedMarkerElement desde la biblioteca "marker"
    const { AdvancedMarkerElement } = await window.google.maps.importLibrary('marker')

    // Elemento HTML personalizado para el pin
    const pinEl = document.createElement('div')
    pinEl.innerHTML = `
      <div style="
        width:20px;height:20px;border-radius:50%;
        background:#4f46e5;border:3px solid #fff;
        box-shadow:0 2px 8px rgba(79,70,229,0.5);
      "></div>
    `

    marker = new AdvancedMarkerElement({
      map,
      position: posicion,
      title: 'Estás aquí',
      content: pinEl,
    })

    // InfoWindow al hacer clic
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="font-family:system-ui,sans-serif;padding:4px 6px">
          <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#1e1b4b">📍 Estás aquí</p>
          <p style="margin:0;font-size:11px;color:#6b7280">
            ${posicion.lat.toFixed(6)}, ${posicion.lng.toFixed(6)}
          </p>
        </div>
      `,
    })

    marker.addListener('click', () => infoWindow.open(map, marker))
    infoWindow.open(map, marker)

    cargando.value = false

  } catch (err) {
    status.value = 'error'
    geoError.value  = err.message
    cargando.value = false

    // Mapa genérico si falló la geolocalización
    await cargarGoogleMaps().catch(() => {})
    if (window.google?.maps && mapaRef.value) {
      map = new window.google.maps.Map(mapaRef.value, {
        center: { lat: 19.4326, lng: -99.1332 },
        zoom: 12,
        mapId: MAP_ID,
        mapTypeControl: false,
        streetViewControl: false,
      })
    }
  }
}

// ─── Centrar mapa ─────────────────────────────────────────────────
function centrarEnMiUbicacion() {
  if (map && coords.value.lat) {
    map.panTo(coords.value)
    map.setZoom(16)
  }
}

// ─── Ciclo de vida ────────────────────────────────────────────────
onMounted(() => init())

onUnmounted(() => {
  if (marker) marker.map = null
})
</script>