import { useAuth } from '@/features/auth/AuthContext';
import { useProfile } from '@/features/profile/useProfile';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

export function UserAdminMainScreen() {
  const { profile, loading } = useProfile();
  const { logout } = useAuth();
  const router = useRouter();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (loading || !profile) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-900">
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  // Extra data for admin
  const adminExtra = {
    departamento: 'Departamento de Sistemas y Computación',
    puesto: 'Administrador del sistema',
  };

  return (
    <View className={`flex-1 ${isDark ? 'bg-slate-950' : 'bg-sky-100'}`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-6 pt-10 pb-6">
          {/* Avatar */}
          <View className="mb-8 items-center">
            <Image
              source={{ uri: profile.avatarUrl }}
              className="mb-4 h-24 w-24 rounded-full"
            />

            <Text
              className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}
            >
              {profile.nombre}
            </Text>

            <Text
              className={`mt-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
            >
              {profile.email}
            </Text>

            <Text
              className={`mt-1 text-xs tracking-wide uppercase ${
                isDark ? 'text-emerald-400' : 'text-emerald-600'
              }`}
            >
              ADMINISTRADOR
            </Text>
          </View>

          {/* Departamento */}
          <View
            className={`mb-3 flex-row items-center justify-between rounded-2xl border px-4 py-3 ${
              isDark
                ? 'border-slate-700 bg-slate-900/90'
                : 'border-sky-200 bg-white'
            }`}
          >
            <Text
              className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
            >
              Departamento
            </Text>
            <Text
              className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}
            >
              {adminExtra.departamento}
            </Text>
          </View>

          {/* Puesto */}
          <View
            className={`mb-3 flex-row items-center justify-between rounded-2xl border px-4 py-3 ${
              isDark
                ? 'border-slate-700 bg-slate-900/90'
                : 'border-sky-200 bg-white'
            }`}
          >
            <Text
              className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
            >
              Puesto
            </Text>
            <Text
              className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}
            >
              {adminExtra.puesto}
            </Text>
          </View>

          {/* Sexo */}
          <View
            className={`mb-3 flex-row items-center justify-between rounded-2xl border px-4 py-3 ${
              isDark
                ? 'border-slate-700 bg-slate-900/90'
                : 'border-sky-200 bg-white'
            }`}
          >
            <Text
              className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
            >
              Sexo
            </Text>
            <Text
              className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}
            >
              {profile.sexo}
            </Text>
          </View>

          {/* Edad */}
          <View
            className={`mb-3 flex-row items-center justify-between rounded-2xl border px-4 py-3 ${
              isDark
                ? 'border-slate-700 bg-slate-900/90'
                : 'border-sky-200 bg-white'
            }`}
          >
            <Text
              className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
            >
              Edad
            </Text>
            <Text
              className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}
            >
              {profile.edad} años
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Logout */}
      <View className="px-6 pb-8">
        <Pressable
          onPress={() => logout().then(() => router.replace('/login'))}
          className="items-center justify-center rounded-2xl bg-red-500 py-3"
        >
          <Text className="text-base font-semibold text-white">
            Cerrar sesión
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
