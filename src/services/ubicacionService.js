// src/services/ubicacionService.js
//
// Capa de datos (API / Tercera Capa) para el módulo de ubicación conectada a Cloud Firestore.
// Geocodificación inversa con Google Maps Geocoding API.

import { db } from '@/config/firebase'
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore'

// Referencia a la colección destino en Cloud Firestore
const collectionRef = collection(db, 'ubicaciones')

// ── GET ALL ───────────────────────────────────────────────────────
export async function getUbicaciones() {
  try {
    const querySnapshot = await getDocs(collectionRef)
    const ubicaciones = []
    
    querySnapshot.forEach((docSnap) => {
      // Inyectamos el hash alfanumérico generado por Firebase como la propiedad 'id'
      ubicaciones.push({ id: docSnap.id, ...docSnap.data() })
    })
    
    return ubicaciones
  } catch (error) {
    console.error('[ubicacionService] Error en getUbicaciones:', error)
    throw new Error('No se pudieron recuperar las ubicaciones del servidor remoto.')
  }
}

// ── GET ONE ───────────────────────────────────────────────────────
export async function getUbicacion(id) {
  try {
    const docRef = doc(db, 'ubicaciones', id)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      throw new Error(`La ubicación con ID ${id} no existe.`)
    }
    
    return { id: docSnap.id, ...docSnap.data() }
  } catch (error) {
    console.error(`[ubicacionService] Error en getUbicacion para el ID ${id}:`, error)
    throw new Error(error.message || 'Error al consultar la información detallada de la ubicación.')
  }
}

// ── CREATE ────────────────────────────────────────────────────────
export async function crearUbicacion(datos) {
  try {
    // addDoc se encarga de estructurar el registro y generar el hash ID en el servidor
    const docRef = await addDoc(collectionRef, datos)
    return { id: docRef.id, ...datos }
  } catch (error) {
    console.error('[ubicacionService] Error en crearUbicacion:', error)
    throw new Error('No se pudo dar de alta la ubicación en la base de datos.')
  }
}

// ── UPDATE ────────────────────────────────────────────────────────
export async function actualizarUbicacion(id, datos) {
  try {
    const docRef = doc(db, 'ubicaciones', id)
    
    // Desestructuramos para limpiar y asegurar que el campo destructivo 'id' no se guarde dentro del payload del documento
    const { id: _, ...datosAActualizar } = datos
    
    await updateDoc(docRef, datosAActualizar)
    return { id, ...datosAActualizar }
  } catch (error) {
    console.error(`[ubicacionService] Error en actualizarUbicacion para el ID ${id}:`, error)
    throw new Error('Ocurrió un error al procesar la actualización de los datos.')
  }
}

// ── DELETE ────────────────────────────────────────────────────────
export async function eliminarUbicacion(id) {
  try {
    const docRef = doc(db, 'ubicaciones', id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error(`[ubicacionService] Error en eliminarUbicacion para el ID ${id}:`, error)
    throw new Error('Error crítico: No se pudo remover la ubicación especificada.')
  }
}

// ── GEOCODIFICACIÓN INVERSA (Usando el SDK oficial) ───────────
export function geocodificarInverso(lat, lng) {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps) {
      return reject(new Error('El SDK de Google Maps no está cargado.'));
    }

    const geocoder = new google.maps.Geocoder();
    const latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };

    geocoder.geocode({ location: latlng, language: 'es' }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          const componentes = results[0].address_components;

          const get = (...tipos) => {
            const c = componentes.find(c => tipos.every(t => c.types.includes(t)));
            return c?.long_name ?? '';
          };

          const resultado = {
            calle:   get('route'),
            numero:  get('street_number'),
            colonia: get('sublocality_level_1') || get('sublocality') || get('neighborhood'),
            ciudad:  get('locality') || get('administrative_area_level_2'),
            estado:  get('administrative_area_level_1'),
            cp:      get('postal_code'),
          };

          if (import.meta.env.DEV) {
            console.debug('[geocodificarInverso] resultado:', resultado);
          }

          resolve(resultado);
        } else {
          reject(new Error('No se encontraron resultados.'));
        }
      } else if (status === 'ZERO_RESULTS') {
        reject(new Error('No se encontró dirección para estas coordenadas.'));
      } else {
        reject(new Error(`Geocodificación fallida debido a: ${status}`));
      }
    });
  });
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