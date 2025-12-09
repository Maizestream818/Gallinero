// features/user/screens/UserStudentMainScreen.tsx
import { useAuth } from '@/features/auth/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export function UserStudentMainScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { user } = useAuth();

  const nombre = user?.fullName ?? 'Sin nombre';
  const correo = user?.email ?? 'Sin correo';
  const genero = user?.gender ?? 'Sin género';
  const carrera = user?.career ?? 'Sin carrera';
  const id = user?.studentId ?? 'Sin ID';
  const edadValor = user?.age;

  const qrData = JSON.stringify({
    nombre,
    id,
    correo,
  });

  const [showQR, setShowQR] = useState(false);

  const handleGenerateQR = () => setShowQR(true);
  const handleCloseQR = () => setShowQR(false);

  const bgClass = isDark ? 'bg-slate-950' : 'bg-sky-100';

  return (
    <View className={`flex-1 ${bgClass}`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-6 pt-10 pb-6">
          {/* Encabezado tipo perfil */}
          <View className="mb-8 items-center">
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

          {/* Información de la cuenta */}
          <Text
            className={`mb-3 text-xs font-semibold tracking-wide uppercase ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Información de la cuenta
          </Text>

          {/* Carrera */}
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
              {carrera}
            </Text>
          </View>

          {/* ID */}
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
              {id}
            </Text>
          </View>

          {/* Género */}
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
              {genero}
            </Text>
          </View>

          {/* Edad */}
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
              {edadValor != null ? `${edadValor} años` : 'Sin edad'}
            </Text>
          </View>
        </View>

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
                color={isDark ? 'white' : '#020617'}
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
