// features/events/screens/admin/EventsAdminMainScreen.tsx

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AdminCreateEventFormModal } from '../../components/AdminCreateEventFormModal';
import { CategoryFilter } from '../../components/CategoryFilter';
import { EventsSectionChecklist } from '../../components/EventsSectionChecklist';
import { QRCodeScannerButton } from '../../components/QRCodeScannerButton';
import { ScannedStudentModal } from '../../components/ScannedStudentModal';
import { EventCardNoImage } from '@/features/events/components/EventCardNoImage';
import { EventCardWithImage } from '@/features/events/components/EventCardWithImage';
import { EventDetailModal } from '@/features/events/components/EventDetailModal';
import { EventsSearchBar } from '@/features/events/components/EventsSearchBar';
import { EVENTS_SEED } from '@/features/events/data/EventSeed';
import { useEventFilters } from '@/features/events/hooks/useEventFilters';
import type { EventStudentItem } from '@/features/events/types/eventTypes';
import type { UserProfile } from '@/features/user/types/user-profile';

export default function EventsAdminMainScreen() {
  const tabBarHeight = useBottomTabBarHeight();

  // ── Estado: detalle de evento ──
  const [selectedEvent, setSelectedEvent] = useState<EventStudentItem | null>(null);

  // ── Estado: crear evento ──
  const [createModalVisible, setCreateModalVisible] = useState(false);

  // ── Estado: filtros ──
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sectionFilter, setSectionFilter] = useState({
    today: true,
    week: true,
    upcoming: true,
  });

  // ── Estado: resultado de escaneo ──
  const [scannedStudent, setScannedStudent] = useState<UserProfile | null>(null);
  const [scanNotFound, setScanNotFound] = useState(false);

  // ── Datos ──
  const eventsBase = useMemo(() => {
    if (!categoryFilter) return [...EVENTS_SEED];
    return EVENTS_SEED.filter((e) => e.tags?.includes(categoryFilter));
  }, [categoryFilter]);

  const { today: todayEvents, week: weekEvents, upcoming: upcomingEvents, totalFiltered } =
    useEventFilters({ events: eventsBase, query: searchText, sections: sectionFilter });

  // ── Handlers ──
  function handleStudentScanned(result: { found: true; student: UserProfile } | { found: false }) {
    if (result.found) {
      setScannedStudent(result.student);
      setScanNotFound(false);
    } else {
      setScannedStudent(null);
      setScanNotFound(true);
    }
  }

  function handleCloseScannedModal() {
    setScannedStudent(null);
    setScanNotFound(false);
  }

  function renderEventCard(event: EventStudentItem) {
    return (
      <View key={event.id} className="mb-3 w-full">
        {event.imageUrl ? (
          <EventCardWithImage event={event} onPress={setSelectedEvent} />
        ) : (
          <EventCardNoImage event={event} onPress={setSelectedEvent} />
        )}
      </View>
    );
  }

  const sections = [
    { title: 'Hoy', data: todayEvents },
    { title: 'Esta semana', data: weekEvents },
    { title: 'Próximos', data: upcomingEvents },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <View className="flex-1 bg-slate-50 dark:bg-slate-900">
        <StatusBar style="auto" />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 120,
          }}
          scrollIndicatorInsets={{ bottom: tabBarHeight }}
        >
          <Text className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Eventos
          </Text>
          <View className="mt-2 h-1.5 w-28 rounded-full bg-emerald-500 dark:bg-emerald-400" />

          <CategoryFilter categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} />
          <EventsSearchBar value={searchText} onChange={setSearchText} />
          <EventsSectionChecklist value={sectionFilter} onChange={setSectionFilter} />

          {totalFiltered === 0 && (
            <View className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
              <Text className="text-sm text-slate-700 dark:text-slate-200">
                No se encontraron eventos.
              </Text>
            </View>
          )}

          {sections.map((s) => (
            <View key={s.title} className="mt-8">
              <Text className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-50">
                {s.title}
              </Text>
              {s.data.length === 0 ? (
                <View className="rounded-xl border border-dashed border-slate-200 bg-white p-4 dark:bg-slate-800">
                  <Text className="text-center text-slate-400">Sin eventos</Text>
                </View>
              ) : (
                s.data.map(renderEventCard)
              )}
            </View>
          ))}
        </ScrollView>

        {/* ── Modales ── */}
        <EventDetailModal
          visible={!!selectedEvent}
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />

        <AdminCreateEventFormModal
          visible={createModalVisible}
          onClose={() => setCreateModalVisible(false)}
        />

        {/* Modal resultado de escaneo — se abre tanto si encontró alumno como si no */}
        <ScannedStudentModal
          visible={!!scannedStudent || scanNotFound}
          student={scannedStudent}
          notFound={scanNotFound}
          onClose={handleCloseScannedModal}
        />

        {/* ── Botones flotantes ── */}
        <View
          style={{ position: 'absolute', bottom: 24, right: 24, alignItems: 'center', gap: 12 }}
        >
          {/* Botón crear evento */}
          <Pressable
            onPress={() => setCreateModalVisible(true)}
            className="h-14 w-14 items-center justify-center rounded-full bg-blue-500 shadow-xl dark:bg-blue-400"
          >
            <Text className="text-3xl font-bold text-white">+</Text>
          </Pressable>

          {/* Botón escanear QR — notifica resultado hacia arriba */}
          <QRCodeScannerButton onStudentScanned={handleStudentScanned} />
        </View>
      </View>
    </SafeAreaView>
  );
}
