import { useColorScheme } from '@/hooks/use-color-scheme';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export function UserStudentMainScreen() {
  // 🔹 Tema
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // 🔹 Datos de ejemplo (luego pueden venir de AuthContext / API)
  const user = {
    nombre: 'Jaime López',
    correo: 'jaime@example.com',
    genero: 'Masculino',
    edad: 23,
    id: '123456', // ID de 6 dígitos
    carrera: 'Ingeniería en Sistemas Computacionales',
  };

  // 🔹 Datos que irán dentro del QR
  const qrData = JSON.stringify({
    nombre: user.nombre,
    id: user.id,
    correo: user.correo,
  });

  const [showQR, setShowQR] = useState(false);

  const handleGenerateQR = () => setShowQR(true);
  const handleCloseQR = () => setShowQR(false);

  return (
    <View className={`flex-1 ${isDark ? 'bg-slate-950' : 'bg-sky-100'}`}>
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

            {/* Correo */}
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
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Información de la cuenta
          </Text>

          {/* Fila: Carrera */}
          <View
            className={`mb-3 flex-row items-center justify-between rounded-2xl px-4 py-3 ${
              isDark ? 'bg-slate-800/80' : 'bg-white'
            }`}
          >
            <Text
              className={`text-sm ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Carrera
            </Text>
            <Text
              className={`max-w-[60%] text-right text-base font-medium ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {user.carrera}
            </Text>
          </View>

          {/* Fila: ID */}
          <View
            className={`mb-3 flex-row items-center justify-between rounded-2xl px-4 py-3 ${
              isDark ? 'bg-slate-800/80' : 'bg-white'
            }`}
          >
            <Text
              className={`text-sm ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              ID
            </Text>
            <Text
              className={`text-base font-medium ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {user.id}
            </Text>
          </View>

          {/* Fila: Género */}
          <View
            className={`mb-3 flex-row items-center justify-between rounded-2xl px-4 py-3 ${
              isDark ? 'bg-slate-800/80' : 'bg-white'
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
            className={`mb-3 flex-row items-center justify-between rounded-2xl px-4 py-3 ${
              isDark ? 'bg-slate-800/80' : 'bg-white'
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

        {/* Tarjeta con el QR (solo si showQR es true) */}
        {showQR && (
          <View className="px-6 pb-4">
            <View
              className={`items-center rounded-2xl px-4 py-6 ${
                isDark ? 'bg-slate-800/90' : 'bg-white'
              }`}
            >
              <Text
                className={`mb-3 text-sm font-medium ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                }`}
              >
                Código QR de tu perfil
              </Text>

              <QRCode
                value={qrData}
                size={180}
                backgroundColor="transparent"
                color={isDark ? 'white' : '#020617'} // blanco en oscuro, casi negro en claro
              />

              <Pressable
                onPress={handleCloseQR}
                className={`mt-4 rounded-xl px-4 py-2 ${
                  isDark ? 'bg-slate-700' : 'bg-slate-200'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    isDark ? 'text-slate-100' : 'text-slate-800'
                  }`}
                >
                  Cerrar QR
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Botón inferior: Generar QR */}
      <View className="px-6 pb-8">
        <Pressable
          onPress={handleGenerateQR}
          className="items-center justify-center rounded-2xl bg-emerald-500 py-3"
        >
          <Text className="text-base font-semibold text-white">Generar QR</Text>
        </Pressable>
      </View>
    </View>
  );
}
