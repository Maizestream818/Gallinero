import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

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

  // Tema del sistema para aplicar colores al modal
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const palette = Colors[colorScheme ?? 'light'];

  // Colores del modal según el tema del sistema
  const colors = {
    overlay: 'rgba(0,0,0,0.5)',
    sheetBg: isDark ? '#1e293b' : '#ffffff',
    title: palette.text,
    cancelText: '#ef4444',
    label: palette.icon,
    inputBg: isDark ? '#0f172a' : '#f1f5f9',
    inputBorder: isDark ? '#334155' : '#e2e8f0',
    inputText: palette.text,
    inputPlaceholder: isDark ? '#475569' : '#94a3b8',
    saveBtnBg: '#2563eb',
    saveBtnText: '#ffffff',
    saveBtnDisabled: isDark ? '#1e3a5f' : '#93c5fd',
  };

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

  // Campo de texto reutilizable con estilos del tema
  const Field = ({
    label,
    value,
    onChange,
    keyboardType,
    flex,
  }: {
    label: string;
    value: string;
    onChange: (text: string) => void;
    keyboardType?: 'default' | 'email-address';
    flex?: number;
  }) => (
    <View style={{ flex, marginBottom: 12 }}>
      <Text style={{ color: colors.label, fontSize: 12, fontWeight: '600', marginBottom: 6 }}>
        {label}
      </Text>
      <TextInput
        style={{
          borderRadius: 10,
          backgroundColor: colors.inputBg,
          borderWidth: 1,
          borderColor: colors.inputBorder,
          color: colors.inputText,
          paddingHorizontal: 12,
          paddingVertical: 10,
          fontSize: 15,
        }}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType ?? 'default'}
        placeholderTextColor={colors.inputPlaceholder}
      />
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: colors.overlay }}>
        {/* Hoja inferior que respeta el tema del sistema */}
        <View
          style={{
            height: '80%',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: colors.sheetBg,
            padding: 20,
          }}
        >
          {/* Encabezado */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.title }}>
              Editar datos
            </Text>
            <Pressable onPress={onClose}>
              <Text style={{ color: colors.cancelText, fontWeight: '600' }}>Cancelar</Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Field
              label="Nombre"
              value={formData.nombre}
              onChange={(text) => setFormData((p) => ({ ...p, nombre: text }))}
            />

            <Field
              label="Correo"
              value={formData.correo}
              onChange={(text) => setFormData((p) => ({ ...p, correo: text }))}
              keyboardType="email-address"
            />

            <Field
              label="Carrera"
              value={formData.carrera}
              onChange={(text) => setFormData((p) => ({ ...p, carrera: text }))}
            />

            {/* Grado y Grupo en la misma fila */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Field
                label="Grado"
                value={formData.grado}
                onChange={(text) => setFormData((p) => ({ ...p, grado: text }))}
                flex={1}
              />
              <Field
                label="Grupo"
                value={formData.grupo}
                onChange={(text) => setFormData((p) => ({ ...p, grupo: text }))}
                flex={1}
              />
            </View>

            <Field
              label="Nivel academico"
              value={formData.nivel_academico}
              onChange={(text) => setFormData((p) => ({ ...p, nivel_academico: text }))}
            />

            {/* Botón guardar */}
            <Pressable
              disabled={isSaving}
              onPress={handleSave}
              style={{
                alignItems: 'center',
                borderRadius: 10,
                paddingVertical: 12,
                backgroundColor: isSaving ? colors.saveBtnDisabled : colors.saveBtnBg,
                marginTop: 4,
              }}
            >
              <Text style={{ fontWeight: 'bold', color: colors.saveBtnText }}>
                {isSaving ? 'Guardando...' : 'Guardar'}
              </Text>
            </Pressable>

            <View style={{ height: 24 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
