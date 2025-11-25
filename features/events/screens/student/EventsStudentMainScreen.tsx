// features/events/screens/student/EventsStudentMainScreen.tsx
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text } from 'react-native';

export function EventsStudentMainScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-900">
      <StatusBar style="light" />
      <Text className="text-2xl font-bold text-white">
        Pantalla Eventos (Student)
      </Text>
    </View>
  );
}
