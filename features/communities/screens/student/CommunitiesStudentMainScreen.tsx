// features/communities/screens/student/CommunitiesStudentMainScreen.tsx
import React from 'react';
import { Text, View } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export function CommunitiesStudentMainScreen() {
  // Respeta el tema del sistema (dark/light) usando la paleta de Colors
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: palette.background,
      }}
    >
      <Text
        style={{
          fontSize: 22,
          fontWeight: 'bold',
          color: palette.text,
        }}
      >
        Comunidades
      </Text>
    </View>
  );
}
