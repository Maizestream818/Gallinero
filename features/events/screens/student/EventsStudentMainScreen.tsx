// features/events/screens/student/EventsStudentMainScreen.tsx
import { EventCard, type Event } from '@/features/events/components/EventCard';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Pressable, ScrollView, SectionList, Text, View } from 'react-native';

type EventSection = {
  title: string; // "Hoy", "Esta semana", "Próximos"
  data: Event[];
};

// Datos de ejemplo para el estudiante
const studentEventSections: EventSection[] = [
  {
    title: 'Hoy',
    data: [
      {
        id: '1',
        title: 'Clase de React Native',
        date: '28 nov 2025',
        time: '10:00',
        location: 'Aula 3',
        description: 'Repaso de componentes, props y estado.',
      },
    ],
  },
  {
    title: 'Esta semana',
    data: [
      {
        id: '2',
        title: 'Taller de UI con NativeWind',
        date: '30 nov 2025',
        time: '16:00',
        location: 'Laboratorio de cómputo',
        description: 'Buenas prácticas de diseño de interfaces móviles.',
      },
      {
        id: '3',
        title: 'Revisión de proyecto final',
        date: '02 dic 2025',
        time: '12:00',
        location: 'Oficina del profesor',
        description: 'Entrega de avances del proyecto de la app.',
      },
    ],
  },
  {
    title: 'Próximos',
    data: [
      {
        id: '4',
        title: 'Demo de aplicaciones móviles',
        date: '10 dic 2025',
        time: '09:30',
        location: 'Auditorio principal',
        description: 'Presentación de proyectos a todo el grupo.',
      },
    ],
  },
];

export function EventsStudentMainScreen() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const closeDetail = () => setSelectedEvent(null);

  return (
    <View className="flex-1 bg-slate-900">
      <StatusBar style="light" />

      {/* LISTA PRINCIPAL DE EVENTOS */}
      <SectionList
        sections={studentEventSections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={(event) => {
              // Abrimos la "ventana emergente" con los detalles
              setSelectedEvent(event);
            }}
          />
        )}
        renderSectionHeader={({ section }) => (
          <Text className="mt-4 mb-2 text-sm font-bold text-slate-200">
            {section.title}
          </Text>
        )}
        ListHeaderComponent={
          <View className="mb-2">
            <Text className="text-2xl font-bold text-white">
              Eventos (Student)
            </Text>
            <Text className="mt-1 text-xs text-slate-300">
              Hoy, esta semana y próximos eventos.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-16">
            <Text className="text-base text-slate-300">
              No hay eventos programados.
            </Text>
          </View>
        }
      />

      {/* VENTANA EMERGENTE / DETALLE DEL EVENTO */}
      {selectedEvent && (
        <View className="absolute inset-0 bg-slate-950/95">
          <View className="flex-1 justify-center px-4">
            <View
              className="rounded-2xl border border-slate-700 bg-slate-900"
              style={{ maxHeight: 520 }}
            >
              <ScrollView contentContainerStyle={{ padding: 16 }}>
                {/* Botón cerrar */}
                <Pressable
                  onPress={closeDetail}
                  className="mb-2 self-end rounded-full bg-slate-800 px-4 py-2 active:opacity-80"
                >
                  <Text className="text-xs font-semibold text-slate-100">
                    Cerrar
                  </Text>
                </Pressable>

                {/* Fecha y hora */}
                <Text className="text-xs font-semibold text-sky-400">
                  {selectedEvent.time
                    ? `${selectedEvent.date} • ${selectedEvent.time}`
                    : selectedEvent.date}
                </Text>

                {/* Título */}
                <Text className="mt-2 text-2xl font-bold text-slate-50">
                  {selectedEvent.title}
                </Text>

                {/* Lugar */}
                {selectedEvent.location ? (
                  <Text className="mt-1 text-sm font-semibold text-slate-300">
                    {selectedEvent.location}
                  </Text>
                ) : null}

                {/* Descripción */}
                <Text className="mt-4 text-sm leading-relaxed text-slate-200">
                  {selectedEvent.description ?? 'Sin descripción disponible.'}
                </Text>

                {/* Espacio para info extra futura */}
                <View className="mt-6 rounded-2xl border border-slate-700 bg-slate-800 p-4">
                  <Text className="text-sm font-semibold text-slate-100">
                    Información adicional
                  </Text>
                  <Text className="mt-2 text-xs text-slate-400">
                    Aquí después puede agregar más campos: profesor, tipo de
                    evento, enlace a videollamada, etc.
                  </Text>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
