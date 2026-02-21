// features/events/screens/admin/EventsAdminMainScreen.tsx
// Pantalla principal de eventos para administrador (Admin).
// - Lista eventos en secciones "Hoy", "Esta semana" y "Eventos próximos".
// - Usa EventCardWithImage / EventCardNoImage.
// - Las cards se muestran en un grid de 1 columna.
// - Al tocar una card, abre el EventDetailModal (splash) con el detalle del evento.
// NOTA IMPORTANTE: Por ahora reutiliza EVENTS_SEED y el tipo EventStudentItem (mock). En backend se ajustará a modelo Admin.

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Componentes
import { AdminCreateEventFormModal } from '../../components/AdminCreateEventFormModal';
import { EventsSectionChecklist } from '../../components/EventsSectionChecklist';
import { EventsSearchBar } from '@/features/events/components/EventsSearchBar';
import { useEventSearch } from '@/hooks/useEventSearch';
import { EventCardNoImage } from '@/features/events/components/EventCardNoImage';
import { EventCardWithImage } from '@/features/events/components/EventCardWithImage';
import { EventDetailModal } from '@/features/events/components/EventDetailModal';
import { CategoryFilter } from '../../components/CategoryFilter';
import { QRCodeScannerButton } from '../../components/QRCodeScannerButton';

// Datos y Tipos
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

// -----------------------------------------------------------------------------
// Screen principal (Admin) - USANDO EXPORT DEFAULT PARA EXPO ROUTER
// -----------------------------------------------------------------------------

export default function EventsAdminMainScreen() {
  const tabBarHeight = useBottomTabBarHeight();

  // Estados
  const [selectedEvent, setSelectedEvent] = useState<EventStudentItem | null>(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sectionFilter, setSectionFilter] = useState({
    today: true,
    week: true,
    upcoming: true,
  });

  // Lógica de filtrado
  const eventsBase = useMemo(() => [...EVENTS_SEED], []);
  const { filtered: filteredEvents } = useEventSearch({
    events: eventsBase,
    query: searchText,
  });

  const now = new Date();
  const endOfWeek = getEndOfWeek(now);

  const filteredByTags = categoryFilter
    ? filteredEvents.filter((event) => event.tags && event.tags.includes(categoryFilter))
    : filteredEvents;

  const filteredEventsCount = filteredByTags.length;

  const todayEvents: EventStudentItem[] = [];
  const weekEvents: EventStudentItem[] = [];
  const upcomingEvents: EventStudentItem[] = [];

  for (const e of filteredByTags) {
    const d = new Date(e.startsAtIso);
    if (sectionFilter.today && isSameLocalDay(now, d)) {
      todayEvents.push(e);
      continue;
    }
    if (sectionFilter.week && d.getTime() > now.getTime() && d.getTime() <= endOfWeek.getTime()) {
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
            paddingBottom: 120, // Espacio extra para los botones flotantes
          }}
          scrollIndicatorInsets={{ bottom: tabBarHeight }}
        >
          <Text className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Eventos (Admin)
          </Text>
          <View className="mt-2 h-1.5 w-28 rounded-full bg-emerald-500 dark:bg-emerald-400" />
          
          <CategoryFilter categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} />
          <EventsSearchBar value={searchText} onChange={setSearchText} />
          <EventsSectionChecklist value={sectionFilter} onChange={setSectionFilter} />

          {filteredEventsCount === 0 && (
            <View className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <Text className="text-sm text-slate-700 dark:text-slate-200">
                No se encontraron eventos.
              </Text>
            </View>
          )}

          {/* Secciones de Eventos */}
          {[{title: 'Hoy', data: todayEvents}, {title: 'Esta semana', data: weekEvents}, {title: 'Próximos', data: upcomingEvents}].map((section, idx) => (
            <View key={idx} className="mt-8">
              <Text className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">{section.title}</Text>
              {section.data.length === 0 ? (
                <View className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-200">
                   <Text className="text-slate-400 text-center">Sin eventos</Text>
                </View>
              ) : (
                section.data.map(renderEventCard)
              )}
            </View>
          ))}
        </ScrollView>

        <EventDetailModal
          visible={!!selectedEvent}
          event={selectedEvent}
          onClose={handleCloseDetail}
        />

        {/* --- GRUPO DE ACCIONES FLOTANTES --- */}
        <View className="absolute bottom-6 right-6 items-center">
          
          {/* Botón de QR  */}
          <View className="mb-4 shadow-xl">
             <QRCodeScannerButton onScannerClose={() => {}} />
          </View>

          {/* Botón de nuevo evento  */}
<Pressable
          onPress={() => setCreateModalVisible(true)}
          className="absolute bottom-20 right--2 h-14 w-14 items-center justify-center rounded-full bg-emerald-500 shadow-2xl dark:bg-emerald-400"
        >
          <Text className="text-3xl font-bold text-white">+</Text>
        </Pressable>
        </View>

        <AdminCreateEventFormModal
          visible={createModalVisible}
          onClose={() => setCreateModalVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
}