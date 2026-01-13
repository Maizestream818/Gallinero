import React from 'react';
import { View, Text } from 'react-native';


//Este componente representa el manejo de información sobre el usuario administrador
type Props ={
    label: string;
    value: string;
    isLast?: boolean;
}

export function InfoRow({ label, value, isLast }: Props) {
  return (
    <View className={`px-4 py-3 ${isLast ? "" : "border-b border-slate-200"}`}>
      <View className="flex-row items-center justify-between">
        <Text className="text-slate-500">{label}</Text>
        <Text className="font-semibold text-slate-900">{value}</Text>
      </View>
    </View>
  );
}