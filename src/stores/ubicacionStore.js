import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getUbicaciones,
  getUbicacion,
  crearUbicacion,
  actualizarUbicacion,
  eliminarUbicacion,
  geocodificarInverso,
  obtenerCoordenadas,
} from '@/services/ubicacionService'

const FORM_VACIO = () => ({
  nombre:     '',
  calle:      '',
  numero:     '',
  colonia:    '',
  ciudad:     '',
  estado:     '',
  cp:         '',
  telefono:   '',
  celular:    '',
  correo:     '',
  latitud:    null,
  longitud:   null,
  referencia: '',
})

export const useUbicacionStore = defineStore('ubicacion', () => {

  // ── Estado ────────────────────────────────────────────────────
  const lista          = ref([])
  const seleccionada   = ref(null)
  const form           = ref(FORM_VACIO())
  const modoEdicion    = ref(false)
  const cargando       = ref(false)
  const guardando      = ref(false)
  const eliminando     = ref(false)
  const geocodificando = ref(false)
  const error          = ref(null)
  const exito          = ref(null)

  // ── Getters ───────────────────────────────────────────────────
  const totalUbicaciones = computed(() => lista.value.length)

  const tieneCoordenadas = computed(
    () => form.value.latitud !== null && form.value.longitud !== null
  )

  const posicionMapa = computed(() =>
    tieneCoordenadas.value
      ? { lat: form.value.latitud, lng: form.value.longitud }
      : null
  )

  // ── Helpers ───────────────────────────────────────────────────
  function _notificar(msg) {
    exito.value = msg
    setTimeout(() => { exito.value = null }, 3500)
  }

  // ── CRUD ──────────────────────────────────────────────────────
  async function cargarLista() {
    cargando.value = true
    error.value    = null
    try {
      lista.value = await getUbicaciones()
    } catch (e) {
      error.value = e.message
    } finally {
      cargando.value = false
    }
  }

  function iniciarCrear() {
    form.value         = FORM_VACIO()
    seleccionada.value = null
    modoEdicion.value  = false
    error.value        = null
  }

  async function iniciarEditar(id) {
    error.value = null
    try {
      const data         = await getUbicacion(id)
      form.value         = { ...data }
      seleccionada.value = id
      modoEdicion.value  = true
    } catch (e) {
      error.value = e.message
    }
  }

  async function guardar() {
    guardando.value = true
    error.value     = null
    try {
      if (modoEdicion.value) {
        const actualizada = await actualizarUbicacion(seleccionada.value, form.value)
        const idx = lista.value.findIndex(u => u.id === actualizada.id)
        if (idx !== -1) lista.value[idx] = actualizada
        _notificar('Ubicación actualizada correctamente.')
      } else {
        const nueva = await crearUbicacion(form.value)
        lista.value.push(nueva)
        _notificar('Ubicación creada correctamente.')
      }
      iniciarCrear()
    } catch (e) {
      error.value = e.message
    } finally {
      guardando.value = false
    }
  }

  async function eliminar(id) {
    eliminando.value = true
    error.value      = null
    try {
      await eliminarUbicacion(id)
      lista.value = lista.value.filter(u => u.id !== id)
      if (seleccionada.value === id) iniciarCrear()
      _notificar('Ubicación eliminada.')
    } catch (e) {
      error.value = e.message
    } finally {
      eliminando.value = false
    }
  }

  // ── Geolocalización ───────────────────────────────────────────
  async function usarMiUbicacion() {
    geocodificando.value = true
    error.value          = null
    try {
      const { lat, lng } = await obtenerCoordenadas()
      form.value.latitud  = lat
      form.value.longitud = lng
      await autocompletarDesdeCoordenadas(lat, lng)
    } catch (e) {
      error.value = e.message
    } finally {
      geocodificando.value = false
    }
  }

  async function autocompletarDesdeCoordenadas(lat, lng) {
    geocodificando.value = true
    try {
      const direccion = await geocodificarInverso(lat, lng)
      Object.entries(direccion).forEach(([k, v]) => {
        if (!form.value[k]) form.value[k] = v
      })
      form.value.latitud  = lat
      form.value.longitud = lng
    } catch (e) {
      error.value = e.message
    } finally {
      geocodificando.value = false
    }
  }

  function actualizarCoordenadas(lat, lng) {
    form.value.latitud  = lat
    form.value.longitud = lng
  }

  return {
    lista, seleccionada, form, modoEdicion,
    cargando, guardando, eliminando, geocodificando,
    error, exito,
    totalUbicaciones, tieneCoordenadas, posicionMapa,
    cargarLista,
    iniciarCrear, iniciarEditar,
    guardar, eliminar,
    usarMiUbicacion, autocompletarDesdeCoordenadas, actualizarCoordenadas,
  }
})
