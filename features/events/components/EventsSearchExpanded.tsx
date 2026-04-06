// features/events/components/EventsSearchExpanded.tsx
// Stub con placeholder visual — Saul conectará la lógica de búsqueda aquí.
// No modificar sin coordinar con Saul.

import React from 'react';
import { TextInput, View } from 'react-native';

export function EventsSearchExpanded() {
  return (
    <View className="flex-row items-center rounded-xl border border-blue-300 bg-blue-50 px-3 py-2 dark:border-blue-700 dark:bg-blue-950">
      <TextInput
        placeholder="Buscar eventos..."
        placeholderTextColor="#94a3b8"
        className="flex-1 text-sm text-slate-900 dark:text-slate-50"
      />
    </View>
  );
}
