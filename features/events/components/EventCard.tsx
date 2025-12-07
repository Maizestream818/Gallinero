// EventCard.tsx
import React from 'react';
import { Pressable, Text, View } from 'react-native';
// ⬅️ NUEVO: mismo hook que usas en _layout y en EventsAdminMainScreen
import { useColorScheme } from '@/hooks/use-color-scheme';

export type Event = {
  id: string;
  title: string;
  date: string; // Ej: "28 nov 2025" o "2025-11-28"
  time?: string; // Ej: "18:30"
  location?: string; // Ej: "Auditorio A"
  description?: string;
};

type Props = {
  event: Event;
  onPress?: (event: Event) => void;
};

export function EventCard({ event, onPress }: Props) {
  const { title, date, time, location, description } = event;

  // ⬅️ NUEVO: respetar modo claro / oscuro
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Pressable
      onPress={() => onPress?.(event)}
      className={`mb-3 rounded-2xl border p-4 active:opacity-80 ${isDark ? 'border-slate-700 bg-slate-800' : 'border-sky-200 bg-white'} `}
    >
      {/* Fecha y hora */}
      <View className="flex-row items-center justify-between">
        <Text
          className={`text-xs font-semibold ${
            isDark ? 'text-sky-400' : 'text-sky-600'
          }`}
        >
          {time ? `${date} • ${time}` : date}
        </Text>

        {location ? (
          <Text
            className={`ml-2 text-[10px] font-medium ${
              isDark ? 'text-slate-300' : 'text-slate-500'
            }`}
            numberOfLines={1}
          >
            {location}
          </Text>
        ) : null}
      </View>

      {/* Título */}
      <Text
        className={`mt-1 text-lg font-bold ${
          isDark ? 'text-slate-50' : 'text-slate-900'
        }`}
        numberOfLines={2}
      >
        {title}
      </Text>

      {/* Descripción corta */}
      {description ? (
        <Text
          className={`mt-2 text-sm ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
          numberOfLines={2}
        >
          {description}
        </Text>
      ) : null}
    </Pressable>
  );
}
