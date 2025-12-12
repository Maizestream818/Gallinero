import { EventCard, type Event } from '@/features/events/components/EventCard';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  SectionList,
  Text,
  View,
} from 'react-native';

// Tipo de evento
type SectionTitle = 'Hoy' | 'Esta semana' | 'Próximos';

type EventSection = {
  title: SectionTitle;
  data: Event[];
};

export function EventsAdminMainScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [sections, setSections] = useState<EventSection[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [newEvent, setNewEvent] = useState<{
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    section: SectionTitle;
  }>({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    section: 'Hoy',
  });

  // Obtener eventos desde el backend (con googleEventId)
  // Obtener eventos desde el backend (con googleEventId)
  useEffect(() => {
    fetch('http://10.147.18.126:3000/api/calendar/events')
      .then((res) => res.json())
      .then((data) => {
        // Aquí, 'event' sigue siendo 'any' porque viene de la API,
        // pero el resultado 'eventsWithGoogleId' es de tipo Event[]
        const eventsWithGoogleId: Event[] = data.map((event: any) => ({
          ...event,
          googleEventId: event.id,
        }));

        // ✨ CORRECCIÓN AQUÍ: Se añade el tipo 'Event' al parámetro 'event'
        const todayEvents = eventsWithGoogleId.filter(
          (event: Event) => event.date === 'Hoy',
        );

        // ✨ Y AQUÍ: Se añade el tipo 'Event' al parámetro 'event'
        const weekEvents = eventsWithGoogleId.filter(
          (event: Event) => event.date !== 'Hoy',
        ); // O ajusta esto para "esta semana"

        setSections([
          { title: 'Hoy', data: todayEvents },
          { title: 'Esta semana', data: weekEvents },
        ]);
      })
      .catch((err) => console.error('Error al obtener eventos:', err));
  }, []);
  // Crear evento
  const handleCreateEvent = async () => {
    if (!newEvent.date || !newEvent.time) {
      Alert.alert('Datos incompletos', 'Seleccione la fecha y la hora.');
      return;
    }

    try {
      const res = await fetch('http://10.147.18.126:3000/api/calendar/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error creando evento');

      Alert.alert('Evento creado', 'El evento se registró correctamente.');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo crear el evento.');
    }
  };

  // Editar evento
  // ✨ CORRECCIÓN AQUÍ: Se añade el tipo 'Event' al parámetro.
  const handleEditEvent = async (event: Event) => {
    const res = await fetch(
      `http://10.147.18.126:3000/api/calendar/events/${event.googleEventId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      },
    );

    const data = await res.json();
    if (res.ok) {
      Alert.alert(
        'Evento actualizado',
        'Se ha actualizado el evento correctamente.',
      );
      setSelectedEvent(null); // Cerrar detalle
    } else {
      Alert.alert('Error', 'Hubo un error al actualizar el evento.');
    }
  };

  // Eliminar evento
  const handleDeleteEvent = async (eventId: string) => {
    const res = await fetch(
      `http://10.147.18.126:3000/api/calendar/events/${eventId}`,
      {
        method: 'DELETE',
      },
    );

    const data = await res.json();
    if (res.ok) {
      Alert.alert('Evento eliminado', 'El evento se eliminó correctamente.');
      setSelectedEvent(null); // Cerrar detalle
    } else {
      Alert.alert('Error', 'Hubo un error al eliminar el evento.');
    }
  };

  return (
    <View className={`flex-1 ${isDark ? 'bg-slate-950' : 'bg-sky-100'}`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
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
              className={`mt-4 mb-2 text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}
            >
              {section.title}
            </Text>
          )}
          ListHeaderComponent={
            <View className="mb-2">
              <Text
                className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}
              >
                Eventos (Admin)
              </Text>
              <Text
                className={`mt-1 text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
              >
                Hoy, esta semana y próximos eventos.
              </Text>

              <Pressable
                onPress={handleCreateEvent}
                className="mt-3 self-start rounded-full bg-emerald-600 px-4 py-2 active:opacity-80"
              >
                <Text className="text-xs font-semibold text-white">
                  Agregar evento
                </Text>
              </Pressable>
            </View>
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-16">
              <Text
                className={`text-base ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
              >
                No hay eventos programados.
              </Text>
            </View>
          }
        />
      </ScrollView>

      {/* Detalle del evento seleccionado */}
      {selectedEvent && (
        <View
          className={`absolute inset-0 ${isDark ? 'bg-slate-950/95' : 'bg-sky-100/95'}`}
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
                  onPress={() => setSelectedEvent(null)}
                  className={`mb-2 self-end rounded-full px-4 py-2 active:opacity-80 ${
                    isDark ? 'bg-slate-800' : 'bg-slate-200'
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}
                  >
                    Cerrar
                  </Text>
                </Pressable>

                <Text
                  className={`text-xs font-semibold ${isDark ? 'text-sky-400' : 'text-sky-600'}`}
                >
                  {selectedEvent.time
                    ? `${selectedEvent.date} • ${selectedEvent.time}`
                    : selectedEvent.date}
                </Text>

                <Text
                  className={`mt-2 text-2xl font-bold ${isDark ? 'text-slate-50' : 'text-slate-900'}`}
                >
                  {selectedEvent.title}
                </Text>

                {selectedEvent.location && (
                  <Text
                    className={`mt-1 text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                  >
                    {selectedEvent.location}
                  </Text>
                )}

                <Text
                  className={`mt-4 text-sm leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-700'}`}
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
                    className={`text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}
                  >
                    Información adicional
                  </Text>
                  <Text
                    className={`mt-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
                  >
                    Aquí después puede agregar más campos: profesor, tipo de
                    evento, enlace a videollamada, etc.
                  </Text>
                </View>

                {/* Botones para editar y eliminar */}
                <View className="mt-6 flex-row justify-between gap-2">
                  <Pressable
                    onPress={() => handleEditEvent(selectedEvent)}
                    className="flex-1 items-center rounded-full bg-blue-500 px-4 py-3 active:opacity-80"
                  >
                    <Text className="text-sm font-semibold text-white">
                      Editar
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() =>
                      handleDeleteEvent(selectedEvent.googleEventId)
                    }
                    className="flex-1 items-center rounded-full bg-red-500 px-4 py-3 active:opacity-80"
                  >
                    <Text className="text-sm font-semibold text-white">
                      Eliminar
                    </Text>
                  </Pressable>
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
