import { useColorScheme } from '@/hooks/use-color-scheme';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

export function UserAdminMainScreen() {
  // Datos de ejemplo (después pueden venir de AuthContext / API)
  const user = {
    nombre: 'Luis Hernández',
    correo: 'luis.hernandez@universidad.mx',
    genero: 'Masculino',
    edad: 35,
    departamento: 'Departamento de Sistemas y Computación',
    puesto: 'Coordinador de Laboratorio',
  };

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View
      className={`flex-1 ${
        isDark ? 'bg-slate-950' : 'bg-sky-100'
        //              ^^^^^^^^^  ⬅️ antes era bg-sky-900
      }`}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-6 pt-10 pb-6">
          {/* Encabezado tipo perfil */}
          <View className="mb-8 items-center">
            {/* Avatar redondo con inicial */}
            <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-emerald-500">
              <Text className="text-4xl font-bold text-white">
                {user.nombre.charAt(0)}
              </Text>
            </View>

            <Text
              className={`text-xl font-semibold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {user.nombre}
            </Text>

            <Text
              className={`mt-1 text-sm ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {user.correo}
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

          {/* Fila: Departamento */}
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
              {user.departamento}
            </Text>
          </View>

          {/* Fila: Puesto */}
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
              {user.puesto}
            </Text>
          </View>

          {/* Fila: Género */}
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
              {user.genero}
            </Text>
          </View>

          {/* Fila: Edad */}
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
              {user.edad} años
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
