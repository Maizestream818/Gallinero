import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Text, View } from 'react-native';

interface BarraProps {
  duration?: number; // tiempo en esperar en milisegundos
  onTimeout: () => void;
}

export function Barra({ duration = 10000, onTimeout }: BarraProps) {
    
  // Valor que controla el avance de la barra del  0 a 1
  const barValue = useRef(new Animated.Value(0)).current;

  // Segundos visibles en pantalla
  const [timeLeft, setTimeLeft] = useState(duration / 1000);

  useEffect(() => {
    let mounted = true;

    // Listener para actualizar los segundos restantes
    const barListener = barValue.addListener(({ value }) => {
      const secondsLeft = Math.ceil((1 - value) * (duration / 1000));

      setTimeLeft((current) => {
        if (current !== secondsLeft && secondsLeft >= 0) {
          return secondsLeft;
        }
        return current;
      });
    });

    const runBar = () => {
      barValue.setValue(0);
      setTimeLeft(duration / 1000);

      Animated.timing(barValue, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished && mounted) {
          onTimeout();
          runBar(); // vuelve a empezar
        }
      });
    };

    runBar();

    return () => {
      mounted = false;
      barValue.removeListener(barListener);
      barValue.stopAnimation();
    };
  }, [duration, onTimeout]);

  // Ancho de la barra
  const barWidth = barValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  // Color segun el progreso
  const barColor = barValue.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: ['#3b82f6', '#3b82f6', '#ef4444'],
  });

  return (
    <View className="mx-auto mt-6 w-full max-w-[250px]">
      <View className="mb-2 flex-row items-center justify-between px-1">
        <Text className="text-xs font-medium text-slate-500">
          Actualizando código en:
        </Text>
        <Text
          className={`text-sm font-bold ${
            timeLeft <= 3 ? 'text-red-500' : 'text-blue-600'
          }`}
        >
          {timeLeft}s
        </Text>
      </View>

      <View className="h-3 w-full overflow-hidden rounded-full border border-slate-300 bg-slate-200">
        <Animated.View
          style={{
            width: barWidth,
            backgroundColor: barColor,
            height: '100%',
          }}
        />
      </View>
    </View>
  );
}
