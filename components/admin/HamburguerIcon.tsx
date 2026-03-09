import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

type Props = {
  size?: number;
  lineHeight?: number;
  gap?: number;
  color?: string;
  open?: boolean;
};

export function HamburgerIcon({
  size = 22,
  lineHeight = 2.5,
  gap = 5,
  color = '#000000',
  open = false,
}: Props) {
  const progress = useRef(new Animated.Value(open ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: open ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [open, progress]);

  const offset = gap + lineHeight;
  const lineBaseStyle = {
    position: 'absolute' as const,
    left: 0,
    height: lineHeight,
    width: size,
    backgroundColor: color,
    borderRadius: 999,
  };

  const topTranslateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, offset],
  });
  const bottomTranslateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -offset],
  });
  const topRotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });
  const bottomRotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-45deg'],
  });
  const middleOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <View style={{ width: size, height: lineHeight + offset * 2 }}>
      <Animated.View
        style={[
          lineBaseStyle,
          {
            top: 0,
            transform: [{ translateY: topTranslateY }, { rotate: topRotate }],
          },
        ]}
      />
      <Animated.View
        style={[
          lineBaseStyle,
          {
            top: offset,
            opacity: middleOpacity,
          },
        ]}
      />
      <Animated.View
        style={[
          lineBaseStyle,
          {
            top: offset * 2,
            transform: [
              { translateY: bottomTranslateY },
              { rotate: bottomRotate },
            ],
          },
        ]}
      />
    </View>
  );
}
