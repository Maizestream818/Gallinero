// features/events/hooks/useEventFilters.ts
// Hook que clasifica y filtra eventos por periodo (Hoy / Esta semana / Próximos)
// y por texto de búsqueda. Fuente única de esta lógica — no duplicar en las screens.

import { useMemo } from 'react';
import type { EventStudentItem } from '@/features/events/types/eventTypes';
import type { EventsSectionFilter } from '@/features/events/components/EventsSectionChecklist';
import { isSameLocalDay, getEndOfWeek } from '@/features/events/utils/dateUtils';

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export function useEventFilters(params: {
  events: EventStudentItem[];
  query: string;
  sections: EventsSectionFilter;
}) {
  const { events, query, sections } = params;

  const now = useMemo(() => new Date(), []);
  const endOfWeek = useMemo(() => getEndOfWeek(now), [now]);

  return useMemo(() => {
    // Clasificar por fecha
    const today: EventStudentItem[] = [];
    const week: EventStudentItem[] = [];
    const upcoming: EventStudentItem[] = [];

    for (const e of events) {
      const d = new Date(e.startsAtIso);

      if (isSameLocalDay(now, d)) {
        today.push(e);
        continue;
      }
      if (d.getTime() > now.getTime() && d.getTime() <= endOfWeek.getTime()) {
        week.push(e);
        continue;
      }
      if (d.getTime() > endOfWeek.getTime()) {
        upcoming.push(e);
      }
    }

    const sortByDate = (a: EventStudentItem, b: EventStudentItem) =>
      new Date(a.startsAtIso).getTime() - new Date(b.startsAtIso).getTime();

    today.sort(sortByDate);
    week.sort(sortByDate);
    upcoming.sort(sortByDate);

    // Aplicar checklist de secciones
    const enabledToday = sections.today ? today : [];
    const enabledWeek = sections.week ? week : [];
    const enabledUpcoming = sections.upcoming ? upcoming : [];

    // Aplicar búsqueda de texto sobre cada sección
    const q = normalize(query);
    const matches = (e: EventStudentItem) => {
      if (!q) return true;
      const inTitle = normalize(e.title ?? '').includes(q);
      const inTags = (e.tags ?? []).some((t) => normalize(t).includes(q));
      return inTitle || inTags;
    };

    const filteredToday = enabledToday.filter(matches);
    const filteredWeek = enabledWeek.filter(matches);
    const filteredUpcoming = enabledUpcoming.filter(matches);

    const totalFiltered =
      filteredToday.length + filteredWeek.length + filteredUpcoming.length;

    return {
      today: filteredToday,
      week: filteredWeek,
      upcoming: filteredUpcoming,
      totalFiltered,
    };
  }, [events, query, sections, now, endOfWeek]);
}
