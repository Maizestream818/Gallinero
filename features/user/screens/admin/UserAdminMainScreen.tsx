// features/user/screens/admin/UserAdminMainScreen.tsx
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

import { AdminHeader } from '@/components/admin/AdminHeader';
import { InfoRow } from '@/components/admin/InfoRow';
import { OptionsMenuModal } from '@/components/ui/OptionsMenuModal';
import { ProfilePhotoCropperModal } from '@/components/user/ProfilePhotoCropperModal';
import type { MenuAnchor } from '@/components/ui/types/menu-anchor';
import { useAuth } from '@/features/auth/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

type CropSource = {
  uri: string;
  width: number;
  height: number;
};

//Pantalla de informacion del administrador
export function UserAdminMainScreen() {
  const router = useRouter();
  const { setRole } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const palette = Colors[colorScheme ?? 'light'];

  // Estado para abrir/cerrar menu hamburguesa
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<MenuAnchor | null>(null);

  // Estado para cambio de foto de perfil (igual que en vista alumno)
  const [photoCropVisible, setPhotoCropVisible] = useState(false);
  const [cropSource, setCropSource] = useState<CropSource | null>(null);

  const tabBarHeight = useBottomTabBarHeight();

  // Informacion simulada del administrador de momento
  // ASEGURAR DE CAMBIAR AL MOMENTO DE CONECTAR EL BACKEND
  const [admin, setAdmin] = useState({
    id: 'ADM-001',
    nombre: 'Oswaldo Cruz Garcia',
    correo: 'admin@correo.com',
    puesto: 'Coordinador',
    departamento: 'Difusion y Cultura',
    sexo: 'Masculino',
    foto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300',
  });

  const handleOpenPhotoPicker = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permiso requerido',
        'Necesitamos acceso a tu galeria para editar la foto de perfil.',
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
      selectionLimit: 1,
    });

    if (result.canceled || !result.assets.length) {
      return;
    }

    const asset = result.assets[0];
    if (!asset.uri || !asset.width || !asset.height) {
      Alert.alert(
        'Imagen invalida',
        'No fue posible leer los datos de la imagen seleccionada.',
      );
      return;
    }

    setCropSource({ uri: asset.uri, width: asset.width, height: asset.height });
    setPhotoCropVisible(true);
  };

  const handleCancelPhotoCrop = () => {
    setPhotoCropVisible(false);
    setCropSource(null);
  };

  const handleConfirmPhotoCrop = async (croppedUri: string) => {
    // En admin guardamos la foto solo en memoria hasta conectar el backend
    setAdmin((prev) => ({ ...prev, foto: croppedUri }));
    handleCancelPhotoCrop();
  };

  return (
    // Contenedor raiz — usa el color de fondo del tema del sistema
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View style={{ flex: 1, backgroundColor: palette.background }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: tabBarHeight + 16 }}
        >
          <AdminHeader
            topTitle="Mi Credencial"
            subtitle="Identificacion Digital Oficial"
            name={admin.nombre}
            roleLabel="ADMINISTRADOR"
            idLabel={`ID: ${admin.id}`}
            photoUri={admin.foto}
            isMenuOpen={menuVisible}
            // Lápiz de editar foto — igual que en vista alumno
            onEditPhoto={() => void handleOpenPhotoPicker()}
            onOpenMenu={(anchor) => {
              setMenuAnchor(anchor);
              setMenuVisible(true);
            }}
          >
            <InfoRow label="Correo" value={admin.correo} />
            <InfoRow label="Puesto" value={admin.puesto} />
            <InfoRow label="Departamento" value={admin.departamento} />
            <InfoRow label="Sexo" value={admin.sexo} isLast />
          </AdminHeader>

          <View className="h-6" />
        </ScrollView>

        {/* Menu hamburguesa como componente reutilizable */}
        <OptionsMenuModal
          visible={menuVisible}
          anchor={menuAnchor}
          onClose={() => {
            setMenuVisible(false);
            setMenuAnchor(null);
          }}
          onLogout={() => {
            setRole(null);
            router.replace('/login');
          }}
        />

        {/* Modal de recorte de foto — igual que en vista alumno */}
        <ProfilePhotoCropperModal
          visible={photoCropVisible}
          sourceUri={cropSource?.uri ?? null}
          sourceWidth={cropSource?.width ?? 0}
          sourceHeight={cropSource?.height ?? 0}
          onCancel={handleCancelPhotoCrop}
          onConfirm={handleConfirmPhotoCrop}
        />
      </View>
    </View>
  );
}
