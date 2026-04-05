import * as ImageManipulator from 'expo-image-manipulator';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Svg, { Circle, Path } from 'react-native-svg';

type Props = {
  visible: boolean;
  sourceUri: string | null;
  sourceWidth: number;
  sourceHeight: number;
  onCancel: () => void;
  onConfirm: (croppedUri: string) => Promise<void> | void;
};

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const OUTPUT_SIZE = 1024;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function ProfilePhotoCropperModal({
  visible,
  sourceUri,
  sourceWidth,
  sourceHeight,
  onCancel,
  onConfirm,
}: Props) {
  const { width: viewportWidth } = useWindowDimensions();
  const cropSize = Math.min(viewportWidth - 32, 340);
  const baseScale = useMemo(() => {
    if (sourceWidth <= 0 || sourceHeight <= 0 || cropSize <= 0) {
      return 1;
    }

    return Math.max(cropSize / sourceWidth, cropSize / sourceHeight);
  }, [cropSize, sourceHeight, sourceWidth]);

  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const scaleRef = useRef(scale);
  const translateRef = useRef({ x: translateX, y: translateY });
  const panStartRef = useRef({ x: 0, y: 0 });
  const pinchStartScaleRef = useRef(1);

  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  useEffect(() => {
    translateRef.current = { x: translateX, y: translateY };
  }, [translateX, translateY]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
    setIsProcessing(false);
  }, [visible, sourceUri, sourceWidth, sourceHeight]);

  const getBounds = useCallback(
    (targetScale: number) => {
      const effectiveScale = baseScale * targetScale;
      const renderedWidth = sourceWidth * effectiveScale;
      const renderedHeight = sourceHeight * effectiveScale;

      return {
        maxX: Math.max(0, (renderedWidth - cropSize) / 2),
        maxY: Math.max(0, (renderedHeight - cropSize) / 2),
      };
    },
    [baseScale, cropSize, sourceHeight, sourceWidth],
  );

  const clampTranslation = useCallback(
    (x: number, y: number, targetScale: number) => {
      const bounds = getBounds(targetScale);
      return {
        x: clamp(x, -bounds.maxX, bounds.maxX),
        y: clamp(y, -bounds.maxY, bounds.maxY),
      };
    },
    [getBounds],
  );

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .maxPointers(1)
        .runOnJS(true)
        .onStart(() => {
          panStartRef.current = { ...translateRef.current };
        })
        .onUpdate((event) => {
          const next = clampTranslation(
            panStartRef.current.x + event.translationX,
            panStartRef.current.y + event.translationY,
            scaleRef.current,
          );
          setTranslateX(next.x);
          setTranslateY(next.y);
        }),
    [clampTranslation],
  );

  const pinchGesture = useMemo(
    () =>
      Gesture.Pinch()
        .runOnJS(true)
        .onStart(() => {
          pinchStartScaleRef.current = scaleRef.current;
        })
        .onBegin(() => {
          pinchStartScaleRef.current = scaleRef.current;
        })
        .onUpdate((event) => {
          const nextScale = clamp(
            pinchStartScaleRef.current * event.scale,
            MIN_SCALE,
            MAX_SCALE,
          );
          const clampedTranslation = clampTranslation(
            translateRef.current.x,
            translateRef.current.y,
            nextScale,
          );

          setScale(nextScale);
          setTranslateX(clampedTranslation.x);
          setTranslateY(clampedTranslation.y);
        }),
    [clampTranslation],
  );

  const composedGesture = useMemo(
    () => Gesture.Simultaneous(panGesture, pinchGesture),
    [panGesture, pinchGesture],
  );

  const baseImageWidth = sourceWidth * baseScale;
  const baseImageHeight = sourceHeight * baseScale;

  const overlayPath = useMemo(() => {
    const radius = cropSize / 2;
    return `M0 0H${cropSize}V${cropSize}H0Z M${radius} 0 A${radius} ${radius} 0 1 0 ${radius} ${cropSize} A${radius} ${radius} 0 1 0 ${radius} 0 Z`;
  }, [cropSize]);

  const handleConfirm = async () => {
    if (!sourceUri || sourceWidth <= 0 || sourceHeight <= 0) {
      return;
    }

    setIsProcessing(true);

    try {
      const currentScale = scaleRef.current;
      const currentTranslate = translateRef.current;

      const effectiveScale = baseScale * currentScale;
      const cropWidthPx = cropSize / effectiveScale;
      const cropHeightPx = cropSize / effectiveScale;

      const roundedCropWidth = Math.max(1, Math.round(cropWidthPx));
      const roundedCropHeight = Math.max(1, Math.round(cropHeightPx));

      const rawOriginX =
        (sourceWidth - cropWidthPx) / 2 - currentTranslate.x / effectiveScale;
      const rawOriginY =
        (sourceHeight - cropHeightPx) / 2 - currentTranslate.y / effectiveScale;

      const maxOriginX = Math.max(0, sourceWidth - roundedCropWidth);
      const maxOriginY = Math.max(0, sourceHeight - roundedCropHeight);

      const originX = clamp(Math.round(rawOriginX), 0, maxOriginX);
      const originY = clamp(Math.round(rawOriginY), 0, maxOriginY);

      const result = await ImageManipulator.manipulateAsync(
        sourceUri,
        [
          {
            crop: {
              originX,
              originY,
              width: roundedCropWidth,
              height: roundedCropHeight,
            },
          },
          {
            resize: {
              width: OUTPUT_SIZE,
              height: OUTPUT_SIZE,
            },
          },
        ],
        {
          compress: 0.85,
          format: ImageManipulator.SaveFormat.JPEG,
        },
      );

      await onConfirm(result.uri);
    } catch {
      Alert.alert(
        'No se pudo recortar la imagen',
        'Intenta seleccionar otra foto o vuelve a intentarlo.',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onCancel}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Pressable
              disabled={isProcessing}
              onPress={onCancel}
              style={styles.headerButton}
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>
            <Text style={styles.headerTitle}>Recortar foto</Text>
            <Pressable
              disabled={isProcessing || !sourceUri}
              onPress={handleConfirm}
              style={styles.headerButton}
            >
              <Text style={styles.confirmText}>Usar foto</Text>
            </Pressable>
          </View>

          <View style={styles.body}>
            <View
              style={[styles.cropWindow, { width: cropSize, height: cropSize }]}
            >
              {sourceUri ? (
                <GestureDetector gesture={composedGesture}>
                  <View style={styles.gestureSurface}>
                    <Image
                      source={{ uri: sourceUri }}
                      style={[
                        styles.image,
                        {
                          width: baseImageWidth,
                          height: baseImageHeight,
                          transform: [
                            { translateX },
                            { translateY },
                            { scale },
                          ],
                        },
                      ]}
                      resizeMode="cover"
                    />
                  </View>
                </GestureDetector>
              ) : null}

              <Svg
                pointerEvents="none"
                width={cropSize}
                height={cropSize}
                style={StyleSheet.absoluteFill}
              >
                <Path
                  d={overlayPath}
                  fill="rgba(15, 23, 42, 0.45)"
                  fillRule="evenodd"
                />
                <Circle
                  cx={cropSize / 2}
                  cy={cropSize / 2}
                  r={cropSize / 2 - 1}
                  fill="transparent"
                  stroke="#FFFFFF"
                  strokeWidth={2}
                />
              </Svg>
            </View>

            <Text style={styles.instructions}>
              Arrastra para encuadrar y usa pinza para acercar o alejar.
            </Text>

            {isProcessing ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color="#ffffff" />
                <Text style={styles.loadingText}>Procesando imagen...</Text>
              </View>
            ) : null}
          </View>
        </SafeAreaView>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020617',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButton: {
    minWidth: 80,
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelText: {
    color: '#CBD5E1',
    fontSize: 15,
    fontWeight: '600',
  },
  confirmText: {
    color: '#38BDF8',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'right',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 20,
  },
  cropWindow: {
    overflow: 'hidden',
    backgroundColor: '#0F172A',
  },
  gestureSurface: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    position: 'absolute',
  },
  instructions: {
    textAlign: 'center',
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 18,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '500',
  },
});
