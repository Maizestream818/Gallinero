// app/ActivityHistory.tsx
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

import { useAuth } from '@/features/auth/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  getActivityLogByUser,
  type ActivityLogItem,
} from '@/utils/activityLogger';

export default function ActivityHistoryScreen() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ActivityLogItem[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.objectId) {
        setItems([]);
        setLoading(false);
        return;
      }

      try {
        const data = await getActivityLogByUser(user.objectId);
        setItems(data);
      } catch (error) {
        console.error('Error cargando historial de actividad', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user?.objectId]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (!items.length) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Text className={isDark ? 'text-slate-200' : 'text-slate-700'}>
          No hay actividades registradas para tu cuenta.
        </Text>
      </View>
    );
  }

  return (
    <View
      className={`flex-1 px-4 py-4 ${isDark ? 'bg-slate-950' : 'bg-sky-100'}`}
    >
      <Text
        className={`mb-4 text-center text-lg font-semibold ${
          isDark ? 'text-slate-100' : 'text-slate-900'
        }`}
      >
        Historial de actividad
      </Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.objectId}
        renderItem={({ item }) => (
          <View
            className={`mb-3 rounded-2xl px-4 py-3 ${
              isDark ? 'bg-slate-800' : 'bg-white'
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              }`}
            >
              {item.message}
            </Text>

            <Text
              className={`mt-1 text-[11px] ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
