import React, { useMemo } from 'react';
import { ImageBackground, Text, View } from 'react-native';

import type { EventStudentItem } from '@/features/events/types/eventTypes';

type EventBannerCarouselItemProps = {
  event: EventStudentItem;
};

function formatEventDate(event: EventStudentItem): string {
  const rawEvent = event as unknown as Record<string, unknown>;

  const possibleDate =
    rawEvent.date ??
    rawEvent.eventDate ??
    rawEvent.startDate ??
    rawEvent.startsAt ??
    rawEvent.fecha;

  if (!possibleDate) return '';

  if (typeof possibleDate === 'string' || typeof possibleDate === 'number') {
    const parsed = new Date(possibleDate);

    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    }

    return String(possibleDate);
  }

  return '';
}

export function EventBannerCarouselItem({
  event,
}: EventBannerCarouselItemProps) {
  const formattedDate = useMemo(() => formatEventDate(event), [event]);

  if (!event.imageUrl) return null;

  return (
    <View className="w-full overflow-hidden rounded-[28px]">
      <ImageBackground
        source={{ uri: event.imageUrl }}
        resizeMode="cover"
        className="h-52 w-full justify-end"
        imageStyle={{ borderRadius: 28 }}
      >
        <View className="h-full w-full justify-end bg-black/35 px-5 py-4">
          <Text
            className="text-xl font-extrabold text-white"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {event.title}
          </Text>

          {formattedDate ? (
            <Text
              className="mt-2 text-sm font-medium text-white/90"
              numberOfLines={1}
            >
              {formattedDate}
            </Text>
          ) : null}
        </View>
      </ImageBackground>
    </View>
  );
}
