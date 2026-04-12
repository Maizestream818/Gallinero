import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionHeader } from '@/components/ui/SectionHeader';

import { EventBannerCarousel } from '@/features/events/components/EventBannerCarousel';
import { EventCardNoImage } from '@/features/events/components/EventCardNoImage';
import { EventCardWithImage } from '@/features/events/components/EventCardWithImage';
import { EventDetailModal } from '@/features/events/components/EventDetailModal';
import { CategoryFilter } from '@/features/events/components/CategoryFilter';

import { EVENTS_SEED } from '@/features/events/components/EventSeed';
import { useEventFilters } from '@/features/events/hooks/useEventFilters';

function getEventCategories(event: any): string[] {
  const possibleValues = [
    event.category,
    event.section,
    event.tag,
    event.area,
    event.tipo,
    event.categories,
    event.tags,
  ];

  const result: string[] = [];

  possibleValues.forEach((value) => {
    if (typeof value === 'string' && value.trim()) {
      result.push(value.trim());
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (typeof item === 'string' && item.trim()) {
          result.push(item.trim());
        }
      });
    }
  });

  return result;
}

export function EventsStudentMainScreen() {
  const insets = useSafeAreaInsets();

  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const eventsByCategory = useMemo(() => {
    if (selectedCategories.length === 0) return EVENTS_SEED;

    return EVENTS_SEED.filter((event: any) => {
      const eventCategories = getEventCategories(event);

      return eventCategories.some((category) =>
        selectedCategories.includes(category),
      );
    });
  }, [selectedCategories]);

  const { today, week, upcoming } = useEventFilters({
    events: eventsByCategory ?? [],
    query: searchQuery,
    sections: {
      today: true,
      week: true,
      upcoming: true,
    },
  });

  const bannerEvents = useMemo(() => {
    const allEvents = [...today, ...week, ...upcoming];

    return allEvents.filter(
      (event: any) =>
        event.image ||
        event.imageUrl ||
        event.banner ||
        event.poster ||
        event.cover
    );
  }, [today, week, upcoming]);

  const handleOpenDetail = (event: any) => {
    setSelectedEvent(event);
    setDetailVisible(true);
  };

  const handleCloseDetail = () => {
    setDetailVisible(false);
    setSelectedEvent(null);
  };

  const renderEventCard = (event: any) => {
    const hasImage =
      !!event.image ||
      !!event.imageUrl ||
      !!event.banner ||
      !!event.poster ||
      !!event.cover;

    if (hasImage) {
      return (
        <EventCardWithImage
          key={String(event.id)}
          event={event}
          onPress={() => handleOpenDetail(event)}
        />
      );
    }

    return (
      <EventCardNoImage
        key={String(event.id)}
        event={event}
        onPress={() => handleOpenDetail(event)}
      />
    );
  };

  return (
    <>
      <View className="flex-1 bg-white dark:bg-[#020b2d]">
        <ScrollView
          className="flex-1 bg-white dark:bg-[#020b2d]"
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ paddingTop: insets.top + 8 }}>
            <View className="px-4 pb-2">
              <ScreenHeader title="EVENTOS" />
            </View>

            <View className="mt-3 px-4">
              <View className="flex-row items-center gap-3">
                <View className="flex-1 flex-row items-center rounded-2xl border border-slate-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                  <View className="mr-3">
                    <View className="h-5 w-5 rounded-full border-2 border-blue-500" />
                  </View>

                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Buscar eventos"
                    placeholderTextColor="#94A3B8"
                    className="flex-1 text-base text-slate-900 dark:text-white"
                  />
                </View>

                <Pressable
                  onPress={() => setFiltersVisible(true)}
                  className="items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
                >
                  <View className="items-center justify-center">
                    <View className="mb-1 h-[2px] w-5 bg-blue-500" />
                    <View className="mb-1 h-[2px] w-4 bg-blue-500" />
                    <View className="h-[2px] w-3 bg-blue-500" />
                  </View>
                </Pressable>
              </View>
            </View>

            <View className="mt-4">
              <EventBannerCarousel events={bannerEvents} />
            </View>

            <View className="px-4 pt-4">
              {today.length > 0 && (
                <View className="mb-8">
                  <SectionHeader title="Hoy" count={today.length} />
                  <View className="mt-4 gap-4">
                    {today.map((event: any) => renderEventCard(event))}
                  </View>
                </View>
              )}

              {week.length > 0 && (
                <View className="mb-8">
                  <SectionHeader title="Esta semana" count={week.length} />
                  <View className="mt-4 gap-4">
                    {week.map((event: any) => renderEventCard(event))}
                  </View>
                </View>
              )}

              {upcoming.length > 0 && (
                <View className="mb-8">
                  <SectionHeader title="Próximos" count={upcoming.length} />
                  <View className="mt-4 gap-4">
                    {upcoming.map((event: any) => renderEventCard(event))}
                  </View>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>

      <EventDetailModal
        visible={detailVisible}
        event={selectedEvent}
        onClose={handleCloseDetail}
      />

      <CategoryFilter
        visible={filtersVisible}
        events={EVENTS_SEED}
        value={selectedCategories}
        onChange={setSelectedCategories}
        onClose={() => setFiltersVisible(false)}
      />
    </>
  );
}