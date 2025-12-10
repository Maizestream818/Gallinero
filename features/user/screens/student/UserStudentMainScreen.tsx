// features/user/screens/UserStudentMainScreen.tsx
import { useAuth } from '@/features/auth/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { logActivity } from '@/utils/activityLogger';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { ProgressBar } from './progresBar';

export function UserStudentMainScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const bgClass = isDark ? 'bg-slate-950' : 'bg-sky-100';

  // Usamos navegación para las pantallas adicionales
  const navigation = useNavigation();

  // Usuario y funciones del AuthContext
  const { user, updateProfile, signOut } = useAuth();

  // ------------------------------------------------
  // LÓGICA DEL QR DINÁMICO
  // ------------------------------------------------

  // Estado para el token dinámico (UUID o Timestamp)
  const [qrToken, setQrToken] = useState(Date.now().toString());

  // Función que se llama cuando el tiempo de la barra de progreso termina (cada 20s)
  const handleTimerEnd = useCallback(() => {
    // Generamos un nuevo token (basado en la hora actual)
    // ESTO CAMBIA el key de ProgressBar y fuerza su reinicio
    setQrToken(Date.now().toString());
  }, []);

  // Estado del QR (mostrar/ocultar)
  const [showQR, setShowQR] = useState(false);
  const handleGenerateQR = () => setShowQR(true);

  const handleCloseQR = () => setShowQR(false);

  // ------------------------------------------------
  // LÓGICA DE EDICIÓN DE PERFIL (Modal)
  // ------------------------------------------------
  const [modalVisible, setModalVisible] = useState(false);
  const [draftName, setDraftName] = useState(user?.fullName ?? '');
  const [draftEmail, setDraftEmail] = useState(user?.email ?? '');
  const [avatar, setAvatar] = useState<string | null>(
    (user as any)?.avatar ?? null,
  );

  const saveProfile = async () => {
    if (!draftName.trim()) {
      Alert.alert('Validación', 'El nombre es obligatorio');
      return;
    }

    await updateProfile?.({
      fullName: draftName,
      email: draftEmail,
      avatarUri: avatar ?? undefined,
    });

    setModalVisible(false);
  };

  const pickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso requerido para la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  // -------------------------
  // CERRAR SESIÓN (signOut)
  // -------------------------
  const handleSignOut = async () => {
    try {
      // Guardamos datos del usuario ANTES de cerrar sesión
      const userId = (user as any)?.objectId;
      const email = user?.email;
      const fullName = user?.fullName;

      // 1) Registrar actividad en Back4App
      await logActivity('Cerró sesión', {
        userId,
        email,
        fullName,
      });
    } catch (error) {
      console.error('Error registrando actividad de cierre de sesión', error);
      // No bloqueamos el cierre de sesión si falla el log
    }

    // 2) Limpiar sesión local (AuthContext / AsyncStorage)
    await signOut?.();

    // 3) Enviar a la pantalla de login
    router.replace('/login');
  };

  // ------------------------------------------------
  // DATOS DEL PERFIL
  // ------------------------------------------------
  const nombre = user?.fullName ?? 'Sin nombre';
  const correo = user?.email ?? 'Sin correo';
  const genero = user?.gender ?? 'Sin género';
  const carrera = (user as any)?.career ?? 'Sin carrera';
  const id = (user as any)?.studentId ?? 'Sin ID';
  const edadValor = user?.age;

  // Generamos el QR data incluyendo el token dinámico
  const qrData = JSON.stringify({
    nombre,
    id,
    correo,
    token: qrToken,
  });

  // ------------------------------------------------
  // SIN SESIÓN
  // ------------------------------------------------
  if (!user) {
    return (
      <View className={`flex-1 items-center justify-center ${bgClass}`}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <Text className={isDark ? 'text-slate-100' : 'text-slate-900'}>
          No hay sesión activa.
        </Text>
      </View>
    );
  }

  // ------------------------------------------------
  // UI
  // ------------------------------------------------
  return (
    <View className={`flex-1 ${bgClass}`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-6 pt-10 pb-6">
          {/* Encabezado tipo perfil */}
          <View className="mb-8 items-center">
            {/* AVATAR (abre modal al tocar) */}
            <Pressable onPress={() => setModalVisible(true)}>
              {avatar ? (
                <Image
                  source={{ uri: avatar }}
                  className="mb-4 h-24 w-24 rounded-full"
                />
              ) : (
                <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-emerald-500">
                  <Text className="text-4xl font-bold text-white">
                    {nombre.charAt(0)}
                  </Text>
                </View>
              )}
            </Pressable>

            <Text
              className={`text-xl font-semibold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              {nombre}
            </Text>

            <Text
              className={`mt-1 text-sm ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {correo}
            </Text>
          </View>

          {/* Información de la cuenta */}
          <Text
            className={`mb-3 text-xs font-semibold tracking-wide uppercase ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Información de la cuenta
          </Text>

          {/* Card helper para Carrera, ID, Género, Edad */}
          {[
            ['Carrera', carrera],
            ['ID', id],
            ['Género', genero],
            [
              'Edad',
              edadValor != null ? `${edadValor} años` : 'No especificada',
            ],
          ].map(([label, value]) => (
            <View
              key={label}
              className={`mb-3 flex-row items-center justify-between rounded-2xl px-4 py-3 ${
                isDark ? 'bg-slate-800/80' : 'bg-white'
              }`}
            >
              <Text
                className={`text-sm ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {label}
              </Text>
              <Text
                className={`max-w-[60%] text-right text-base font-medium ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {value}
              </Text>
            </View>
          ))}

          {/* NAVEGACIÓN (solo Historial) */}
          <View className="mt-6">
            <Text
              className={`mb-3 text-xs font-semibold tracking-wide uppercase ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Ajustes y opciones
            </Text>

            <Pressable
              onPress={() => navigation.navigate('ActivityHistory' as never)}
              className="mb-3 rounded-xl bg-indigo-600 px-4 py-3"
            >
              <Text className="text-center text-white">
                Historial de actividad
              </Text>
            </Pressable>
          </View>

          {/* CERRAR SESIÓN */}
          <Pressable
            onPress={handleSignOut}
            className="mt-6 rounded-xl bg-red-600 px-4 py-3"
          >
            <Text className="text-center text-white">Cerrar sesión</Text>
          </Pressable>
        </View>

        {/* CONTENEDOR DEL QR (con barra de progreso) */}
        {showQR && (
          <View className="px-6 pb-4">
            <View
              className={`items-center rounded-2xl px-4 py-6 ${
                isDark ? 'bg-slate-800/90' : 'bg-white'
              }`}
            >
              <Text
                className={`mb-3 text-sm font-medium ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                }`}
              >
                Código QR de tu perfil (Expira en 20s)
              </Text>

              {/* BARRA DE PROGRESO - USANDO KEY PARA FORZAR REINICIO */}
              <View className="mb-4 w-full px-4">
                <ProgressBar
                  key={qrToken}
                  onTimeEnd={handleTimerEnd}
                  isDark={isDark}
                />
              </View>

              <QRCode
                value={qrData}
                size={180}
                backgroundColor="transparent"
                color={isDark ? 'white' : '#020617'}
              />

              <Pressable
                onPress={handleCloseQR}
                className={`mt-4 rounded-xl px-4 py-2 ${
                  isDark ? 'bg-slate-700' : 'bg-slate-200'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    isDark ? 'text-slate-100' : 'text-slate-800'
                  }`}
                >
                  Cerrar QR
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>

      {/* BOTÓN DE GENERAR QR (Siempre visible en el footer) */}
      <View className="px-6 pb-8">
        <Pressable
          onPress={handleGenerateQR}
          className="items-center justify-center rounded-2xl bg-emerald-500 py-3"
        >
          <Text className="text-base font-semibold text-white">Generar QR</Text>
        </Pressable>
      </View>

      {/* MODAL EDICIÓN PERFIL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/40">
          <View className="w-[90%] rounded-2xl bg-white p-6">
            <Text className="mb-4 text-center text-lg font-bold">
              Editar Perfil
            </Text>
            <Pressable onPress={pickAvatar}>
              {avatar ? (
                <Image
                  source={{ uri: avatar }}
                  className="mb-4 h-24 w-24 self-center rounded-full"
                />
              ) : (
                <View className="mb-4 h-24 w-24 items-center justify-center self-center rounded-full bg-emerald-500">
                  <Text className="text-4xl font-bold text-white">
                    {nombre.charAt(0)}
                  </Text>
                </View>
              )}

              <Text className="text-center text-sm text-indigo-600">
                Cambiar foto
              </Text>
            </Pressable>

            <TextInput
              value={draftName}
              onChangeText={setDraftName}
              placeholder="Nombre"
              placeholderTextColor="#94a3b8"
              className="mt-4 rounded-lg border border-slate-300 p-3 text-slate-900"
            />

            <TextInput
              value={draftEmail}
              onChangeText={setDraftEmail}
              placeholder="Correo"
              placeholderTextColor="#94a3b8"
              className="mt-3 rounded-lg border border-slate-300 p-3 text-slate-900"
              keyboardType="email-address"
            />

            <View className="mt-6 flex-row justify-between">
              <Pressable
                onPress={() => setModalVisible(false)}
                className="px-4 py-2"
              >
                <Text className="text-slate-600">Cancelar</Text>
              </Pressable>

              <Pressable
                onPress={saveProfile}
                className="rounded-lg bg-emerald-600 px-4 py-2"
              >
                <Text className="text-white">Guardar cambios</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
