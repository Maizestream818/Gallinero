// app/_layout.tsx
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  type Theme,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { AuthProvider } from '@/features/auth/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import '../global.css';

import Loader from '../components/loader';

// inicializa Parse/Back4App
import '@/lib/parseClient';

// ELIMINADA LA IMPORTACIÓN DIRECTA para evitar el error de "component"
// import { ActivityHistoryScreen } from '@/features/user/screens/ActivityHistoryScreen';

export const unstable_settings = {
  // anchor: '(tabs)',
  initialRouteName: 'login',
};

// 🎨 Temas... (sin cambios)
const DarkBlueTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#020617',
    card: '#020617',
    border: '#1e293b',
    text: '#f9fafb',
  },
};

const LightBlueTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#e0f2fe',
    card: '#ffffff',
    border: '#cbd5e1',
    text: '#020617',
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const appTheme = colorScheme === 'dark' ? DarkBlueTheme : LightBlueTheme;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider value={appTheme}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <Stack>
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

              {/* RUTA CORREGIDA: Ahora busca el archivo app/ActivityHistory.tsx */}
              <Stack.Screen
                name="ActivityHistory"
                options={{
                  headerShown: false,
                  title: 'Historial de Actividad',
                }}
              />

              <Stack.Screen
                name="modal"
                options={{ presentation: 'modal', title: 'Modal' }}
              />
            </Stack>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </>
        )}
      </ThemeProvider>
    </AuthProvider>
  );
}
