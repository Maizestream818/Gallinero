import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Barra } from './Barra';

type Props = {
  visible: boolean;
  onClose: () => void;
  userName?: string;
  userId?: string;
};

export function QR({ visible, onClose, userName, userId }: Props) {
  const [timestamp, setTimestamp] = useState(() => Date.now());

  // Al abrir, genera uno nuevo UNA sola vez
  useEffect(() => {
<<<<<<< HEAD
    let interval: ReturnType<typeof setInterval> | undefined;
    if (visible) {
      setTimestamp(Date.now());
      interval = setInterval(() => {
        setTimestamp(Date.now());
      }, 10000); //10 segundos para que cambie el qr
    }
    return () => {
      if (interval) clearInterval(interval);
    };
=======
    if (visible) setTimestamp(Date.now());
>>>>>>> 2ba80f9c5625557384cf6a04ffdcb2854a0f10d1
  }, [visible]);

  // Función estable (no cambia en cada render)
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

        <View className="w-4/5 items-center rounded-2xl bg-white p-6">
<<<<<<< HEAD
          <Text className="mb-2 text-lg font-bold">Codigo QR</Text>

=======
          <Text className="mb-2 text-lg font-bold">Código QR</Text>
>>>>>>> 2ba80f9c5625557384cf6a04ffdcb2854a0f10d1
          <Text className="mb-4 text-center text-xs text-gray-500">
            Escanea este codigo para registrar tu asistencia
          </Text>

          <Image
            key={timestamp}
            source={{ uri: qrUrl }}
            style={{ width: 250, height: 250 }}
          />

          {visible && <Barra duration={10000} onTimeout={handleTimeout} />}

<<<<<<< HEAD
          {/* Componente de la barra de progreso */}
          {visible && <Barra duration={10000} onTimeout={handleRefresh} />}

          {/* Boton */}
=======
>>>>>>> 2ba80f9c5625557384cf6a04ffdcb2854a0f10d1
          <Pressable
            onPress={onClose}
            className="mt-6 w-full rounded-lg bg-blue-600 py-3"
          >
            <Text className="text-center font-bold text-white">Cerrar</Text>
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
