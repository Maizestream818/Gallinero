// components/ui/QR.tsx
// Modal de código QR para registro de asistencia.
// Movido a components/ui/ porque es usado tanto por la navegación global
// (_layout.tsx) como por la pantalla de usuario — no es exclusivo del dominio user.

import React, { useEffect, useMemo, useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Barra } from '@/components/user/Barra';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  userName?: string;
  userId?: string;
};

export function QR({ visible, onClose, userName, userId }: Props) {
  const [timestamp, setTimestamp] = useState(() => Date.now());

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const palette = Colors[colorScheme ?? 'light'];

  const colors = {
    cardBg: isDark ? '#1e293b' : '#ffffff',
    cardBorder: isDark ? '#334155' : 'transparent',
    title: palette.text,
    subtitle: palette.icon,
    qrBg: '#ffffff',
    closeBtnBg: '#22c55e',
    closeBtnText: '#ffffff',
  };

  // Al abrir, genera el timestamp inicial.
  // El ciclo de rotación lo maneja exclusivamente la Barra mediante onTimeout —
  // no hay setInterval aquí para evitar dos temporizadores desincronizados.
  useEffect(() => {
    if (visible) {
      setTimestamp(Date.now());
    }
  }, [visible]);

  const handleTimeout = () => {
    setTimestamp(Date.now());
  };

  // FIX: nonce separado del memo para evitar Math.random() dentro de useMemo
  const qrValue = useMemo(() => {
    const nonce = timestamp.toString(36);
    return `ALUMNO:${userId ?? ''}|TIME:${timestamp}|NONCE:${nonce}`;
  }, [userId, timestamp]);

  const qrUrl = useMemo(() => {
    const data = encodeURIComponent(qrValue);
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${data}&cb=${timestamp}`;
  }, [qrValue, timestamp]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View
          style={{
            width: '80%',
            alignItems: 'center',
            borderRadius: 16,
            padding: 24,
            backgroundColor: colors.cardBg,
            borderWidth: isDark ? 1 : 0,
            borderColor: colors.cardBorder,
            elevation: 10,
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: colors.title }}>
            Codigo QR
          </Text>
          <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 16, color: colors.subtitle }}>
            Escanea este codigo para registrar tu asistencia
          </Text>

          {/* Imagen QR siempre sobre fondo blanco para que sea escaneable */}
          <View style={{ backgroundColor: colors.qrBg, borderRadius: 8, padding: 4 }}>
            <Image
              key={timestamp}
              source={{ uri: qrUrl }}
              style={{ width: 250, height: 250 }}
            />
          </View>

          {visible && <Barra duration={10000} onTimeout={handleTimeout} />}

          <Pressable
            onPress={onClose}
            style={{
              marginTop: 24,
              width: '100%',
              borderRadius: 8,
              paddingVertical: 12,
              backgroundColor: colors.closeBtnBg,
            }}
          >
            <Text style={{ textAlign: 'center', fontWeight: 'bold', color: colors.closeBtnText }}>
              Cerrar
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
});
