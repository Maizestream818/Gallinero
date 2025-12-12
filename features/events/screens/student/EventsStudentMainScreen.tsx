import { EventCard, type Event } from '@/features/events/components/EventCard';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ScrollView, SectionList, Text, View } from 'react-native';

type EventSection = {
  title: string;
  data: Event[];
};

export function EventsStudentMainScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    fetch('http://10.147.18.126:3000/api/calendar/events')
      .then((res) => res.json())
      .then(setEvents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <View className={`flex-1 ${isDark ? 'bg-slate-950' : 'bg-sky-100'}`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <SectionList
          sections={[{ title: 'Próximos eventos', data: events }]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <EventCard event={item} />}
          renderSectionHeader={({ section }) => (
            <Text
              className={`mt-4 mb-2 text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}
            >
              {section.title}
            </Text>
          )}
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
    </View>
  );
}
