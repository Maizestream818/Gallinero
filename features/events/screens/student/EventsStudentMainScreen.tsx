// features/events/screens/student/EventsStudentMainScreen.tsx
import { EventCard, type Event } from '@/features/events/components/EventCard';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Pressable, ScrollView, SectionList, Text, View } from 'react-native';

type EventSection = {
  title: string; // "Hoy", "Esta semana", "Próximos"
  data: Event[];
};

// Muchos datos de ejemplo para el estudiante (para probar scroll)
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
      {
        id: '2',
        title: 'Laboratorio de pruebas con Expo',
        date: '28 nov 2025',
        time: '12:00',
        location: 'Laboratorio de cómputo 1',
        description: 'Pruebas de hot reload, navegación y estilos.',
      },
      {
        id: '3',
        title: 'Sesión de dudas de proyecto',
        date: '28 nov 2025',
        time: '13:30',
        location: 'Oficina del profesor',
        description: 'Resolución de dudas generales del proyecto final.',
      },
      {
        id: '4',
        title: 'Revisión de UI con NativeWind',
        date: '28 nov 2025',
        time: '16:00',
        location: 'Aula 5',
        description: 'Ajuste de estilos y colores para la app.',
      },
      {
        id: '5',
        title: 'Práctica de Git y ramas',
        date: '28 nov 2025',
        time: '18:00',
        location: 'Sala de estudio',
        description: 'Uso de ramas, merge y resolución de conflictos.',
      },
    ],
  },
  {
    title: 'Esta semana',
    data: [
      {
        id: '6',
        title: 'Taller de UI con NativeWind',
        date: '30 nov 2025',
        time: '16:00',
        location: 'Laboratorio de cómputo',
        description: 'Buenas prácticas de diseño de interfaces móviles.',
      },
      {
        id: '7',
        title: 'Revisión de proyecto final',
        date: '02 dic 2025',
        time: '12:00',
        location: 'Oficina del profesor',
        description: 'Entrega de avances del proyecto de la app.',
      },
      {
        id: '8',
        title: 'Sesión de testing en dispositivos físicos',
        date: '03 dic 2025',
        time: '09:00',
        location: 'Laboratorio móvil',
        description: 'Pruebas en diferentes modelos de teléfono.',
      },
      {
        id: '9',
        title: 'Charla: Buenas prácticas en React',
        date: '03 dic 2025',
        time: '11:00',
        location: 'Auditorio pequeño',
        description: 'Patrones de diseño y organización de archivos.',
      },
      {
        id: '10',
        title: 'Práctica de AsyncStorage',
        date: '04 dic 2025',
        time: '14:00',
        location: 'Laboratorio de cómputo 2',
        description: 'Persistencia de datos en dispositivos móviles.',
      },
      {
        id: '11',
        title: 'Integración con APIs REST',
        date: '04 dic 2025',
        time: '16:00',
        location: 'Aula 2',
        description: 'Consumo de endpoints desde React Native.',
      },
      {
        id: '12',
        title: 'Revisión de diseño de base de datos',
        date: '05 dic 2025',
        time: '10:00',
        location: 'Biblioteca',
        description: 'Normalización y relaciones entre tablas.',
      },
      {
        id: '13',
        title: 'Sesión de debugging con Flipper',
        date: '05 dic 2025',
        time: '12:00',
        location: 'Laboratorio de cómputo 3',
        description: 'Uso de herramientas para depurar la app.',
      },
      {
        id: '14',
        title: 'Prueba piloto de la app',
        date: '06 dic 2025',
        time: '09:30',
        location: 'Aula de demostraciones',
        description: 'Test con usuarios reales y retroalimentación.',
      },
      {
        id: '15',
        title: 'Reunión de equipo de proyecto',
        date: '06 dic 2025',
        time: '13:00',
        location: 'Cafetería',
        description: 'Ajuste de tareas, roles y tiempos de entrega.',
      },
    ],
  },
  {
    title: 'Próximos',
    data: [
      {
        id: '16',
        title: 'Demo de aplicaciones móviles',
        date: '10 dic 2025',
        time: '09:30',
        location: 'Auditorio principal',
        description: 'Presentación de proyectos a todo el grupo.',
      },
      {
        id: '17',
        title: 'Concurso interno de apps',
        date: '12 dic 2025',
        time: '11:00',
        location: 'Auditorio principal',
        description: 'Presentación de las mejores aplicaciones del curso.',
      },
      {
        id: '18',
        title: 'Taller avanzado de animaciones',
        date: '14 dic 2025',
        time: '15:00',
        location: 'Laboratorio de cómputo 4',
        description: 'Uso de Reanimated y gestos avanzados.',
      },
      {
        id: '19',
        title: 'Charla con egresados',
        date: '15 dic 2025',
        time: '17:00',
        location: 'Sala de conferencias',
        description: 'Experiencias reales en la industria de desarrollo móvil.',
      },
      {
        id: '20',
        title: 'Entrega final de proyecto',
        date: '18 dic 2025',
        time: '10:00',
        location: 'Oficina del profesor',
        description: 'Evaluación completa del proyecto de la app.',
      },
      {
        id: '21',
        title: 'Sesión de feedback individual',
        date: '19 dic 2025',
        time: '12:00',
        location: 'Oficina del profesor',
        description: 'Comentarios personalizados del desempeño del curso.',
      },
      {
        id: '22',
        title: 'Expo de proyectos de la facultad',
        date: '20 dic 2025',
        time: '09:00',
        location: 'Pasillos principales',
        description: 'Exposición general de proyectos de diferentes materias.',
      },
      {
        id: '23',
        title: 'Taller de portafolio profesional',
        date: '08 ene 2026',
        time: '11:00',
        location: 'Aula de cómputo',
        description: 'Cómo presentar tus proyectos en un portafolio.',
      },
      {
        id: '24',
        title: 'Sesión de preparación de CV',
        date: '10 ene 2026',
        time: '13:00',
        location: 'Sala de orientación',
        description: 'Revisión de currículum para vacantes de desarrollo.',
      },
      {
        id: '25',
        title: 'Simulacro de entrevista técnica',
        date: '12 ene 2026',
        time: '16:00',
        location: 'Laboratorio de cómputo',
        description: 'Preguntas técnicas y resolución de ejercicios en vivo.',
      },
      {
        id: '26',
        title: 'Workshop: Deploy de apps',
        date: '15 ene 2026',
        time: '09:30',
        location: 'Laboratorio de cómputo',
        description: 'Publicación de apps en tiendas oficiales.',
      },
      {
        id: '27',
        title: 'Semana de innovación tecnológica',
        date: '20 ene 2026',
        time: '10:00',
        location: 'Centro de innovación',
        description: 'Charlas y exposiciones de nuevas tecnologías.',
      },
      {
        id: '28',
        title: 'Hackathon interno',
        date: '25 ene 2026',
        time: '08:00',
        location: 'Auditorio principal',
        description: 'Competencia de desarrollo con límite de tiempo.',
      },
      {
        id: '29',
        title: 'Reunión informativa de residencias',
        date: '30 ene 2026',
        time: '12:00',
        location: 'Sala de juntas',
        description: 'Explicación del proceso de residencias profesionales.',
      },
      {
        id: '30',
        title: 'Cierre de curso y retroalimentación',
        date: '05 feb 2026',
        time: '11:30',
        location: 'Aula 3',
        description: 'Última sesión del curso y comentarios generales.',
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
