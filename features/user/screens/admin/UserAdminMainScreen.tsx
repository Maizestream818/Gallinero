// features/user/screens/UserAdminMainScreen.tsx
import { useAuth } from '@/features/auth/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  Pressable,
  Image,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';


export function UserAdminMainScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const bgClass = isDark ? 'bg-slate-950' : 'bg-sky-100';

  // ✅ usamos navegación
  const navigation = useNavigation();

  // 👇 Usuario PLANO que viene del AuthContext
  const { user, updateProfile, signOut } = useAuth();

  // ✅ control modal
  const [modalVisible, setModalVisible] = useState(false);

  // ✅ estado local editable
  const [draftName, setDraftName] = useState(user?.fullName ?? '');
  const [draftEmail, setDraftEmail] = useState(user?.email ?? '');
  const [avatar, setAvatar] = useState<string | null>(
    (user as any)?.avatar ?? null
  );
  

  // -------------------------
  // GUARDAR CAMBIOS
  // -------------------------
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

  // -------------------------
  // CAMBIAR AVATAR
  // -------------------------
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

  // -------------------------
  // DATOS DEL PERFIL
  // -------------------------
  const nombre =
    user.fullName ?? user.email ?? 'Administrador';

  const correo =
    user.email ?? 'sin-correo@ejemplo.com';

  const genero =
    user.gender ?? 'No especificado';

  const edadValor = user.age;

  const departamento =
    (user as any).department ?? 'Departamento de Sistemas';

  const puesto =
    (user as any).position ?? 'Administrador';

  // ------------------------------------------------
  // UI
  // ------------------------------------------------
  return (
    <View className={`flex-1 ${bgClass}`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        <View className="px-6 pt-10 pb-6">

          {/* HEADER PROFIL */}
          <View className="mb-8 items-center">

            {/* ✅ AVATAR */}
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

            {/* ✅ EDITAR PERFIL */}
            <Pressable
              onPress={() => setModalVisible(true)}
              className="mt-2 rounded-lg bg-emerald-600 px-4 py-2"
            >
              <Text className="text-white">Editar perfil</Text>
            </Pressable>
          </View>

          {/* ------------------------------------------------ */}
          {/* INFO CUENTA */}
          {/* ------------------------------------------------ */}
          <Text
            className={`mb-3 text-xs font-semibold tracking-wide uppercase ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Información de la cuenta
          </Text>

          {/* Card helper */}
          {[
            ['Departamento', departamento],
            ['Puesto', puesto],
            ['Género', genero],
            [
              'Edad',
              edadValor != null ? `${edadValor} años` : 'No especificada',
            ],
          ].map(([label, value]) => (
            <View
              key={label}
              className={`mb-3 flex-row items-center justify-between rounded-2xl border px-4 py-3 ${
                isDark
                  ? 'border-slate-700 bg-slate-900/90'
                  : 'border-sky-200 bg-white'
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

          {/* ------------------------------------------------ */}
          {/* ✅ NAVEGACIÓN */}
          {/* ------------------------------------------------ */}
          <View className="mt-6">
            {[
              ['Historial de actividad', 'ActivityHistory'],
              ['Preferencias', 'Preferences'],
              ['Cambiar contraseña', 'ChangePassword'],
            ].map(([label, screen]) => (
              <Pressable
                key={label}
                onPress={() => navigation.navigate(screen as never)}
                className="mb-3 rounded-xl bg-indigo-600 px-4 py-3"
              >
                <Text className="text-center text-white">
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* ------------------------------------------------ */}
          {/* ✅ LOGOUT */}
          {/* ------------------------------------------------ */}
          <Pressable
            onPress={signOut}
            className="mt-6 rounded-xl bg-red-600 px-4 py-3"
          >
            <Text className="text-center text-white">
              Cerrar sesión
            </Text>
          </Pressable>

        </View>
      </ScrollView>

      {/* ------------------------------------------------ */}
      {/* ✅ MODAL EDICIÓN PERFIL */}
      {/* ------------------------------------------------ */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/40">
          <View className="w-[90%] rounded-2xl bg-white p-6">

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
              className="mt-4 rounded-lg border p-3"
            />

            <TextInput
              value={draftEmail}
              onChangeText={setDraftEmail}
              placeholder="Correo"
              className="mt-3 rounded-lg border p-3"
              keyboardType="email-address"
            />

            <View className="mt-6 flex-row justify-between">
              <Pressable
                onPress={() => setModalVisible(false)}
                className="px-4 py-2"
              >
                <Text>Cancelar</Text>
              </Pressable>

              <Pressable
                onPress={saveProfile}
                className="rounded-lg bg-emerald-600 px-4 py-2"
              >
                <Text className="text-white">
                  Guardar cambios
                </Text>
              </Pressable>
            </View>

          </View>
        </View>
      </Modal>

    </View>
  );
}
