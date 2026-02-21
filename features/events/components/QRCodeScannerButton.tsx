// features/events/components/QRCodeScannerButton.tsx
import React, { useState } from 'react';
import { Modal, Pressable, Text, View, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

interface QRCodeScannerButtonProps {
  onScannerClose: () => void;
}

export const QRCodeScannerButton: React.FC<QRCodeScannerButtonProps> = ({ onScannerClose }) => {
  // Hook moderno de permisos
  const [permission, requestPermission] = useCameraPermissions();
  const [modalVisible, setModalVisible] = useState(false);
  const [scanned, setScanned] = useState(false);

  const handlePress = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        alert("Se requiere permiso de cámara para escanear");
        return;
      }
    }
    setScanned(false);
    setModalVisible(true);
  };

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    setModalVisible(false);
    console.log("Datos del QR:", data);
    
    // Aquí ejecutas lo que necesites con el código
    onScannerClose();
  };

  return (
    <View>
      {/* Botón Circular - Solo se modificó el color aquí */}
      <Pressable
        onPress={handlePress}
        className="h-14 w-14 items-center justify-center rounded-full bg-emerald-500 shadow-xl dark:bg-emerald-400"
      >
        <Text className="text-[10px] font-bold text-white text-center">SCAN QR</Text>
      </Pressable>

      <Modal visible={modalVisible} animationType="slide">
        <View className="flex-1 bg-black">
          {/* El nuevo componente CameraView de expo-camera */}
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"], // Solo busca códigos QR para mayor velocidad
            }}
          />

          {/* Guía visual */}
          <View className="flex-1 items-center justify-center">
            <View className="h-64 w-64 rounded-3xl border-2 border-emerald-400" />
            <Text className="mt-4 text-white font-bold bg-black/50 p-2">
              Apunta al código QR
            </Text>
          </View>

          {/* Botón cerrar */}
          <Pressable
            onPress={() => setModalVisible(false)}
            className="absolute top-14 right-6 h-12 w-12 items-center justify-center rounded-full bg-black/60"
          >
            <Text className="text-white font-bold">X</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};