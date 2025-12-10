// utils/activityLogger.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definición de la estructura de un registro
export interface ActivityRecord {
  timestamp: number;
  message: string;
}

// Clave donde se almacenarán los registros
const ACTIVITY_STORAGE_KEY = '@UserActivityHistory';

/**
 * Carga el historial de actividad desde el almacenamiento local.
 */
export async function loadActivityHistory(): Promise<ActivityRecord[]> {
  try {
    const jsonValue = await AsyncStorage.getItem(ACTIVITY_STORAGE_KEY);
    // Si no hay datos, retorna un array vacío. Si hay, parsea.
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error al cargar el historial de actividad:', e);
    return [];
  }
}

/**
 * Guarda un nuevo registro de actividad y lo añade a los registros existentes.
 * @param message El mensaje descriptivo de la actividad.
 */
export async function logActivity(message: string): Promise<void> {
  const newRecord: ActivityRecord = {
    timestamp: Date.now(),
    message: message,
  };

  try {
    // 1. Cargar registros existentes
    const existingHistory = await loadActivityHistory();

    // 2. Añadir el nuevo registro (al inicio para que el más reciente salga primero)
    const updatedHistory = [newRecord, ...existingHistory];

    // 3. Guardar el historial actualizado
    const jsonValue = JSON.stringify(updatedHistory);
    await AsyncStorage.setItem(ACTIVITY_STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Error al registrar la actividad:', e);
  }
}

// Necesitas instalar el paquete: npx expo install @react-native-async-storage/async-storage
