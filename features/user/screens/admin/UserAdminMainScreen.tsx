import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

export function UserAdminMainScreen() {
  // 🔹 Datos de ejemplo (después pueden venir de AuthContext / API)
  const user = {
    nombre: 'Luis Hernández',
    correo: 'luis.hernandez@universidad.mx',
    genero: 'Masculino',
    edad: 35,
    departamento: 'Departamento de Sistemas y Computación',
    puesto: 'Coordinador de Laboratorio',
  };

  return (
    <View className="flex-1 bg-slate-900">
      <StatusBar style="light" />

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

            <Text className="text-xl font-semibold text-white">
              {user.nombre}
            </Text>

            {/* Correo arriba */}
            <Text className="mt-1 text-sm text-slate-300">{user.correo}</Text>
          </View>

          {/* Sección de información de la cuenta */}
          <Text className="mb-3 text-xs font-semibold tracking-wide text-slate-400 uppercase">
            Información de la cuenta
          </Text>

          {/* Fila: Departamento */}
          <View className="mb-3 flex-row items-center justify-between rounded-2xl bg-slate-800/80 px-4 py-3">
            <Text className="text-sm text-slate-400">Departamento</Text>
            <Text className="max-w-[60%] text-right text-base font-medium text-white">
              {user.departamento}
            </Text>
          </View>

          {/* Fila: Puesto */}
          <View className="mb-3 flex-row items-center justify-between rounded-2xl bg-slate-800/80 px-4 py-3">
            <Text className="text-sm text-slate-400">Puesto</Text>
            <Text className="max-w-[60%] text-right text-base font-medium text-white">
              {user.puesto}
            </Text>
          </View>

          {/* Fila: Género */}
          <View className="mb-3 flex-row items-center justify-between rounded-2xl bg-slate-800/80 px-4 py-3">
            <Text className="text-sm text-slate-400">Género</Text>
            <Text className="text-base font-medium text-white">
              {user.genero}
            </Text>
          </View>

          {/* Fila: Edad */}
          <View className="mb-3 flex-row items-center justify-between rounded-2xl bg-slate-800/80 px-4 py-3">
            <Text className="text-sm text-slate-400">Edad</Text>
            <Text className="text-base font-medium text-white">
              {user.edad} años
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
