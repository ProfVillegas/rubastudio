import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import {
  getTiposervicios,
  getTiposervicio,
  crearTiposervicio,
  actualizarTiposervicio,
  eliminarTiposervicio,
} from '@/services/tiposervicioService'

const FORM_VACIO = () => ({
  nombre:               '',
  categoria:            'mantenimiento',
  descripcion:          '',
  precioBase:           0,
  unidad:               'evento',
  activo:               true,
  requiereProgramacion: true,
  duracionEstimadaMin:  60,
  fecha:                null,
  hora:                 null,
})
export const usetiposervicioStore = defineStore('tiposervicio', () => {

  // ── Estado ────────────────────────────────────────────────────
  const lista          = ref([])
  const seleccionada   = ref(null)
  const form           = ref(FORM_VACIO())
  const modoEdicion    = ref(false)
  const cargando       = ref(false)
  const guardando      = ref(false)
  const eliminando     = ref(false)
  const error          = ref(null)
  const exito          = ref(null)

  function normalizarProgramacion() {
    if (!form.value.requiereProgramacion) {
      form.value.fecha = null
      form.value.hora = null
    }
  }
//función que forza que si no hay programación, fecha y hora vayan como null.
  function prepararPayload() {
    const payload = { ...form.value }

    if (!payload.requiereProgramacion) {
      payload.fecha = null
      payload.hora = null
    } else {
      payload.fecha = payload.fecha || null
      payload.hora = payload.hora || null
    }

    return payload
  }

  watch(
    () => form.value.requiereProgramacion,
    (value) => {
      if (!value) {
        form.value.fecha = null
        form.value.hora = null
      }
    }
  )

  // ── Getters ───────────────────────────────────────────────────
  const totaltiposervicios = computed(() => lista.value.length)

 

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
      lista.value = await getTiposervicios()
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
    normalizarProgramacion()
  }

  async function iniciarEditar(id) {
    error.value = null
    try {
      const data         = await getTiposervicio(id)
      form.value         = { ...data }
      seleccionada.value = id
      modoEdicion.value  = true
      normalizarProgramacion()
    } catch (e) {
      error.value = e.message
    }
  }

  async function guardar() {
    guardando.value = true
    error.value     = null
    normalizarProgramacion()
    try {
      const payload = prepararPayload()

      if (modoEdicion.value) {
        const actualizada = await actualizarTiposervicio(seleccionada.value, payload)
        const idx = lista.value.findIndex(u => u.id === actualizada.id)
        if (idx !== -1) lista.value[idx] = actualizada
        _notificar('Ubicación actualizada correctamente.')
      } else {
        const nueva = await crearTiposervicio(payload)
        lista.value.push(nueva)
        _notificar('Ubicación creada correctamente.')
      }
      iniciarCrear()
      return true //Operación exitosa
    } catch (e) {
      error.value = e.message
      return false
    } finally {
      guardando.value = false
    }
  }

  async function eliminar(id) {
    eliminando.value = true
    error.value      = null
    try {
      await eliminarTiposervicio(id)
      lista.value = lista.value.filter(u => u.id !== id)
      if (seleccionada.value === id) iniciarCrear()
      _notificar('Ubicación eliminada.')
    } catch (e) {
      error.value = e.message
    } finally {
      eliminando.value = false
    }
  }

 


  return {
    lista, seleccionada, form, modoEdicion,
    cargando, guardando, eliminando,
    error, exito,
    totaltiposervicios, 
    cargarLista,
    iniciarCrear, iniciarEditar,
    guardar, eliminar,
  }
})
