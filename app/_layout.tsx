// app/_layout.tsx
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react'; // ⬅️ NUEVO
import 'react-native-reanimated';

import { AuthProvider } from '@/features/auth/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import '../global.css';

import Loader from '../components/loader'; // ⬅️ NUEVO

export const unstable_settings = {
  // anchor: '(tabs)',
  initialRouteName: 'login',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [isLoading, setIsLoading] = useState(true); // ⬅️ NUEVO

  useEffect(() => {
    // ⬅️ NUEVO
    const timer = setTimeout(() => {
      setIsLoading(false); // cuando termina el tiempo, quitamos el loader
    }, 5000); // 5000 ms = 5 s (ajustable)

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {isLoading ? ( // ⬅️ CAMBIO: antes aquí estaba directo el <Stack>
          <Loader /> // ⬅️ NUEVO: mostramos la pantalla de carga
        ) : (
          <>
            {/* ⬅️ NUEVO: lo de antes va dentro del "else" */}
            <Stack>
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{ presentation: 'modal', title: 'Modal' }}
              />
            </Stack>
            {/* Aquí puedes dejar el StatusBar como lo tenías */}
            <StatusBar style="auto" />
          </>
        )}
      </ThemeProvider>
    </AuthProvider>
  );
}
