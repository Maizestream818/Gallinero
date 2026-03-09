import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import type { UserProfile } from '@/features/user/types/user-profile';

type Props = {
  visible: boolean;
  onClose: () => void;
  user: UserProfile;
  onSave: (user: UserProfile) => Promise<void> | void;
};

export function UserEditProfileModal({
  visible,
  onClose,
  user,
  onSave,
}: Props) {
  const [formData, setFormData] = useState<UserProfile>(user);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch {
      Alert.alert(
        'No se pudo guardar',
        'Intenta nuevamente. Tus cambios locales permanecen visibles.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="h-[80%] rounded-t-2xl bg-white p-5">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-bold">Editar datos</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-red-500">Cancelar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mb-3">
              <Text>Nombre</Text>
              <TextInput
                className="rounded-lg bg-slate-100 p-3"
                value={formData.nombre}
                onChangeText={(text) =>
                  setFormData((previous) => ({ ...previous, nombre: text }))
                }
              />
            </View>

            <View className="mb-3">
              <Text>Correo</Text>
              <TextInput
                className="rounded-lg bg-slate-100 p-3"
                value={formData.correo}
                keyboardType="email-address"
                onChangeText={(text) =>
                  setFormData((previous) => ({ ...previous, correo: text }))
                }
              />
            </View>

            <View className="mb-3">
              <Text>Carrera</Text>
              <TextInput
                className="rounded-lg bg-slate-100 p-3"
                value={formData.carrera}
                onChangeText={(text) =>
                  setFormData((previous) => ({ ...previous, carrera: text }))
                }
              />
            </View>

            <View className="mb-3 flex-row gap-3">
              <View className="flex-1">
                <Text>Grado</Text>
                <TextInput
                  className="rounded-lg bg-slate-100 p-3"
                  value={formData.grado}
                  onChangeText={(text) =>
                    setFormData((previous) => ({ ...previous, grado: text }))
                  }
                />
              </View>

              <View className="flex-1">
                <Text>Grupo</Text>
                <TextInput
                  className="rounded-lg bg-slate-100 p-3"
                  value={formData.grupo}
                  onChangeText={(text) =>
                    setFormData((previous) => ({ ...previous, grupo: text }))
                  }
                />
              </View>
            </View>

            <View className="mb-5">
              <Text>Nivel academico</Text>
              <TextInput
                className="rounded-lg bg-slate-100 p-3"
                value={formData.nivel_academico}
                onChangeText={(text) =>
                  setFormData((previous) => ({
                    ...previous,
                    nivel_academico: text,
                  }))
                }
              />
            </View>

            <TouchableOpacity
              className="items-center rounded-lg bg-blue-600 p-3"
              disabled={isSaving}
              onPress={handleSave}
            >
              <Text className="font-bold text-white">
                {isSaving ? 'Guardando...' : 'Guardar'}
              </Text>
            </TouchableOpacity>

            <View className="h-6" />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
