import { EventBannerCarousel } from '@/features/events/components/EventBannerCarousel';
import { SectionHeader } from '@/components/ui/SectionHeader';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function EventsStudentMainScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView className="flex-1 bg-slate-50 dark:bg-slate-900">
      <View style={{ paddingTop: insets.top + 12 }}>
        {/* Carrusel de banners — edge-to-edge, sin padding lateral */}
        <EventBannerCarousel />

        <View className="px-4 pt-6">
          <SectionHeader title="Hoy" count={3} />
          <View className="mb-6" />

          <SectionHeader title="Esta semana" count={7} />
          <View className="mb-6" />

          <SectionHeader title="Próximos" count={1} />
        </View>
      </View>
    </ScrollView>
  );
}
