// features/events/types/eventTypes.ts
// Tipos compartidos para el módulo de eventos.

export type EventStudentItem = {
  // Identificador único del evento.
  // Se utiliza para keys en listas, navegación y referencias internas.
  id: string;

  // Título visible del evento.
  title: string;

  // Descripción completa del evento.
  // Se usa principalmente en el modal/pantalla de detalle.
  description: string;

  // Ubicación donde se realizará el evento.
  location?: string;

  // Organizador o responsable del evento.
  organizer?: string;

  // Fecha y hora de inicio del evento en formato ISO 8601.
  // Ejemplo: "2026-01-05T18:30:00.000Z"
  // Se convierte a Date para formateo, ordenamiento y agrupación por secciones (Hoy / Semana / Próximos).
  startsAtIso: string;

  // URL de la imagen asociada al evento.
  // Si existe, la UI puede elegir renderizar la card con imagen; si no existe, usar la card sin imagen.
  imageUrl?: string;

  // Etiquetas opcionales para clasificación/filtrado y visualización en UI como chips/badges.
  tags?: string[];
  

  // Duración del evento en minutos.
  // Ejemplo: 90 = 1 hora 30 minutos.
  durationMinutes?: number;
};
