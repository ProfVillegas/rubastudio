<template>
  <div class="relative w-full h-full">
 
    <!-- Overlay cargando -->
    <div v-if="iniciando"
      class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-slate-50 rounded-xl">
      <div class="w-7 h-7 rounded-full border-[3px] border-slate-200 border-t-indigo-500 animate-spin"></div>
      <span class="text-xs text-slate-400">Cargando mapa…</span>
    </div>
 
    <!--
      PlaceAutocompleteElement: es un Web Component nativo de Google.
      Se inserta con ref y se monta dinámicamente en init() para
      asegurarnos de que el SDK ya cargó antes de usarlo.
    -->
    <div ref="buscadorWrapperRef"
      class="absolute top-3 left-1/2 -translate-x-1/2 z-20 w-[85%] max-w-sm">
    </div>
 
    <!-- Contenedor del mapa -->
    <div ref="mapaRef" class="w-full h-full rounded-xl"></div>
 
  </div>
</template>
 
<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
 
// ── Props & Emits ────────────────────────────────────────────────
const props = defineProps({
  posicion:    { type: Object,  default: null },
  popupTexto:  { type: String,  default: 'Ubicación' },
  zoom:        { type: Number,  default: 15 },
  interactivo: { type: Boolean, default: true },
})
 
const emit = defineEmits(['coordenadas-seleccionadas'])
 
// ── Refs ─────────────────────────────────────────────────────────
const mapaRef           = ref(null)
const buscadorWrapperRef = ref(null)
const iniciando         = ref(true)
 
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const MAP_ID  = import.meta.env.VITE_GOOGLE_MAPS_ID
 
let map         = null
let marker      = null
let infoWindow  = null
let placesEl    = null   // PlaceAutocompleteElement
 
// ── Cargar SDK de Google Maps ─────────────────────────────────────
// Carga libraries=marker,places con la nueva API de importación dinámica
function cargarGoogleMaps() {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) { resolve(); return }
    const cb = '__gmapsReady'
    window[cb] = () => { delete window[cb]; resolve() }
    const s = document.createElement('script')
    // loading=async es obligatorio con el nuevo loader de Google Maps
    s.src     = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=marker,places&callback=${cb}&loading=async`
    s.async   = true
    s.defer   = true
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
      : { lat: 19.4326, lng: -99.1332 }
 
    // ── Mapa ──────────────────────────────────────────────────
    map = new window.google.maps.Map(mapaRef.value, {
      center:            centro,
      zoom:              props.zoom,
      mapId:             MAP_ID,
      mapTypeControl:    false,
      streetViewControl: false,
      fullscreenControl: true,
      clickableIcons:    false,
    })
 
    // ── AdvancedMarkerElement ─────────────────────────────────
    const { AdvancedMarkerElement } = await window.google.maps.importLibrary('marker')
 
    marker = new AdvancedMarkerElement({
      map,
      position:     centro,
      title:        props.popupTexto,
      content:      crearPinEl(),
      gmpDraggable: props.interactivo,
    })
 
    infoWindow = new window.google.maps.InfoWindow()
 
    // CORRECTO: AdvancedMarkerElement usa addEventListener, no addListener
    marker.addEventListener('gmp-click', () => {
      infoWindow.setContent(
        `<div style="font-family:system-ui,sans-serif;font-size:13px;padding:2px 4px">
           <strong>${props.popupTexto}</strong>
         </div>`
      )
      infoWindow.open(map, marker)
    })
 
    if (props.interactivo) {
      // Drag del marcador — también usa addEventListener
      marker.addEventListener('dragend', () => {
        const pos = marker.position
        emitirCoordenadas(
          typeof pos.lat === 'function' ? pos.lat() : pos.lat,
          typeof pos.lng === 'function' ? pos.lng() : pos.lng,
        )
      })
 
      // Clic en el mapa → mueve marcador
      map.addListener('click', (e) => {
        const lat = e.latLng.lat()
        const lng = e.latLng.lng()
        marker.position = { lat, lng }
        emitirCoordenadas(lat, lng)
      })
    }
 
    // ── PlaceAutocompleteElement (nueva API, sin warnings) ────
    if (props.interactivo && buscadorWrapperRef.value) {
      await montarPlaceAutocomplete()
    }
 
    // Posición inicial si ya viene con coords
    if (props.posicion) {
      marker.position = { lat: props.posicion.lat, lng: props.posicion.lng }
    }
 
    iniciando.value = false
  } catch (err) {
    console.error('Error Google Maps:', err)
    iniciando.value = false
  }
}
 
// ── PlaceAutocompleteElement ──────────────────────────────────────
// Reemplaza a google.maps.places.Autocomplete (deprecated desde marzo 2025)
async function montarPlaceAutocomplete() {
  // Importar la librería de places con el nuevo loader
  await window.google.maps.importLibrary('places')
 
  // PlaceAutocompleteElement es un Web Component nativo — se crea con el DOM
  // IMPORTANTE: PlaceAutocompleteElement NO acepta 'fields' en el constructor.
  // Los fields se especifican en fetchFields() dentro del evento gmp-placeselect.
  placesEl = new window.google.maps.places.PlaceAutocompleteElement({
    componentRestrictions: { country: 'mx' },  // ajusta al país que necesites
  })
 
  // Estilos para que se integre visualmente con el diseño del proyecto
  Object.assign(placesEl.style, {
    width:         '100%',
    borderRadius:  '12px',
    border:        '1px solid #e2e8f0',
    boxShadow:     '0 4px 12px rgba(0,0,0,0.08)',
    fontSize:      '14px',
    fontFamily:    'system-ui, sans-serif',
    backgroundColor: '#fff',
  })
 
  buscadorWrapperRef.value.appendChild(placesEl)
 
  // El nuevo evento es 'gmp-placeselect' (no 'place_changed')
  placesEl.addEventListener('gmp-placeselect', async ({ place }) => {
    // fetchFields obtiene los datos del lugar seleccionado
    await place.fetchFields({ fields: ['location', 'addressComponents'] })
 
    // Nueva API: place.location es un LatLng directo (no place.geometry.location)
    const loc = place.location
    if (!loc) return
 
    const lat = typeof loc.lat === 'function' ? loc.lat() : loc.lat
    const lng = typeof loc.lng === 'function' ? loc.lng() : loc.lng
 
    map.panTo({ lat, lng })
    map.setZoom(17)
    marker.position = { lat, lng }
    emitirCoordenadas(lat, lng)
  })
}
 
// ── Pin HTML personalizado ────────────────────────────────────────
function crearPinEl() {
  const div = document.createElement('div')
  div.style.cssText = `
    width:22px; height:22px; border-radius:50%;
    background:#4f46e5; border:3px solid #fff;
    box-shadow:0 2px 8px rgba(79,70,229,0.45);
    cursor:${props.interactivo ? 'grab' : 'default'};
  `
  return div
}
 
// ── Emitir coordenadas ────────────────────────────────────────────
function emitirCoordenadas(lat, lng) {
  emit('coordenadas-seleccionadas', {
    lat: +Number(lat).toFixed(7),
    lng: +Number(lng).toFixed(7),
  })
}
 
// ── Reaccionar a prop :posicion ───────────────────────────────────
watch(() => props.posicion, (nueva) => {
  if (!map || !marker || !nueva) return
  marker.position = { lat: nueva.lat, lng: nueva.lng }
  map.panTo({ lat: nueva.lat, lng: nueva.lng })
})
 
// ── Ciclo de vida ─────────────────────────────────────────────────
onMounted(() => init())
 
onUnmounted(() => {
  if (marker) { marker.map = null; marker = null }
  if (placesEl && buscadorWrapperRef.value) {
    buscadorWrapperRef.value.removeChild(placesEl)
    placesEl = null
  }
  infoWindow = null
  map = null
})
</script>