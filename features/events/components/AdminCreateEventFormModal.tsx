/*Componente que maneja el diseño del formulario para una nueva publicación/evento 
tomando en cuenta las estandarizaciones que se manejan en la vista administradora
y usuario normal para cada evento.
De momento deshabilitado hasta encontrar una forma de guardarlo localmente o tener 
una base de datos funcional.*/
import React from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function AdminCreateEventFormModal({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-slate-900/60">
        <Pressable onPress={onClose} className="absolute inset-0" />

        <View className="w-[94%] max-h-[85%] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
          <ScrollView contentContainerClassName="p-5">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-extrabold text-slate-900 dark:text-slate-50">
                Crear publicación
              </Text>

              <Pressable
                onPress={onClose}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 dark:border-slate-700 dark:bg-slate-900"
              >
                <Text className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                  Cerrar
                </Text>
              </Pressable>
            </View>

            {/* Imagen (placeholder) */}
            <View className="mt-4 h-44 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-900">
              <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Imagen (pendiente)
              </Text>
              <Text className="mt-1 text-xs text-slate-500 dark:text-slate-300">
                Próximamente: seleccionar desde galería
              </Text>
            </View>

            {/* Título */}
            <Text className="mt-5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              Título
            </Text>
            <TextInput
              editable={false}
              value=""
              placeholder="Ej. Taller de React Native"
              placeholderTextColor="#94a3b8"
              className="mt-2 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
            />

            {/* Fecha/Hora */}
            <Text className="mt-4 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              Fecha y hora
            </Text>
            <TextInput
              editable={false}
              value=""
              placeholder="Seleccionar fecha y hora (pendiente)"
              placeholderTextColor="#94a3b8"
              className="mt-2 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
            />

            {/* Lugar */}
            <Text className="mt-4 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              Lugar
            </Text>
            <TextInput
              editable={false}
              value=""
              placeholder="Ej. Aula 12 / Laboratorio"
              placeholderTextColor="#94a3b8"
              className="mt-2 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
            />

            {/* Descripción */}
            <Text className="mt-4 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              Descripción
            </Text>
            <TextInput
              editable={false}
              value=""
              multiline
              placeholder="Descripción del evento (pendiente)"
              placeholderTextColor="#94a3b8"
              className="mt-2 min-h-[96px] rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
            />

            {/* Etiquetas */}
            <Text className="mt-5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              Etiquetas
            </Text>
            <View className="mt-3 flex-row flex-wrap gap-2">
              {['Proyecto', 'Taller', 'Asesoría', 'Cultural'].map((tag) => (
                <View
                  key={tag}
                  className="rounded-full bg-slate-100 px-3 py-1 opacity-60 dark:bg-slate-700"
                >
                  <Text className="text-[11px] font-semibold text-slate-700 dark:text-slate-100">
                    {tag}
                  </Text>
                </View>
              ))}
            </View>

            {/* Botón deshabilitado */}
            <View className="mt-6 rounded-2xl bg-slate-200 px-4 py-4 dark:bg-slate-700">
              <Text className="text-center text-sm font-bold text-slate-500 dark:text-slate-300">
                Publicar (pendiente)
              </Text>
            </View>

            <Text className="mt-4 text-xs text-slate-500 dark:text-slate-300">
              
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
