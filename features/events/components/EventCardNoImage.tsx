// features/events/components/EventCardNoImage.tsx
// Card compacta de evento SIN imagen para grid de 2 columnas.
// Muestra: Nombre y Etiquetas.

import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import type { EventStudentItem } from '@/features/events/types/eventTypes';

type EventCardNoImageProps = {
  event: EventStudentItem;
  onPress: (event: EventStudentItem) => void;
};

type TagItem = {
  id: string;
  label: string;
  len: number;
};

type ChipWidthMap = Record<string, number>;

type PackedItem =
  | { type: 'tag'; id: string; label: string }
  | { type: 'plus'; label: string };

// Calcula el ancho de un item (tag o +N).
function getPackedItemWidth(
  item: PackedItem,
  chipWidths: ChipWidthMap,
  plusChipWidthWorstCase: number,
): number {
  if (item.type === 'plus') return plusChipWidthWorstCase;
  return chipWidths[item.id] ?? 0;
}

// Empaqueta items en máximo 2 filas sin wrap automático.
function packIntoTwoRows(params: {
  items: PackedItem[];
  rowWidth: number;
  chipWidths: ChipWidthMap;
  plusChipWidthWorstCase: number;
  gapPx: number;
}): PackedItem[][] | null {
  const { items, rowWidth, chipWidths, plusChipWidthWorstCase, gapPx } = params;

  if (rowWidth <= 0) return null;

  const rows: PackedItem[][] = [[], []];
  let currentRow = 0;
  let currentWidth = 0;

  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    const w = getPackedItemWidth(item, chipWidths, plusChipWidthWorstCase);

    if (w <= 0) return null;

    const needsGap = rows[currentRow].length > 0 ? gapPx : 0;
    const needed = needsGap + w;

    if (currentWidth + needed <= rowWidth) {
      rows[currentRow].push(item);
      currentWidth += needed;
      continue;
    }

    // Si estamos en la primera fila, intentar colocar en la segunda.
    if (currentRow === 0) {
      currentRow = 1;
      currentWidth = 0;

      const needsGapRow2 = rows[currentRow].length > 0 ? gapPx : 0;
      const neededRow2 = needsGapRow2 + w;

      if (currentWidth + neededRow2 <= rowWidth) {
        rows[currentRow].push(item);
        currentWidth += neededRow2;
        continue;
      }

      // No cabe ni siquiera al iniciar la segunda fila.
      return null;
    }

    return null;
  }

  return rows;
}

export function EventCardNoImage({ event, onPress }: EventCardNoImageProps) {
  const tags = useMemo<string[]>(() => event.tags ?? [], [event.tags]);

  // Orden por longitud ascendente (primero las más cortas).
  const sortedTags = useMemo<TagItem[]>(() => {
    return tags
      .map((t, originalIndex) => ({
        id: `${t}__${originalIndex}`,
        label: t,
        len: t.length,
      }))
      .sort((a, b) => a.len - b.len);
  }, [tags]);

  // Estados de medición para calcular qué chips caben en 2 filas.
  const [rowWidth, setRowWidth] = useState<number>(0);
  const [chipWidths, setChipWidths] = useState<ChipWidthMap>({});
  const [plusChipWidthWorstCase, setPlusChipWidthWorstCase] =
    useState<number>(0);

  const GAP_PX = 4;

  const { rowsToRender, overflowCount } = useMemo(() => {
    const total = sortedTags.length;

    if (total === 0 || rowWidth <= 0) {
      return { rowsToRender: null as PackedItem[][] | null, overflowCount: 0 };
    }

    // Verifica que todos los chips de tags ya se hayan medido.
    const allMeasured = sortedTags.every((t) => chipWidths[t.id] != null);
    if (!allMeasured) {
      return { rowsToRender: null, overflowCount: 0 };
    }

    // Verifica que el chip "+N" (peor caso) ya se haya medido.
    // Aunque no siempre se use, se requiere para reservar ancho correctamente cuando hay overflow.
    if (plusChipWidthWorstCase <= 0 && total > 1) {
      return { rowsToRender: null, overflowCount: 0 };
    }

    // Busca el máximo K que quepa (de total hacia 0) para asegurar que no haya desbordes.
    for (let k = total; k >= 0; k -= 1) {
      const overflow = total - k;

      const items: PackedItem[] = sortedTags
        .slice(0, k)
        .map((t) => ({ type: 'tag', id: t.id, label: t.label }));

      if (overflow > 0) {
        items.push({ type: 'plus', label: `+${overflow}` });
      }

      const packed = packIntoTwoRows({
        items,
        rowWidth,
        chipWidths,
        plusChipWidthWorstCase,
        gapPx: GAP_PX,
      });

      if (packed) {
        return { rowsToRender: packed, overflowCount: overflow };
      }
    }

    // Caso extremo: no cabe ni con k=0 (raro si el "+N" está correctamente medido).
    return { rowsToRender: null, overflowCount: total };
  }, [sortedTags, rowWidth, chipWidths, plusChipWidthWorstCase]);

  return (
    <Pressable
      onPress={() => onPress(event)}
      className="h-56 overflow-hidden rounded-2xl bg-slate-800/95 dark:bg-slate-800"
    >
      <View className="flex-1 justify-center p-3">
        {/* // Nombre: si excede 2 líneas, aparece "...". */}
        <Text
          className="text-sm font-semibold text-slate-50"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {event.title}
        </Text>

        {/* // Chips: máximo 2 filas. */}
        {sortedTags.length > 0 ? (
          <View
            className="mt-2"
            onLayout={(e) => setRowWidth(e.nativeEvent.layout.width)}
          >
            {rowsToRender ? (
              <>
                {/* // Fila 1. */}
                {rowsToRender[0].length > 0 ? (
                  <View className="flex-row items-center">
                    {rowsToRender[0].map((item, idx) => {
                      const key =
                        item.type === 'plus' ? `plus-${item.label}` : item.id;
                      return (
                        <View key={key} className={idx === 0 ? '' : 'ml-1'}>
                          <View className="rounded-full bg-slate-700 px-2 py-0.5 dark:bg-slate-700">
                            <Text
                              className="text-[10px] font-semibold text-slate-50"
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {item.label}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                ) : null}

                {/* // Fila 2. */}
                {rowsToRender[1].length > 0 ? (
                  <View className="mt-1 flex-row items-center">
                    {rowsToRender[1].map((item, idx) => {
                      const key =
                        item.type === 'plus' ? `plus-${item.label}` : item.id;
                      return (
                        <View key={key} className={idx === 0 ? '' : 'ml-1'}>
                          <View className="rounded-full bg-slate-700 px-2 py-0.5 dark:bg-slate-700">
                            <Text
                              className="text-[10px] font-semibold text-slate-50"
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {item.label}
                            </Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                ) : null}
              </>
            ) : null}

            {/* // Medición oculta: mide el ancho real de cada chip y del "+N" en el peor caso. */}
            <View
              pointerEvents="none"
              style={{ position: 'absolute', left: 0, top: 0, opacity: 0 }}
            >
              <View className="flex-row items-center">
                {sortedTags.map((t, i) => (
                  <View
                    key={`measure-${t.id}`}
                    className={i === 0 ? '' : 'ml-1'}
                    onLayout={(e) => {
                      const w = e.nativeEvent.layout.width;
                      setChipWidths((prev) => {
                        if (prev[t.id] === w) return prev;
                        return { ...prev, [t.id]: w };
                      });
                    }}
                  >
                    <View className="rounded-full bg-slate-700 px-2 py-0.5 dark:bg-slate-700">
                      <Text
                        className="text-[10px] font-semibold text-slate-50"
                        numberOfLines={1}
                      >
                        {t.label}
                      </Text>
                    </View>
                  </View>
                ))}

                {/* // Medición del "+N" con el peor caso "+{total}". */}
                <View
                  className={sortedTags.length > 0 ? 'ml-1' : ''}
                  onLayout={(e) =>
                    setPlusChipWidthWorstCase(e.nativeEvent.layout.width)
                  }
                >
                  <View className="rounded-full bg-slate-700 px-2 py-0.5 dark:bg-slate-700">
                    <Text
                      className="text-[10px] font-semibold text-slate-50"
                      numberOfLines={1}
                    >
                      +{sortedTags.length}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* // overflowCount se calcula para decidir "+N"; se mantiene para depuración si se requiere. */}
            {overflowCount < 0 ? null : null}
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
