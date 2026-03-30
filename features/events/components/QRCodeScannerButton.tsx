// features/events/components/QRCodeScannerButton.tsx
// Botón flotante que abre la cámara, escanea un QR de alumno,
// parsea el ID y devuelve el resultado al padre mediante onStudentScanned.

import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { findStudentById, parseStudentIdFromQR } from '@/features/user/data/students-mock';
import type { UserProfile } from '@/features/user/types/user-profile';

type ScanResult =
  | { found: true; student: UserProfile }
  | { found: false };

interface Props {
  /** Se dispara en cuanto se lee un QR válido o inválido */
  onStudentScanned: (result: ScanResult) => void;
}

export const QRCodeScannerButton: React.FC<Props> = ({ onStudentScanned }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [modalVisible, setModalVisible] = useState(false);
  const [scanned, setScanned] = useState(false);

  const handlePress = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        alert('Se requiere permiso de cámara para escanear');
        return;
      }
    }
    setScanned(false);
    setModalVisible(true);
  };

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    setModalVisible(false);

    const studentId = parseStudentIdFromQR(data);
    if (!studentId) {
      onStudentScanned({ found: false });
      return;
    }

    const student = findStudentById(studentId);
    if (student) {
      onStudentScanned({ found: true, student });
    } else {
      onStudentScanned({ found: false });
    }
  };

  return (
    <View>
      <Pressable
        onPress={handlePress}
        className="h-14 w-14 items-center justify-center rounded-full bg-emerald-500 shadow-xl dark:bg-emerald-400"
      >
        <Text className="text-center text-[10px] font-bold text-white">SCAN{'\n'}QR</Text>
      </Pressable>

      <Modal visible={modalVisible} animationType="slide">
        <View className="flex-1 bg-black">
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          />

          {/* Marco guía */}
          <View className="flex-1 items-center justify-center">
            <View className="h-64 w-64 rounded-3xl border-2 border-emerald-400" />
            <Text className="mt-4 bg-black/50 p-2 font-bold text-white">
              Apunta al código QR del alumno
            </Text>
          </View>

          {/* Botón cerrar */}
          <Pressable
            onPress={() => setModalVisible(false)}
            className="absolute right-6 top-14 h-12 w-12 items-center justify-center rounded-full bg-black/60"
          >
            <Text className="font-bold text-white">✕</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};
