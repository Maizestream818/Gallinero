// app/_layout.tsx
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  type Theme, // ⬅️ NUEVO: importamos el tipo Theme para tipar nuestros temas
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { AuthProvider } from '@/features/auth/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import '../global.css';

import Loader from '../components/loader';

export const unstable_settings = {
  // anchor: '(tabs)',
  initialRouteName: 'login',
};

// 🎨 Tema oscuro personalizado (azul muy oscuro)
// ⬅️ NUEVO BLOQUE
const DarkBlueTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#020617', // azul muy oscuro (similar a bg-slate-950)
    card: '#020617',
    border: '#1e293b',
    text: '#f9fafb',
  },
};

// 🎨 Tema claro personalizado (azul clarito)
// ⬅️ NUEVO BLOQUE
const LightBlueTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#e0f2fe', // azul claro (puede cambiarlo después)
    card: '#ffffff',
    border: '#cbd5e1',
    text: '#020617',
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // ⬅️ NUEVO: elegimos el tema según sea oscuro o claro
  const appTheme = colorScheme === 'dark' ? DarkBlueTheme : LightBlueTheme;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // cuando termina el tiempo, quitamos el loader
    }, 5000); // 5000 ms = 5 s (ajustable)

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      {/* ⬅️ MODIFICADO: antes usaba DarkTheme / DefaultTheme directos */}
      <ThemeProvider value={appTheme}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <Stack>
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{ presentation: 'modal', title: 'Modal' }}
              />
            </Stack>
            {/* ⬅️ MODIFICADO: ahora el StatusBar también respeta el modo */}
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </>
        )}
      </ThemeProvider>
    </AuthProvider>
  );
}
