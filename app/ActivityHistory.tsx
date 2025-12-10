// app/ActivityHistory.tsx (DEBE ESTAR EN LA CARPETA app/)

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ActivityRecord, loadActivityHistory } from '@/utils/activityLogger';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

// Configurar dayjs
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.updateLocale('es', {
  relativeTime: {
    future: 'en %s',
    past: 'hace %s',
    s: 'unos segundos',
    m: 'un minuto',
    mm: '%d minutos',
    h: 'una hora',
    hh: '%d horas',
    d: 'un día',
    dd: '%d días',
    M: 'un mes',
    MM: '%d meses',
    y: 'un año',
    yy: '%d años',
  },
});
dayjs.locale('es');

// Cambia la exportación a default para Expo Router
export default function ActivityHistoryScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const bgClass = isDark ? 'bg-slate-950' : 'bg-sky-100';
  const textClass = isDark ? 'text-white' : 'text-slate-900';
  const itemBgClass = isDark ? 'bg-slate-800/80' : 'bg-white';
  const dateClass = isDark ? 'text-slate-400' : 'text-slate-500';

  const [history, setHistory] = useState<ActivityRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const records = await loadActivityHistory();
      setHistory(records);
      setLoading(false);
    };

    fetchHistory();
  }, []);

  const renderItem = ({ item }: { item: ActivityRecord }) => (
    <View className={`mb-3 rounded-xl p-4 shadow-sm ${itemBgClass}`}>
      {/* Mensaje de la actividad */}
      <Text className={`text-base font-medium ${textClass}`}>
        {item.message}
      </Text>

      {/* Fecha y hora */}
      <Text className={`mt-1 text-xs ${dateClass}`}>
        {dayjs(item.timestamp).fromNow()} (
        {dayjs(item.timestamp).format('HH:mm')})
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View className={`flex-1 items-center justify-center ${bgClass}`}>
        <ActivityIndicator size="large" color={isDark ? '#fff' : '#000'} />
      </View>
    );
  }

  return (
    <View className={`flex-1 ${bgClass}`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View className="px-6 pt-10 pb-6">
        <Text className={`mb-4 text-2xl font-bold ${textClass}`}>
          Historial de actividad
        </Text>
      </View>

      {history.length === 0 ? (
        <View className="flex-1 items-center px-6">
          <Text className={`text-center ${dateClass}`}>
            Aún no hay actividades registradas en esta cuenta.
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, index) => item.timestamp.toString() + index}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 50 }}
        />
      )}
    </View>
  );
}
