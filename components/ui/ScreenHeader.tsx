// components/ui/ScreenHeader.tsx
// Header de pantalla con título y botón de búsqueda.
// Al presionar la lupa, el título hace fade-out y EventsSearchExpanded hace fade-in.
// Saul conectará la lógica de búsqueda dentro de EventsSearchExpanded.

import { IconSymbol } from '@/components/ui/icon-symbol';
import { EventsSearchExpanded } from '@/features/events/components/EventsSearchExpanded';
import React, { useRef, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  title: string;
};

export function ScreenHeader({ title }: Props) {
  const insets = useSafeAreaInsets();
  const [searchOpen, setSearchOpen] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const toggleSearch = (open: boolean) => {
    // Fade out del estado actual
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      // Swap de contenido cuando ya está invisible
      setSearchOpen(open);
      // Fade in del nuevo estado
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <View
      style={{ paddingTop: insets.top + 8 }}
      className="bg-white px-4 pb-3 dark:bg-slate-900"
    >
      <Animated.View style={{ opacity: fadeAnim }}>
        {searchOpen ? (
          /* ── Modo búsqueda ── */
          <View className="flex-row items-center gap-2">
            <View className="flex-1">
              {/* Saul conectará EventsSearchExpanded aquí */}
              <EventsSearchExpanded />
            </View>
            <Pressable
              onPress={() => toggleSearch(false)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <IconSymbol name="xmark.circle.fill" size={26} color="#94a3b8" />
            </Pressable>
          </View>
        ) : (
          /* ── Modo título ── */
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-slate-900 dark:text-slate-50">
              {title}
            </Text>
            <Pressable
              onPress={() => toggleSearch(true)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <IconSymbol name="magnifyingglass" size={24} color="#3b82f6" />
            </Pressable>
          </View>
        )}
      </Animated.View>
    </View>
  );
}
