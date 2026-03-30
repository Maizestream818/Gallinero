import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Barra } from './Barra';
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

  // Tema del sistema para aplicar colores al modal
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const palette = Colors[colorScheme ?? 'light'];

  // Colores del modal según el tema del sistema
  const colors = {
    cardBg: isDark ? '#1e293b' : '#ffffff',
    cardBorder: isDark ? '#334155' : 'transparent',
    title: palette.text,
    subtitle: palette.icon,
    // El QR siempre sobre fondo blanco para que sea escaneable
    qrBg: '#ffffff',
    // Botón cerrar: verde siempre
    closeBtnBg: '#22c55e',
    closeBtnText: '#ffffff',
  };

  // Al abrir, genera uno nuevo UNA sola vez
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (visible) {
      setTimestamp(Date.now());
      interval = setInterval(() => {
        setTimestamp(Date.now());
      }, 10000); // 10 segundos para que cambie el qr
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [visible]);

  // Funcion estable (no cambia en cada render)
  const handleTimeout = useCallback(() => {
    setTimestamp(Date.now());
  }, []);

  const qrValue = useMemo(() => {
    const nonce = Math.random().toString(36).slice(2, 10);
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

        {/* Tarjeta del QR — usa colores del tema */}
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
