let _db = [
  {
    id: 1,
    nombre:     'Sede Central',
    calle:      'Av. Insurgentes Sur',
    numero:     '1234',
    colonia:    'Del Valle',
    ciudad:     'Ciudad de México',
    estado:     'CDMX',
    cp:         '03100',
    telefono:   '55 5678 9012',
    celular:    '55 1234 5678',
    correo:     'contacto@rubastudio.mx',
    latitud:    19.3730,
    longitud:   -99.1728,
    referencia: 'Frente al parque',
  },
]
let _nextId = 2
const delay = (ms = 420) => new Promise(r => setTimeout(r, ms))

// ── GET ALL ───────────────────────────────────────────────────────
export async function getUbicaciones() {
  await delay()
  return structuredClone(_db)
}

// ── GET ONE ───────────────────────────────────────────────────────
export async function getUbicacion(id) {
  await delay()
  const item = _db.find(u => u.id === id)
  if (!item) throw new Error(`Ubicación ${id} no encontrada`)
  return structuredClone(item)
}

// ── CREATE ────────────────────────────────────────────────────────
export async function crearUbicacion(datos) {
  await delay()
  const nueva = { id: _nextId++, ...datos }
  _db.push(nueva)
  return structuredClone(nueva)
}

// ── UPDATE ────────────────────────────────────────────────────────
export async function actualizarUbicacion(id, datos) {
  await delay()
  const idx = _db.findIndex(u => u.id === id)
  if (idx === -1) throw new Error(`Ubicación ${id} no encontrada`)
  _db[idx] = { ..._db[idx], ...datos }
  return structuredClone(_db[idx])
}

// ── DELETE ────────────────────────────────────────────────────────
export async function eliminarUbicacion(id) {
  await delay()
  const idx = _db.findIndex(u => u.id === id)
  if (idx === -1) throw new Error(`Ubicación ${id} no encontrada`)
  _db.splice(idx, 1)
}

// ── GEOCODIFICACIÓN INVERSA (Google Maps Geocoding API) ───────────
// Requiere que la API Key tenga habilitada "Geocoding API"
// en console.cloud.google.com
export async function geocodificarInverso(lat, lng) {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=es&key=${API_KEY}`

  const res  = await fetch(url)
  const data = await res.json()

  if (data.status !== 'OK') {
    throw new Error(`Geocodificación fallida: ${data.status}`)
  }

  // Extraer componentes del primer resultado
  const componentes = data.results[0]?.address_components ?? []

  const get = (...tipos) => {
    const c = componentes.find(c => tipos.every(t => c.types.includes(t)))
    return c?.long_name ?? ''
  }
  const getShort = (...tipos) => {
    const c = componentes.find(c => tipos.every(t => c.types.includes(t)))
    return c?.short_name ?? ''
  }

  return {
    calle:   get('route'),
    numero:  get('street_number'),
    colonia: get('sublocality_level_1') || get('neighborhood'),
    ciudad:  get('locality') || get('administrative_area_level_2'),
    estado:  get('administrative_area_level_1'),
    cp:      get('postal_code'),
  }
}

// ── GEOLOCALIZACIÓN DEL NAVEGADOR ─────────────────────────────────
export function obtenerCoordenadas() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Tu navegador no soporta geolocalización'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ lat: coords.latitude, lng: coords.longitude }),
      (err) => {
        const msgs = { 1: 'Permiso denegado', 2: 'Posición no disponible', 3: 'Tiempo agotado' }
        reject(new Error(msgs[err.code] ?? 'Error de geolocalización'))
      },
      { enableHighAccuracy: true, timeout: 10_000 }
    )
  })
}
