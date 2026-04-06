import type { EventStudentItem } from '@/features/events/types/eventTypes';
import { Image, Text, View } from 'react-native';

type Props = {
  event: EventStudentItem;
  width: number;
};

export function EventBannerCarouselItem({ event, width }: Props) {
  return (
    <View style={{ width }} className="px-4">
      <View className="overflow-hidden rounded-2xl">
        <Image
          source={{ uri: event.imageUrl }}
          className="h-48 w-full"
          resizeMode="cover"
        />
        {/* Overlay degradado con título */}
        <View className="absolute right-0 bottom-0 left-0 bg-black/40 px-4 py-3">
          <Text
            className="text-base font-bold text-white"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {event.title}
          </Text>
        </View>
      </View>
    </View>
  );
}
