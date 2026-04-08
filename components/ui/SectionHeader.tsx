import React from 'react';
import { Text, View } from 'react-native';

type Props = {
  title: string;
  count: number;
};

export function SectionHeader({ title, count }: Props) {
  return (
    <View className="mb-2">
      <View className="flex-row items-baseline justify-between">
        <Text className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          {title}
        </Text>
        <Text className="text-sm font-semibold text-slate-400 dark:text-slate-500">
          {count} {count === 1 ? 'evento' : 'eventos'}
        </Text>
      </View>
      {/* Línea decorativa */}
      <View className="mt-2 h-[3px] w-full rounded-full bg-blue-400 dark:bg-blue-600" />
    </View>
  );
}
