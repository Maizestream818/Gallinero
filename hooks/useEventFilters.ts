/*Este hook aplica el filtro por periodo de tiempo: HOY, ESTA SEMANA, PROXIMOS.
-Filtra en primer instancia por sección (checklist)
-Se filtra por texto
 */

import { useMemo } from 'react';
import type { EventStudentItem } from '@/features/events/types/eventTypes';
import type { EventsSectionFilter } from '@/features/events/components/EventsSectionChecklist';

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getEndOfWeek(date: Date): Date {
  const start = getStartOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
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
    //  Clasificamos base por fecha
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

    //  Aplicamos checklist para elegir qué secciones entran
    const enabledToday = sections.today ? today : [];
    const enabledWeek = sections.week ? week : [];
    const enabledUpcoming = sections.upcoming ? upcoming : [];

    //  Aplicamos la búsqueda sobre CADA sección ya filtrada por checklist
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

    // Total para “sin resultados”
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
