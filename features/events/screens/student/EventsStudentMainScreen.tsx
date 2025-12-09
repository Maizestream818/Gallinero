// features/events/screens/student/EventsStudentMainScreen.tsx

import { EventCard, type Event } from '@/features/events/components/EventCard';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, SectionList, Text, View } from 'react-native';

import { parseFind, type ParseBaseFields } from '@/lib/parseClient';

type SectionTitle = 'Hoy' | 'Esta semana' | 'Próximos';

type EventSection = {
  title: SectionTitle;
  data: Event[];
};

// Lo que viene de Back4App
type EventRecord = ParseBaseFields & {
  title?: string;
  date?: string;
  time?: string;
  location?: string;
  description?: string;
  section?: SectionTitle | string;
};

export function EventsStudentMainScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [sections, setSections] = useState<EventSection[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const closeDetail = () => setSelectedEvent(null);

  // ─────────────────────────────────────────────
  // Cargar eventos desde Back4App
  // ─────────────────────────────────────────────
  const loadEventsFromDatabase = async () => {
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const results = await parseFind<EventRecord>('Event');

      const mapped: (Event & { section: SectionTitle })[] = results.map(
        (item) => {
          const rawSection = item.section;
          let section: SectionTitle = 'Próximos';

          if (rawSection === 'Hoy' || rawSection === 'Esta semana') {
            section = rawSection;
          } else if (rawSection === 'Próximos') {
            section = 'Próximos';
          }

          return {
            id: item.objectId,
            title: item.title ?? 'Sin título',
            date: item.date ?? '',
            time: item.time ?? '',
            location: item.location ?? '',
            description: item.description ?? '',
            section,
          };
        },
      );

      const hoy: Event[] = [];
      const semana: Event[] = [];
      const proximos: Event[] = [];

      for (const ev of mapped) {
        if (ev.section === 'Hoy') hoy.push(ev);
        else if (ev.section === 'Esta semana') semana.push(ev);
        else proximos.push(ev);
      }

      const newSections: EventSection[] = [];
      if (hoy.length) newSections.push({ title: 'Hoy', data: hoy });
      if (semana.length)
        newSections.push({ title: 'Esta semana', data: semana });
      if (proximos.length)
        newSections.push({ title: 'Próximos', data: proximos });

      setSections(newSections);
    } catch (err: any) {
      console.error('Error cargando eventos (student)', err);
      setErrorMsg(String(err?.message ?? err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEventsFromDatabase();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEventsFromDatabase();
    setRefreshing(false);
  };

  return (
    <View className={`flex-1 ${isDark ? 'bg-slate-950' : 'bg-sky-100'}`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <SectionList<Event, EventSection>
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 32,
          paddingTop: 40,
        }}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={(event) => {
              setSelectedEvent(event);
            }}
          />
        )}
        renderSectionHeader={({ section }) => (
          <Text
            className={`mt-4 mb-2 text-sm font-bold ${
              isDark ? 'text-slate-200' : 'text-slate-700'
            }`}
          >
            {section.title}
          </Text>
        )}
        ListHeaderComponent={
          <View className="mb-2">
            <Text
              className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Eventos (Alumno)
            </Text>
            <Text
              className={`mt-1 text-xs ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Hoy, esta semana y próximos eventos.
            </Text>

            {isLoading && (
              <Text
                className={`mt-2 text-xs ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Cargando eventos...
              </Text>
            )}

            {errorMsg && (
              <Text className="mt-2 text-xs font-semibold text-red-400">
                Error al cargar eventos: {errorMsg}
              </Text>
            )}
          </View>
        }
        ListEmptyComponent={
          !isLoading ? (
            <View className="flex-1 items-center justify-center py-16">
              <Text
                className={`text-base ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                No hay eventos programados.
              </Text>
            </View>
          ) : null // 👈 aquí el cambio importante
        }
      />

      {/* VENTANA DE DETALLE */}
      {selectedEvent && (
        <View
          className={`absolute inset-0 ${
            isDark ? 'bg-slate-950/95' : 'bg-sky-100/95'
          }`}
        >
          <View className="flex-1 justify-center px-4">
            <View
              className={`rounded-2xl border ${
                isDark
                  ? 'border-slate-700 bg-slate-900'
                  : 'border-sky-200 bg-white'
              }`}
              style={{ maxHeight: 520 }}
            >
              <ScrollView contentContainerStyle={{ padding: 16 }}>
                <Pressable
                  onPress={closeDetail}
                  className={`mb-2 self-end rounded-full px-4 py-2 active:opacity-80 ${
                    isDark ? 'bg-slate-800' : 'bg-slate-200'
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      isDark ? 'text-slate-100' : 'text-slate-800'
                    }`}
                  >
                    Cerrar
                  </Text>
                </Pressable>

                <Text
                  className={`text-xs font-semibold ${
                    isDark ? 'text-sky-400' : 'text-sky-600'
                  }`}
                >
                  {selectedEvent.time
                    ? `${selectedEvent.date} • ${selectedEvent.time}`
                    : selectedEvent.date}
                </Text>

                <Text
                  className={`mt-2 text-2xl font-bold ${
                    isDark ? 'text-slate-50' : 'text-slate-900'
                  }`}
                >
                  {selectedEvent.title}
                </Text>

                {selectedEvent.location ? (
                  <Text
                    className={`mt-1 text-sm font-semibold ${
                      isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    {selectedEvent.location}
                  </Text>
                ) : null}

                <Text
                  className={`mt-4 text-sm leading-relaxed ${
                    isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  {selectedEvent.description ?? 'Sin descripción disponible.'}
                </Text>

                <View
                  className={`mt-6 rounded-2xl border p-4 ${
                    isDark
                      ? 'border-slate-700 bg-slate-800'
                      : 'border-sky-200 bg-sky-50'
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      isDark ? 'text-slate-100' : 'text-slate-900'
                    }`}
                  >
                    Información adicional
                  </Text>
                  <Text
                    className={`mt-2 text-xs ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
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
