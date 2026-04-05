// features/events/components/ScannedStudentModal.tsx
// Modal que muestra la información del alumno cuyo QR fue escaneado.
// Si el ID es reconocido, muestra su perfil completo.
// Si no se encuentra, muestra un estado de error claro.

import React from 'react';
import { Image, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import type { UserProfile } from '@/features/user/types/user-profile';

type Props = {
  visible: boolean;
  student: UserProfile | null;
  // null = alumno no encontrado, undefined = modal cerrado / sin escaneo
  notFound?: boolean;
  onClose: () => void;
};

function InfoRow({ label, value, isLast }: { label: string; value: string; isLast?: boolean }) {
  return (
    <View className={`px-4 py-3 ${isLast ? '' : 'border-b border-slate-200 dark:border-slate-700'}`}>
      <View className="flex-row items-center justify-between">
        <Text className="text-slate-500 dark:text-slate-400">{label}</Text>
        <Text className="font-semibold text-slate-900 dark:text-slate-100">{value}</Text>
      </View>
    </View>
  );
}

export function ScannedStudentModal({ visible, student, notFound, onClose }: Props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const palette = Colors[colorScheme ?? 'light'];

  const colors = {
    cardBg: isDark ? '#1e293b' : '#ffffff',
    cardBorder: isDark ? '#334155' : 'transparent',
    photoBg: isDark ? '#334155' : '#e2e8f0',
    photoRing: isDark ? '#1e293b' : '#ffffff',
    infoBoxBg: isDark ? '#0f172a' : '#f8fafc',
    infoBoxBorder: isDark ? '#334155' : '#e2e8f0',
    bandBg: isDark ? '#0f172a' : '#2563eb',
    bandText: isDark ? '#94a3b8' : '#ffffff',
    verifyText: isDark ? '#475569' : '#94a3b8',
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-slate-950/60">
        <Pressable onPress={onClose} className="absolute inset-0" />

        <View
          style={{
            width: '92%',
            maxHeight: '85%',
            borderRadius: 24,
            overflow: 'hidden',
            backgroundColor: colors.cardBg,
            borderWidth: isDark ? 1 : 0,
            borderColor: colors.cardBorder,
            elevation: 12,
            shadowColor: '#000',
            shadowOpacity: 0.35,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 6 },
          }}
        >
          <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>

            {/* ── CASO: ALUMNO NO ENCONTRADO ── */}
            {notFound ? (
              <View className="items-center px-6 py-10">
                <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <Text className="text-4xl">⚠️</Text>
                </View>
                <Text className="text-xl font-extrabold text-slate-900 dark:text-slate-50">
                  QR no reconocido
                </Text>
                <Text className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">
                  El código escaneado no corresponde a ningún alumno registrado en el sistema.
                </Text>
                <Pressable
                  onPress={onClose}
                  className="mt-8 w-full items-center rounded-2xl bg-red-500 py-3"
                >
                  <Text className="font-bold text-white">Cerrar</Text>
                </Pressable>
              </View>
            ) : student ? (

              /* ── CASO: ALUMNO ENCONTRADO ── */
              <>
                {/* Banda de rol */}
                <View style={{ backgroundColor: colors.bandBg, paddingVertical: 16, alignItems: 'center' }}>
                  <Text style={{ color: colors.bandText, fontWeight: 'bold', letterSpacing: 2, fontSize: 12 }}>
                    ALUMNO VERIFICADO ✓
                  </Text>
                </View>

                <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
                  {/* Foto + nombre */}
                  <View className="flex-row items-center gap-4 pt-2">
                    <View
                      style={{
                        marginTop: -28,
                        height: 80,
                        width: 80,
                        borderRadius: 40,
                        backgroundColor: colors.photoRing,
                        padding: 3,
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          borderRadius: 40,
                          overflow: 'hidden',
                          backgroundColor: colors.photoBg,
                        }}
                      >
                        {student.foto ? (
                          <Image
                            source={{ uri: student.foto }}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="cover"
                          />
                        ) : (
                          <View className="flex-1 items-center justify-center">
                            <Text className="text-2xl">👤</Text>
                          </View>
                        )}
                      </View>
                    </View>

                    <View className="flex-1 pt-2">
                      <Text
                        className="text-base font-bold text-slate-900 dark:text-slate-50"
                        numberOfLines={2}
                      >
                        {student.nombre}
                      </Text>
                      <Text className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        ID: {student.id}
                      </Text>
                    </View>
                  </View>

                  {/* Datos del alumno */}
                  <View
                    style={{
                      marginTop: 16,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: colors.infoBoxBorder,
                      backgroundColor: colors.infoBoxBg,
                      overflow: 'hidden',
                    }}
                  >
                    <InfoRow label="Correo" value={student.correo} />
                    <InfoRow label="Carrera" value={student.carrera} />
                    <InfoRow label="Grado" value={student.grado} />
                    <InfoRow label="Grupo" value={student.grupo} />
                    <InfoRow label="Nivel" value={student.nivel_academico} isLast />
                  </View>

                  {/* Verificación */}
                  <Text
                    className="mt-3 text-center text-[11px]"
                    style={{ color: colors.verifyText }}
                  >
                    Documento digital verificado
                  </Text>

                  {/* Botón cerrar */}
                  <Pressable
                    onPress={onClose}
                    className="mt-5 items-center rounded-2xl bg-emerald-500 py-3 dark:bg-emerald-400"
                  >
                    <Text className="font-bold text-white">Cerrar</Text>
                  </Pressable>
                </View>
              </>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
