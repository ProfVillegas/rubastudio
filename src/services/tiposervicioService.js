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

// Referencia a la colección en Firestore
const collectionRef = collection(db, 'tiposervicios')

// ── GET ALL (Firestore) ───────────────────────────────────────────
export async function getTiposervicios() {
  try {
    const querySnapshot = await getDocs(collectionRef)
    const tiposervicios = []
    
    querySnapshot.forEach((doc) => {
      // Mapeamos el ID del documento de Firebase junto con sus datos
      tiposervicios.push({ id: doc.id, ...doc.data() })
    })
    
    return tiposervicios
  } catch (error) {
    console.error('[TiposervicioService] Error en getTiposervicios:', error)
    throw new Error('No se pudieron recuperar las tiposervicios del servidor.')
  }
}

// ── GET ONE (Firestore) ───────────────────────────────────────────
export async function getTiposervicio(id) {
  try {
    const docRef = doc(db, 'tiposervicios', id)
    const docSnap = await getDoc(docRef)
    
    if (!docSnap.exists()) {
      throw new Error(`Ubicación con ID ${id} no encontrada.`)
    }
    
    return { id: docSnap.id, ...docSnap.data() }
  } catch (error) {
    console.error(`[TiposervicioService] Error en getTiposervicio (${id}):`, error)
    throw new Error(error.message || 'Error al obtener los detalles de la ubicación.')
  }
}

// ── CREATE (Firestore) ────────────────────────────────────────────
export async function crearTiposervicio(datos) {
  try {
    // Cloud Firestore genera automáticamente hashes alfanuméricos únicos como IDs
    const docRef = await addDoc(collectionRef, datos)
    return { id: docRef.id, ...datos }
  } catch (error) {
    console.error('[TiposervicioService] Error en crearTiposervicio:', error)
    throw new Error('Error al guardar la nueva ubicación.')
  }
}

// ── UPDATE (Firestore) ────────────────────────────────────────────
export async function actualizarTiposervicio(id, datos) {
  try {
    const docRef = doc(db, 'tiposervicios', id)
    
    // Evitamos enviar el campo ID dentro del payload de actualización de Firestore
    const { id: _, ...datosAActualizar } = datos
    
    await updateDoc(docRef, datosAActualizar)
    return { id, ...datosAActualizar }
  } catch (error) {
    console.error(`[TiposervicioService] Error en actualizarTiposervicio (${id}):`, error)
    throw new Error('Error al actualizar los datos de la ubicación.')
  }
}

// ── DELETE (Firestore) ────────────────────────────────────────────
export async function eliminarTiposervicio(id) {
  try {
    const docRef = doc(db, 'tiposervicios', id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error(`[TiposervicioService] Error en eliminarTiposervicio (${id}):`, error)
    throw new Error('Error al intentar eliminar la ubicación.')
  }
}
