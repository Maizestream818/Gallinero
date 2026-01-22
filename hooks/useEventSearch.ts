/*Esto es un hook de lógica que filtra una lista de eventos usando el texto libre
los cuales los filtra por Nombre del evento y Etiquetas(tags)
-Recibe una lista de eventos
-Recibe un texto de busqueda
-Normaliza el texto
-Retorna solo los eventos que coinciden
 */
import { useMemo } from 'react';
import type { EventStudentItem } from '@/features/events/types/eventTypes';

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita acentos
    .trim();
}

export function useEventSearch(params: {
  events: EventStudentItem[];
  query: string;
}) {
  const { events, query } = params;

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return events;

    return events.filter((e) => {
      const title = normalize(e.title ?? '');
      const tags = (e.tags ?? []).map(normalize);

      const inTitle = title.includes(q);
      const inTags = tags.some((t) => t.includes(q));

      return inTitle || inTags;
    });
  }, [events, query]);

  return { filtered };
}
