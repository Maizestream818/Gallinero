import { useAuth } from '@/features/auth/AuthContext';
import { useProfile } from '@/features/profile/useProfile';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export function UserStudentMainScreen() {
  const { profile, loading } = useProfile();
  const { logout } = useAuth();
  const router = useRouter();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [showQR, setShowQR] = useState(false);

  if (loading || !profile) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-900">
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  const qrData = JSON.stringify({
    nombre: profile.nombre,
    id: profile.idEscolar,
    correo: profile.email,
  });

  return (
    <View className={`flex-1 ${isDark ? 'bg-slate-950' : 'bg-sky-100'}`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-6 pt-10 pb-6">
          {/* Avatar real */}
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
          </View>

          {/* Información */}
          <Text
            className={`mb-3 text-xs font-semibold tracking-wide uppercase ${
              isDark ? 'text-slate-400' : 'text-slate-500'
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
              className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
            >
              Carrera
            </Text>
            <Text
              className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}
            >
              Ingeniería en Sistemas Computacionales
            </Text>
          </View>

          {/* ID */}
          <View
            className={`mb-3 flex-row items-center justify-between rounded-2xl px-4 py-3 ${
              isDark ? 'bg-slate-800/80' : 'bg-white'
            }`}
          >
            <Text
              className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
            >
              ID Escolar
            </Text>
            <Text
              className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}
            >
              {profile.idEscolar}
            </Text>
          </View>

          {/* Sexo */}
          <View
            className={`mb-3 flex-row items-center justify-between rounded-2xl px-4 py-3 ${
              isDark ? 'bg-slate-800/80' : 'bg-white'
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
            className={`mb-3 flex-row items-center justify-between rounded-2xl px-4 py-3 ${
              isDark ? 'bg-slate-800/80' : 'bg-white'
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

        {/* QR */}
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
                onPress={() => setShowQR(false)}
                className={`mt-4 rounded-xl px-4 py-2 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}
              >
                <Text
                  className={`text-sm font-medium ${isDark ? 'text-slate-100' : 'text-slate-800'}`}
                >
                  Cerrar QR
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Botón QR */}
      <View className="px-6 pb-4">
        <Pressable
          onPress={() => setShowQR(true)}
          className="items-center justify-center rounded-2xl bg-emerald-500 py-3"
        >
          <Text className="text-base font-semibold text-white">Generar QR</Text>
        </Pressable>
      </View>

      {/* Cerrar sesión */}
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
