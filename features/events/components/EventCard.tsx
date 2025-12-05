// EventCard.tsx
import React from 'react';
import { Pressable, Text, View } from 'react-native';

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

  return (
    <Pressable
      onPress={() => onPress?.(event)}
      className="mb-3 rounded-2xl border border-slate-700 bg-slate-800 p-4 active:opacity-80"
    >
      {/* Fecha y hora */}
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-semibold text-sky-400">
          {time ? `${date} • ${time}` : date}
        </Text>

        {location ? (
          <Text
            className="ml-2 text-[10px] font-medium text-slate-300"
            numberOfLines={1}
          >
            {location}
          </Text>
        ) : null}
      </View>

      {/* Título */}
      <Text className="mt-1 text-lg font-bold text-slate-50" numberOfLines={2}>
        {title}
      </Text>

      {/* Descripción corta */}
      {description ? (
        <Text className="mt-2 text-sm text-slate-300" numberOfLines={2}>
          {description}
        </Text>
      ) : null}
    </Pressable>
  );
}
