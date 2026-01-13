// features/events/components/EventDetailModal.tsx
// Modal tipo "splash" con los datos detallados de un evento.
// Muestra los siguientes datos:
//  - Nombre
//  - Fecha
//  - Hora
//  - Lugar
//  - Descripción
//  - Etiquetas
//  - Duración

import React from 'react';
import { Image, Modal, Pressable, ScrollView, Text, View } from 'react-native';

import type { EventStudentItem } from '@/features/events/types/eventTypes';

type EventDetailModalProps = {
  visible: boolean;
  event: EventStudentItem | null;
  onClose: () => void;
};

export function EventDetailModal({
  visible,
  event,
  onClose,
}: EventDetailModalProps) {
  if (!event) {
    return null;
  }

  const tags = event.tags ?? [];

  const startsAt = event.startsAtIso ? new Date(event.startsAtIso) : null;

  const dateLabel = startsAt
    ? startsAt.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      })
    : 'Sin fecha';

  const timeLabel = startsAt
    ? startsAt.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Sin hora';

  // Valores por defecto cuando no hay datos.
  const locationLabel = event.location ?? 'Sin lugar';
  const descriptionLabel = event.description ?? 'Sin descripción.';

  let durationLabel = 'No especificada';

  if (
    typeof event.durationMinutes === 'number' &&
    !Number.isNaN(event.durationMinutes) &&
    event.durationMinutes > 0
  ) {
    const total = event.durationMinutes;

    if (total < 60) {
      durationLabel = `${total} min`;
    } else {
      const hours = Math.floor(total / 60);
      const mins = total % 60;

      if (mins === 0) {
        durationLabel = `${hours} h`;
      } else {
        durationLabel = `${hours} h ${mins} min`;
      }
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-slate-950/70">
        <Pressable onPress={onClose} className="absolute inset-0" />

        <View className="z-10 max-h-[80%] w-[94%] overflow-hidden rounded-3xl bg-slate-50 shadow-2xl dark:bg-slate-900 dark:shadow-black/60">
          <ScrollView
            contentContainerClassName="px-5 pt-4 pb-5"
            showsVerticalScrollIndicator
          >
            {/* Imagen superior, si el evento la define */}
            {event.imageUrl ? (
              <Image
                source={{ uri: event.imageUrl }}
                className="mb-4 h-48 w-full rounded-2xl"
                resizeMode="cover"
              />
            ) : null}

            {/* Encabezado: nombre del evento + botón para cerrar */}
            <View className="mb-4 flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="text-xl font-extrabold text-slate-900 dark:text-slate-50">
                  {event.title}
                </Text>
              </View>

              <Pressable
                onPress={onClose}
                className="rounded-full bg-slate-900 px-3 py-1 dark:bg-slate-100"
              >
                <Text className="text-xs font-semibold text-slate-50 dark:text-slate-900">
                  Cerrar
                </Text>
              </Pressable>
            </View>

            {/* Nombre */}
            <View className="mt-3">
              <Text className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Nombre
              </Text>
              <Text className="mt-1 text-base text-slate-900 dark:text-slate-100">
                {event.title}
              </Text>
            </View>

            {/* Fecha y hora */}
            <View className="mt-3 flex-row gap-6">
              <View className="flex-1">
                <Text className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Fecha
                </Text>
                <Text className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                  {dateLabel}
                </Text>
              </View>

              <View className="flex-1">
                <Text className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Hora
                </Text>
                <Text className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                  {timeLabel}
                </Text>
              </View>
            </View>

            {/* Lugar */}
            <View className="mt-3">
              <Text className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Lugar
              </Text>
              <Text className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                {locationLabel}
              </Text>
            </View>

            {/* Descripción */}
            <View className="mt-3">
              <Text className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Descripción
              </Text>
              <Text className="mt-1 text-sm leading-relaxed text-slate-900 dark:text-slate-100">
                {descriptionLabel}
              </Text>
            </View>

            {/* Etiquetas */}
            <View className="mt-3">
              <Text className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Etiquetas
              </Text>

              {tags.length > 0 ? (
                <View className="mt-2 flex-row flex-wrap gap-2">
                  {tags.map((tag) => (
                    <View
                      key={tag}
                      className="rounded-full bg-slate-200 px-3 py-1 dark:bg-slate-700"
                    >
                      <Text className="text-xs font-semibold text-slate-900 dark:text-slate-50">
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                  Sin etiquetas.
                </Text>
              )}
            </View>

            {/* Duración */}
            <View className="mt-3">
              <Text className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Duración
              </Text>
              <Text className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                {durationLabel}
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
