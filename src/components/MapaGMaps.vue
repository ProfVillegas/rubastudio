<template>
  <div class="relative w-full h-full">

    <!-- Overlay cargando -->
    <div v-if="iniciando"
      class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-slate-50 rounded-xl">
      <div class="w-7 h-7 rounded-full border-[3px] border-slate-200 border-t-indigo-500 animate-spin"></div>
      <span class="text-xs text-slate-400">Cargando mapa…</span>
    </div>

    <!-- Buscador de Places (se monta dentro del mapa via ref) -->
    <div ref="buscadorRef"
      class="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-[85%] max-w-sm">
      <input
        ref="inputBusquedaRef"
        type="text"
        placeholder="Buscar dirección…"
        class="w-full rounded-xl border border-slate-200 shadow-md bg-white px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div>

    <!-- Contenedor del mapa -->
    <div ref="mapaRef" class="w-full h-full rounded-xl"></div>

  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

// ── Props & Emits ────────────────────────────────────────────────
const props = defineProps({
  posicion:    { type: Object,  default: null },   // { lat, lng }
  popupTexto:  { type: String,  default: 'Ubicación' },
  zoom:        { type: Number,  default: 15 },
  interactivo: { type: Boolean, default: true },
})

const emit = defineEmits(['coordenadas-seleccionadas'])

// ── Refs ─────────────────────────────────────────────────────────
const mapaRef         = ref(null)
const inputBusquedaRef = ref(null)
const iniciando       = ref(true)

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const MAP_ID  = import.meta.env.VITE_GOOGLE_MAPS_ID

let map        = null
let marker     = null
let autocomplete = null

// ── Cargar script de Google Maps ─────────────────────────────────
function cargarGoogleMaps() {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) { resolve(); return }
    const cb = '__gmapsReady'
    window[cb] = () => { delete window[cb]; resolve() }
    const s  = document.createElement('script')
    // libraries=marker  → AdvancedMarkerElement
    // libraries=places  → Autocomplete de direcciones
    s.src    = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=marker,places&callback=${cb}&loading=async`
    s.async  = true
    s.defer  = true
    s.onerror = () => reject(new Error('No se pudo cargar Google Maps. Verifica tu API Key.'))
    document.head.appendChild(s)
  })
}

// ── Inicializar mapa ─────────────────────────────────────────────
async function init() {
  try {
    await cargarGoogleMaps()

    const centro = props.posicion
      ? { lat: props.posicion.lat, lng: props.posicion.lng }
      : { lat: 19.4326, lng: -99.1332 }  // CDMX por defecto

    map = new window.google.maps.Map(mapaRef.value, {
      center:           centro,
      zoom:             props.zoom,
      mapId:            MAP_ID,                // obligatorio para AdvancedMarkerElement
      mapTypeControl:   false,
      streetViewControl: false,
      fullscreenControl: true,
      clickableIcons:   false,
    })

    // ── AdvancedMarkerElement ─────────────────────────────────
    const { AdvancedMarkerElement } = await window.google.maps.importLibrary('marker')

    // Pin visual personalizado
    const pinEl       = crearPinEl()
    marker = new AdvancedMarkerElement({
      map,
      position:    centro,
      title:       props.popupTexto,
      content:     pinEl,
      gmpDraggable: props.interactivo,
    })

    // InfoWindow
    const infoWindow = new window.google.maps.InfoWindow()

    marker.addListener('click', () => {
      infoWindow.setContent(`<div style="font-family:system-ui,sans-serif;font-size:13px;padding:2px 4px"><strong>${props.popupTexto}</strong></div>`)
      infoWindow.open(map, marker)
    })

    // Drag del marcador
    if (props.interactivo) {
      marker.addListener('dragend', () => {
        const pos = marker.position
        emitirCoordenadas(pos.lat, pos.lng)
      })

      // Clic en el mapa → mueve marcador
      map.addListener('click', (e) => {
        const lat = e.latLng.lat()
        const lng = e.latLng.lng()
        marker.position = { lat, lng }
        emitirCoordenadas(lat, lng)
      })
    }

    // ── Places Autocomplete ───────────────────────────────────
    if (props.interactivo && inputBusquedaRef.value) {
      autocomplete = new window.google.maps.places.Autocomplete(inputBusquedaRef.value, {
        fields:          ['geometry', 'address_components', 'formatted_address'],
        componentRestrictions: { country: 'mx' },   // limitar a México — ajusta si necesitas otro país
      })

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (!place.geometry?.location) return

        const lat = place.geometry.location.lat()
        const lng = place.geometry.location.lng()

        map.panTo({ lat, lng })
        map.setZoom(17)
        marker.position = { lat, lng }
        emitirCoordenadas(lat, lng)
      })
    }

    // Colocar marcador si ya había posición
    if (props.posicion) {
      marker.position = { lat: props.posicion.lat, lng: props.posicion.lng }
    }

    iniciando.value = false
  } catch (err) {
    console.error('Error Google Maps:', err)
    iniciando.value = false
  }
}

// ── Pin personalizado en HTML ─────────────────────────────────────
function crearPinEl() {
  const div = document.createElement('div')
  div.style.cssText = `
    width: 22px; height: 22px; border-radius: 50%;
    background: #4f46e5; border: 3px solid #fff;
    box-shadow: 0 2px 8px rgba(79,70,229,0.45);
    cursor: ${props.interactivo ? 'grab' : 'default'};
  `
  return div
}

// ── Emitir coordenadas normalizadas ──────────────────────────────
function emitirCoordenadas(lat, lng) {
  emit('coordenadas-seleccionadas', {
    lat: typeof lat === 'function' ? +lat().toFixed(7) : +lat.toFixed(7),
    lng: typeof lng === 'function' ? +lng().toFixed(7) : +lng.toFixed(7),
  })
}

// ── Reaccionar a cambio de posición desde el padre ───────────────
watch(() => props.posicion, (nueva) => {
  if (!map || !marker || !nueva) return
  marker.position = { lat: nueva.lat, lng: nueva.lng }
  map.panTo({ lat: nueva.lat, lng: nueva.lng })
})

// ── Ciclo de vida ─────────────────────────────────────────────────
onMounted(() => init())

onUnmounted(() => {
  if (marker)  { marker.map = null; marker = null }
  if (autocomplete) window.google?.maps.event.clearInstanceListeners(autocomplete)
  map = null
})
</script>
