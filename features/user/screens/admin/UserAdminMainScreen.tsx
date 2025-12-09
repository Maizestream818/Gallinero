// features/user/screens/UserAdminMainScreen.tsx
import { useAuth } from '@/features/auth/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

export function UserAdminMainScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const bgClass = isDark ? 'bg-slate-950' : 'bg-sky-100';

  // 👇 Usuario PLANO que viene del AuthContext
  const { user } = useAuth();

  // Si por alguna razón no hay sesión activa
  if (!user) {
    return (
      <View className={`flex-1 items-center justify-center ${bgClass}`}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Text className={isDark ? 'text-slate-100' : 'text-slate-900'}>
          No hay sesión activa.
        </Text>
      </View>
    );
  }

  // Campos tomados del usuario plano (el que guardamos en setAuth)
  const nombre = user.fullName ?? user.email ?? 'Administrador';
  const correo = user.email ?? 'sin-correo@ejemplo.com';
  const genero = user.gender ?? 'No especificado';
  const edadValor = user.age;

  // Si más adelante agregas columnas específicas para admins en _User
  // las podrías leer aquí; mientras tanto dejamos valores por defecto.
  const departamento = (user as any).department ?? 'Departamento de Sistemas';
  const puesto = (user as any).position ?? 'Administrador';

  return (
    <View className={`flex-1 ${bgClass}`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-6 pt-10 pb-6">
          {/* Encabezado tipo perfil */}
          <View className="mb-8 items-center">
            {/* Avatar redondo con inicial */}
            <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-emerald-500">
              <Text className="text-4xl font-bold text-white">
                {nombre.charAt(0)}
              </Text>
            </View>

            <Text
              className={`text-xl font-semibold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {nombre}
            </Text>

            <Text
              className={`mt-1 text-sm ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {correo}
            </Text>
          </View>

          {/* Sección de información de la cuenta */}
          <Text
            className={`mb-3 text-xs font-semibold tracking-wide uppercase ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Información de la cuenta
          </Text>

          {/* Departamento */}
          <View
            className={`mb-3 flex-row items-center justify-between rounded-2xl border px-4 py-3 ${
              isDark
                ? 'border-slate-700 bg-slate-900/90'
                : 'border-sky-200 bg-white'
            }`}
          >
            <Text
              className={`text-sm ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Departamento
            </Text>
            <Text
              className={`max-w-[60%] text-right text-base font-medium ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {departamento}
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
              className={`text-sm ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Puesto
            </Text>
            <Text
              className={`max-w-[60%] text-right text-base font-medium ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {puesto}
            </Text>
          </View>

          {/* Género */}
          <View
            className={`mb-3 flex-row items-center justify-between rounded-2xl border px-4 py-3 ${
              isDark
                ? 'border-slate-700 bg-slate-900/90'
                : 'border-sky-200 bg-white'
            }`}
          >
            <Text
              className={`text-sm ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Género
            </Text>
            <Text
              className={`text-base font-medium ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {genero}
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
              className={`text-sm ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Edad
            </Text>
            <Text
              className={`text-base font-medium ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {edadValor != null ? `${edadValor} años` : 'No especificada'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
