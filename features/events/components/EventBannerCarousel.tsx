import type { EventStudentItem } from '@/features/events/types/eventTypes';
import { EVENTS_SEED } from '@/features/events/data/EventSeed';
import { useRef, useState } from 'react';
import { FlatList, useWindowDimensions, View, ViewToken } from 'react-native';
import { EventBannerCarouselItem } from './EventBannerCarouselItem';

const BANNER_EVENTS = EVENTS_SEED.filter((e) => !!e.imageUrl);

type Props = {
  events?: EventStudentItem[];
};

export function EventBannerCarousel({ events = BANNER_EVENTS }: Props) {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index ?? 0);
      }
    },
  );

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  return (
    <View>
      <FlatList
        data={events}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        decelerationRate="fast"
        snapToAlignment="start"
        nestedScrollEnabled
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig.current}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({ item }) => (
          <EventBannerCarouselItem event={item} width={width} />
        )}
      />

      <View className="mt-4 flex-row justify-center gap-2">
        {events.map((_, i) => (
          <View
            key={i}
            className={`h-3 rounded-full ${
              i === activeIndex
                ? 'w-6 bg-blue-500'
                : 'w-3 bg-slate-300 dark:bg-slate-600'
            }`}
          />
        ))}
      </View>
    </View>
  );
}