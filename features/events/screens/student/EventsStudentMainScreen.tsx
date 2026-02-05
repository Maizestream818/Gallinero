// features/events/screens/student/EventsStudentMainScreen.tsx
// Pantalla principal de eventos para alumno (Student).
// - Lista eventos en secciones "Hoy", "Esta semana" y "Eventos próximos".
// - Usa EventCardWithImage / EventCardNoImage.
// - Las cards se muestran en un grid de 1 columna
// - Al tocar una card, abre el EventDetailModal (splash) con el detalle del evento.

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EventsSectionChecklist } from '../../components/EventsSectionChecklist';
import { EventsSearchBar } from '../../components/EventsSearchBar';
import { useEventSearch } from '@/hooks/useEventSearch';
import { EventCardNoImage } from '@/features/events/components/EventCardNoImage';
import { EventCardWithImage } from '@/features/events/components/EventCardWithImage';
import { EventDetailModal } from '@/features/events/components/EventDetailModal';
import { EVENTS_SEED } from '@/features/events/components/EventSeed';
import type { EventStudentItem } from '@/features/events/types/eventTypes';

// -----------------------------------------------------------------------------
// Utilidades de fechas
// -----------------------------------------------------------------------------

function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// Semana (lunes–domingo) con base en la fecha actual
function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = domingo, 1 = lunes, ...
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

// -----------------------------------------------------------------------------
// Screen principal
// -----------------------------------------------------------------------------

export function EventsStudentMainScreen() {
  const tabBarHeight = useBottomTabBarHeight();

  const [selectedEvent, setSelectedEvent] = useState<EventStudentItem | null>(
    null,
  );

  const [createModalVisible, setCreateModalVisible] = useState(false);
  
    const [searchText, setSearchText] = useState('');
  
    const eventsBase = useMemo(() => [...EVENTS_SEED], []);
  
    const { filtered: filteredEvents } = useEventSearch({
    events: eventsBase,
    query: searchText,
    });
    const [sectionFilter, setSectionFilter] = useState({
    today: true,
    week: true,
    upcoming: true,
  });

  const now = new Date();
  const endOfWeek = getEndOfWeek(now);

  const todayEvents: EventStudentItem[] = [];
  const weekEvents: EventStudentItem[] = [];
  const upcomingEvents: EventStudentItem[] = [];

  for (const e of filteredEvents) {
  const d = new Date(e.startsAtIso);

  if (sectionFilter.today && isSameLocalDay(now, d)) {
    todayEvents.push(e);
    continue;
  }

  if (
    sectionFilter.week &&
    d.getTime() > now.getTime() &&
    d.getTime() <= endOfWeek.getTime()
  ) {
    weekEvents.push(e);
    continue;
  }

  if (sectionFilter.upcoming && d.getTime() > endOfWeek.getTime()) {
    upcomingEvents.push(e);
  }
}

  const sortByDate = (a: EventStudentItem, b: EventStudentItem) =>
    new Date(a.startsAtIso).getTime() - new Date(b.startsAtIso).getTime();

  todayEvents.sort(sortByDate);
  weekEvents.sort(sortByDate);
  upcomingEvents.sort(sortByDate);

  function handleOpenEvent(event: EventStudentItem) {
    setSelectedEvent(event);
  }

  function handleCloseDetail() {
    setSelectedEvent(null);
  }

  function renderEventCard(event: EventStudentItem) {
    return (
      <View key={event.id} className="mb-3 w-full">
        {event.imageUrl ? (
          <EventCardWithImage event={event} onPress={handleOpenEvent} />
        ) : (
          <EventCardNoImage event={event} onPress={handleOpenEvent} />
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <View className="flex-1 bg-slate-50 dark:bg-slate-900">
        <StatusBar style="auto" />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 8,
          }}
          scrollIndicatorInsets={{ bottom: tabBarHeight }}
        >
          {/* Título principal */}
          <Text className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Eventos
          </Text>
          <View className="mt-2 h-1.5 w-28 rounded-full bg-emerald-500 dark:bg-emerald-400" />
          <Text className="mt-4 text-base text-slate-600 dark:text-slate-300">
            Revise los eventos de hoy, de esta semana y los próximos.
          </Text>

          <EventsSearchBar value={searchText} onChange={setSearchText} />
          <EventsSectionChecklist value={sectionFilter} onChange={setSectionFilter} />
          {searchText.trim().length > 0 &&
          todayEvents.length + weekEvents.length + upcomingEvents.length === 0 ? (
          <View className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
          <Text className="text-sm text-slate-700 dark:text-slate-200">
          No se encontraron eventos con “{searchText}”.
          </Text>
          </View>
          ) : null}

          {/* Sección: Hoy */}
          <View className="mt-8">
            <View className="mb-4 flex-row items-end justify-between">
              <View>
                <Text className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  Hoy
                </Text>
                <View className="mt-2 h-1 w-28 rounded-full bg-slate-300 dark:bg-slate-600" />
              </View>
              <Text className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-300">
                {todayEvents.length} evento(s)
              </Text>
            </View>

            {todayEvents.length === 0 ? (
              <View className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                <Text className="text-sm text-slate-700 dark:text-slate-200">
                  No hay eventos programados para hoy.
                </Text>
              </View>
            ) : (
              <View className="flex-col">
                {todayEvents.map(renderEventCard)}
              </View>
            )}
          </View>

          {/* Sección: Esta semana */}
          <View className="mt-10">
            <View className="mb-4 flex-row items-end justify-between">
              <View>
                <Text className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  Esta semana
                </Text>
                <View className="mt-2 h-1 w-28 rounded-full bg-slate-300 dark:bg-slate-600" />
              </View>
              <Text className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-300">
                {weekEvents.length} evento(s)
              </Text>
            </View>

            {weekEvents.length === 0 ? (
              <View className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                <Text className="text-sm text-slate-700 dark:text-slate-200">
                  No hay eventos programados para esta semana.
                </Text>
              </View>
            ) : (
              <View className="flex-col">
                {weekEvents.map(renderEventCard)}
              </View>
            )}
          </View>

          {/* Sección: Eventos próximos */}
          <View className="mt-10">
            <View className="mb-4 flex-row items-end justify-between">
              <View>
                <Text className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  Eventos próximos
                </Text>
                <View className="mt-2 h-1 w-28 rounded-full bg-slate-300 dark:bg-slate-600" />
              </View>
              <Text className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-300">
                {upcomingEvents.length} evento(s)
              </Text>
            </View>

            {upcomingEvents.length === 0 ? (
              <View className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                <Text className="text-sm text-slate-700 dark:text-slate-200">
                  No hay eventos próximos por ahora.
                </Text>
              </View>
            ) : (
              <View className="flex-col">
                {upcomingEvents.map(renderEventCard)}
              </View>
            )}
          </View>
        </ScrollView>

        <EventDetailModal
          visible={!!selectedEvent}
          event={selectedEvent}
          onClose={handleCloseDetail}
        />
      </View>
    </SafeAreaView>
  );
}
