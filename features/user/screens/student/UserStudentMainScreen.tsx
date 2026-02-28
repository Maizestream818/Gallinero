import * as ImagePicker from 'expo-image-picker';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

import { AdminHeader } from '@/components/admin/AdminHeader';
import { InfoRow } from '@/components/admin/InfoRow';
import { OptionsMenuModal } from '@/components/ui/OptionsMenuModal';
import type { MenuAnchor } from '@/components/ui/types/menu-anchor';
import { ProfilePhotoCropperModal } from '@/components/user/ProfilePhotoCropperModal';
import { QR } from '@/components/user/QR';
import { UserEditProfileModal } from '@/components/user/UserEditProfileModal';
import { useAuth } from '@/features/auth/AuthContext';
import {
  loadUserProfile,
  saveProfilePhotoToAppStorage,
  saveUserProfile,
} from '@/features/user/storage/user-profile.storage';
import type { UserProfile } from '@/features/user/types/user-profile';

const STUDENT_FALLBACK_PROFILE: UserProfile = {
  id: '242453',
  nombre: 'Luis Fernando Navarro Lozano',
  correo: 'alumno@correo.com',
  carrera: 'comunicacion',
  grado: '8to Semestre',
  grupo: 'B',
  sexo: 'Masculino',
  nivel_academico: 'Licenciatura',
  foto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300',
};

type CropSource = {
  uri: string;
  width: number;
  height: number;
};

export function UserStudentMainScreen() {
  const router = useRouter();
  const { setRole } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<MenuAnchor | null>(null);
  const [qrVisible, setQrVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [photoCropVisible, setPhotoCropVisible] = useState(false);
  const [cropSource, setCropSource] = useState<CropSource | null>(null);
  const [user, setUser] = useState<UserProfile>(STUDENT_FALLBACK_PROFILE);
  const tabBarHeight = useBottomTabBarHeight();

  useEffect(() => {
    let mounted = true;

    const hydrateProfile = async () => {
      const persisted = await loadUserProfile(
        STUDENT_FALLBACK_PROFILE.id,
        STUDENT_FALLBACK_PROFILE,
      );
      if (mounted) {
        setUser(persisted);
      }
    };

    void hydrateProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSaveProfile = async (nextProfile: UserProfile) => {
    setUser(nextProfile);

    try {
      await saveUserProfile(nextProfile);
    } catch {
      Alert.alert(
        'No se pudo guardar de forma local',
        'Tus cambios se mantuvieron en pantalla, pero no pudieron persistirse.',
      );
    }
  };

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

    setCropSource({
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
    });
    setPhotoCropVisible(true);
  };

  const handleCancelPhotoCrop = () => {
    setPhotoCropVisible(false);
    setCropSource(null);
  };

  const handleConfirmPhotoCrop = async (croppedUri: string) => {
    try {
      const persistedPhotoUri = await saveProfilePhotoToAppStorage(
        croppedUri,
        user.id,
      );
      const nextProfile: UserProfile = {
        ...user,
        foto: persistedPhotoUri,
      };

      setUser(nextProfile);
      await saveUserProfile(nextProfile);
      handleCancelPhotoCrop();
    } catch {
      Alert.alert(
        'No se pudo guardar la foto',
        'Intenta nuevamente. Tu foto anterior se mantiene.',
      );
    }
  };

  const handleLogout = () => {
    setRole(null);
    router.replace('/login');
  };

  return (
    <View className="items flex-1 bg-slate-900">
      <StatusBar style="light" />

      <View className="flex-1 bg-slate-100">
        <StatusBar style="dark" />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: tabBarHeight + 16 }}
        >
          <AdminHeader
            topTitle="Mi Credencial"
            subtitle="Identificacion Digital Oficial"
            name={user.nombre}
            roleLabel="Alumno"
            idLabel={`ID: ${user.id}`}
            photoUri={user.foto}
            isMenuOpen={menuVisible}
            onOpenMenu={(anchor) => {
              setMenuAnchor(anchor);
              setMenuVisible(true);
            }}
          >
            <InfoRow label="Correo" value={user.correo} />
            <InfoRow label="Carrera" value={user.carrera} />
            <InfoRow label="Grado" value={user.grado} />
            <InfoRow label="Grupo" value={user.grupo} />
            <InfoRow
              label="Nivel Academico"
              value={user.nivel_academico}
              isLast
            />
          </AdminHeader>
          <View className="h-6" />
        </ScrollView>

        <OptionsMenuModal
          visible={menuVisible}
          anchor={menuAnchor}
          onClose={() => {
            setMenuVisible(false);
            setMenuAnchor(null);
          }}
          onEditPhoto={() => {
            setTimeout(() => {
              void handleOpenPhotoPicker();
            }, 300);
          }}
          onQR={() => {
            setMenuVisible(false);
            setTimeout(() => setQrVisible(true), 300);
          }}
          onEdit={() => {
            setMenuVisible(false);
            setTimeout(() => setEditVisible(true), 300);
          }}
          onLogout={() => {
            handleLogout();
          }}
        />

        <QR
          visible={qrVisible}
          onClose={() => setQrVisible(false)}
          userName={user.nombre}
          userId={user.id}
        />

        <UserEditProfileModal
          visible={editVisible}
          onClose={() => setEditVisible(false)}
          user={user}
          onSave={handleSaveProfile}
        />

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
