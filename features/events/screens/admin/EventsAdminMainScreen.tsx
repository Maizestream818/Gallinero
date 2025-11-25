// features/events/screens/admin/EventsAdminMainScreen.tsx
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, View } from 'react-native';

export function EventsAdminMainScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-900">
      <StatusBar style="light" />
      <Text className="text-2xl font-bold text-white">
        Pantalla Eventos (Admin)
      </Text>
    </View>
  );
}
