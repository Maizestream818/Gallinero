import { Tabs } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { QR } from '@/components/ui/QR';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/features/auth/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Datos del alumno para el QR — deben coincidir con STUDENT_FALLBACK_PROFILE
const STUDENT_ID = '242453';
const STUDENT_NAME = 'Luis Fernando Navarro Lozano';

// Altura base del tab bar (sin safe area)
const TAB_BAR_BASE_HEIGHT = 56;

// Tamaño fijo del círculo QR — 75% de un tercio de 390px (ancho típico)
// Se usa valor fijo para evitar dependencia de useWindowDimensions que puede crashear en web
const CIRCLE_SIZE = Math.round((390 / 3) * 0.75);
const CIRCLE_RADIUS = CIRCLE_SIZE / 2;

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const palette = Colors[colorScheme ?? 'light'];
  const { role } = useAuth();
  const isDark = colorScheme === 'dark';

  // El botón QR circular solo se muestra en la vista alumno
  const isStudent = role === 'student';

  // Estado del modal QR — se abre desde el botón central, NUNCA navega a comunidades
  const [qrVisible, setQrVisible] = useState(false);

  const tabBarHeight = TAB_BAR_BASE_HEIGHT + Math.max(insets.bottom, 8);

  // Cuánto sobresale el círculo por encima del tab bar:
  // el centro del círculo se alinea con el borde superior, mitad adentro mitad afuera
  const circleBottom = -(CIRCLE_RADIUS - TAB_BAR_BASE_HEIGHT / 2) + 4;

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: palette.tint,
          tabBarInactiveTintColor: palette.tabIconDefault,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            height: tabBarHeight,
            paddingTop: 6,
            paddingBottom: Math.max(insets.bottom, 8),
            backgroundColor: palette.background,
            borderTopWidth: 1,
            borderTopColor: isDark ? '#1f2937' : '#e5e7eb',
            // Necesario para que el círculo sobresalga por arriba sin recortarse
            overflow: 'visible',
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
        }}
      >
        {/* ── TAB EVENTOS ── */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Eventos',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />

        {/* ── TAB QR (alumno) / oculto (admin) ── */}
        <Tabs.Screen
          name="communities"
          options={{
            // FIX: título vacío + label oculto para que no aparezca texto debajo del círculo
            title: '',
            tabBarShowLabel: false,
            // En admin: tab oculto completamente usando width/height 0 (display:none no funciona en RN)
            tabBarItemStyle: !isStudent
              ? { width: 0, height: 0, overflow: 'hidden', opacity: 0 }
              : undefined,
            tabBarIcon: () =>
              isStudent ? (
                // Círculo que sobresale del tab bar — fondo igual al tab bar, ícono del tema
                <View
                  style={{
                    position: 'absolute',
                    width: CIRCLE_SIZE,
                    height: CIRCLE_SIZE,
                    borderRadius: CIRCLE_RADIUS,
                    bottom: circleBottom,
                    // Mismo fondo que el tab bar — solo el ícono cambia con el tema
                    backgroundColor: palette.background,
                    alignItems: 'center',
                    justifyContent: 'center',
                    // Borde que lo separa visualmente del tab bar
                    borderWidth: 2,
                    borderColor: isDark ? '#1f2937' : '#e5e7eb',
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: -2 },
                  }}
                >
                  {/* Ícono QR — color de texto del tema (oscuro en light, claro en dark) */}
                  <IconSymbol
                    size={Math.round(CIRCLE_SIZE * 0.48)}
                    name="qrcode"
                    color={palette.text}
                  />
                </View>
              ) : null,
            // En alumno: el press abre el modal QR, NUNCA navega a la pantalla de comunidades
            tabBarButton: isStudent
              ? (props) => (
                  <Pressable
                    style={props.style}
                    onPress={() => setQrVisible(true)}
                    android_ripple={null}
                  >
                    {props.children}
                  </Pressable>
                )
              : HapticTab,
          }}
        />

        {/* ── TAB PERFIL ── */}
        <Tabs.Screen
          name="user"
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color }) => (
              <IconSymbol
                size={28}
                name="person.crop.circle.fill"
                color={color}
              />
            ),
          }}
        />
      </Tabs>

      {/* Modal QR — renderizado por encima de todo, no cambia de tab */}
      <QR
        visible={qrVisible}
        onClose={() => setQrVisible(false)}
        userName={STUDENT_NAME}
        userId={STUDENT_ID}
      />
    </>
  );
}
