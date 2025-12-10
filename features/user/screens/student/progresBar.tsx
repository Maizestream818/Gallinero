// components/ProgressBar.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

// Constantes de tiempo
const TIME_LIMIT = 20000; // 20 segundos en milisegundos

interface ProgressBarProps {
  onTimeEnd: () => void;
  isDark: boolean;
}

export function ProgressBar({ onTimeEnd, isDark }: ProgressBarProps) {
  // Animación para el ancho de la barra (de 0 a 100%)
  const animatedWidth = useRef(new Animated.Value(0)).current;
  // Animación para el color (de 0=Verde a 1=Rojo)
  const animatedColor = useRef(new Animated.Value(0)).current;

  // Colores interpolados para la barra
  const barColor = animatedColor.interpolate({
    inputRange: [0, 0.5, 1], // 0% (inicio) -> 50% (mitad) -> 100% (final) del tiempo
    outputRange: ['#10b981', '#fcd34d', '#ef4444'], // emerald -> amber -> red
    extrapolate: 'clamp',
  });

  // Estilo de fondo para el contenedor (dependiendo del tema)
  const containerBgClass = isDark ? 'bg-slate-700' : 'bg-gray-200';

  useEffect(() => {
    // 1. Resetear el estado de la barra
    animatedWidth.setValue(0);
    animatedColor.setValue(0);

    // 2. Iniciar la animación de la barra (0% a 100%)
    const widthAnimation = Animated.timing(animatedWidth, {
      toValue: 100,
      duration: TIME_LIMIT,
      easing: Easing.linear,
      useNativeDriver: false,
    });

    // 3. Iniciar la animación del color (Verde a Rojo)
    const colorAnimation = Animated.timing(animatedColor, {
      toValue: 1,
      duration: TIME_LIMIT,
      easing: Easing.linear,
      useNativeDriver: false,
    });

    // Ejecutar ambas animaciones en paralelo
    Animated.parallel([widthAnimation, colorAnimation]).start(
      ({ finished }) => {
        // Cuando la animación termina, llamar a la función de callback
        if (finished) {
          onTimeEnd();
        }
      },
    );

    // Limpiar animaciones en el desmontaje
    return () => {
      widthAnimation.stop();
      colorAnimation.stop();
    };
  }, [onTimeEnd]); // Se reinicia cada vez que onTimeEnd se ejecuta (cada 20s)

  return (
    <View
      className={`h-2 w-full overflow-hidden rounded-full ${containerBgClass}`}
    >
      <Animated.View
        style={{
          height: '100%',
          backgroundColor: barColor,
          width: animatedWidth.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
          }),
        }}
      />
    </View>
  );
}
