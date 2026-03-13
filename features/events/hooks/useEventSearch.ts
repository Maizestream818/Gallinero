// features/events/hooks/useEventSearch.ts
// Hook que filtra una lista de eventos usando texto libre.
// Busca coincidencias en el título del evento y en las etiquetas (tags).

import { useMemo } from 'react';
import type { EventStudentItem } from '@/features/events/types/eventTypes';

function normalize(text: string): string {
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
      const inTitle = normalize(e.title ?? '').includes(q);
      const inTags = (e.tags ?? []).some((t) => normalize(t).includes(q));
      return inTitle || inTags;
    });
  }, [events, query]);

  return { filtered };
}
