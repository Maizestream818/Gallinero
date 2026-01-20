import React, { useEffect, useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Barra } from './Barra';

type Props = {
  visible: boolean;
  onClose: () => void;
  userName?: string;
  userId?: string;
};

export function QR({ visible, onClose, userName, userId }: Props) {
  const [timestamp, setTimestamp] = useState(Date.now());

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (visible) {
      setTimestamp(Date.now());
      interval = setInterval(() => {
        setTimestamp(Date.now());
      }, 10000); //10 segundos para que cambie el qr
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [visible]);
  const handleRefresh = () => {
    setTimestamp(Date.now());
  };

  // Valor que se manda al QR
  const qrValue = `ALUMNO:${userId}|TIME:${timestamp}`;
  // API publica para generar el QR
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrValue}`;
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Fondo oscuro */}
        <Pressable style={styles.backdrop} onPress={onClose} />

        {/* Contenedor principal */}
        <View className="w-4/5 items-center rounded-2xl bg-white p-6">
          <Text className="mb-2 text-lg font-bold">Código QR</Text>

          <Text className="mb-4 text-center text-xs text-gray-500">
            Escanea este código para registrar tu asistencia
          </Text>

          {/* QR */}
          <Image source={{ uri: qrUrl }} style={{ width: 250, height: 250 }} />

          {/* Datos */}
          <View className="mt-4 items-center">
            <Text className="font-semibold">{userName}</Text>
            <Text className="text-xs text-gray-400">ID: {userId}</Text>
          </View>

          {/* Componente de la barra de progreso */}
          {visible && (
            <Barra duration={10000} onTimeout={handleRefresh} />
          )}
    
          {/* Botón */}
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
