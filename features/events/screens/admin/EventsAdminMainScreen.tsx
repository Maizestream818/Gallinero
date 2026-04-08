// features/events/screens/admin/EventsAdminMainScreen.tsx
// Pantalla principal de eventos para el administrador.
// Muestra secciones (Hoy / Esta semana / Próximos) con cards en grid de 2 columnas.
// Incluye botones flotantes para crear evento y escanear QR, más sus respectivos modales.

import { AdminCreateEventFormModal } from '@/features/events/components/AdminCreateEventFormModal';
import { EventCardNoImage } from '@/features/events/components/EventCardNoImage';
import { EventCardWithImage } from '@/features/events/components/EventCardWithImage';
import { EventDetailModal } from '@/features/events/components/EventDetailModal';
import { QRCodeScannerButton } from '@/features/events/components/QRCodeScannerButton';
import { ScannedStudentModal } from '@/features/events/components/ScannedStudentModal';
import { EVENTS_SEED } from '@/features/events/data/EventSeed';
import { useEventFilters } from '@/features/events/hooks/useEventFilters';
import type { EventStudentItem } from '@/features/events/types/eventTypes';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import type { UserProfile } from '@/features/user/types/user-profile';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EventsAdminMainScreen() {
  const insets = useSafeAreaInsets();

  // ── Estado de modales ──────────────────────────────────────────────────────
  const [selectedEvent, setSelectedEvent] = useState<EventStudentItem | null>(
    null,
  );
  const [createVisible, setCreateVisible] = useState(false);
  const [scannedStudent, setScannedStudent] = useState<UserProfile | null>(
    null,
  );
  const [scanNotFound, setScanNotFound] = useState(false);
  const [scanModalVisible, setScanModalVisible] = useState(false);

  // ── Clasificación de eventos por sección ───────────────────────────────────
  const { today, week, upcoming } = useEventFilters({
    events: EVENTS_SEED,
    query: '',
    sections: { today: true, week: true, upcoming: true },
  });

  // ── Grid de 2 columnas ────────────────────────────────────────────────────
  const renderGrid = (events: EventStudentItem[]) => {
    if (events.length === 0) {
      return (
        <View className="py-4">
          <Text className="text-sm text-slate-400 dark:text-slate-500">
            Sin eventos en esta sección.
          </Text>
        </View>
      );
    }

    return (
      <View className="flex-row flex-wrap gap-3 pt-3">
        {events.map((event) =>
          event.imageUrl ? (
            <View key={event.id} style={{ width: '47%' }}>
              <EventCardWithImage event={event} onPress={setSelectedEvent} />
            </View>
          ) : (
            <View key={event.id} style={{ width: '47%' }}>
              <EventCardNoImage event={event} onPress={setSelectedEvent} />
            </View>
          ),
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-slate-50 dark:bg-slate-900">
      {/* Header de Saul */}
      <ScreenHeader title="Eventos" />

      {/* Contenido con scroll */}
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 140,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Sección: Hoy */}
        <SectionHeader title="Hoy" count={today.length} />
        {renderGrid(today)}

        {/* Sección: Esta semana */}
        <View className="mt-6">
          <SectionHeader title="Esta semana" count={week.length} />
          {renderGrid(week)}
        </View>

        {/* Sección: Próximos */}
        <View className="mt-6">
          <SectionHeader title="Próximos" count={upcoming.length} />
          {renderGrid(upcoming)}
        </View>
      </ScrollView>

      {/* FABs apilados — esquina inferior derecha */}
      <View
        style={{
          position: 'absolute',
          right: 20,
          bottom: insets.bottom + 16,
          alignItems: 'center',
          gap: 12,
        }}
      >
        {/* Botón: escanear QR de alumno */}
        <QRCodeScannerButton
          onStudentScanned={(result) => {
            setScannedStudent(result.found ? result.student : null);
            setScanNotFound(!result.found);
            setScanModalVisible(true);
          }}
        />

        {/* Botón: crear evento */}
        <Pressable
          onPress={() => setCreateVisible(true)}
          className="h-14 w-14 items-center justify-center rounded-full bg-blue-500 shadow-xl dark:bg-blue-400"
        >
          <Text className="text-2xl font-bold text-white">＋</Text>
        </Pressable>
      </View>

      {/* Modal: crear evento */}
      <AdminCreateEventFormModal
        visible={createVisible}
        onClose={() => setCreateVisible(false)}
      />

      {/* Modal: alumno escaneado */}
      <ScannedStudentModal
        visible={scanModalVisible}
        student={scannedStudent}
        notFound={scanNotFound}
        onClose={() => {
          setScanModalVisible(false);
          setScannedStudent(null);
          setScanNotFound(false);
        }}
      />

      {/* Modal: detalle de evento */}
      <EventDetailModal
        visible={!!selectedEvent}
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </View>
  );
}
