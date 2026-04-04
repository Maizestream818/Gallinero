// features/events/components/EventCardWithImage.tsx
// Card compacta de evento CON imagen para grid de 2 columnas.
// Muestra: Imagen, Nombre y Etiquetas.

import React, { useMemo, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import type { EventStudentItem } from '@/features/events/types/eventTypes';

type EventCardWithImageProps = {
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

//Calcula el ancho de un item (tag o +N)
function getPackedItemWidth(
  item: PackedItem,
  chipWidths: ChipWidthMap,
  plusChipWidthWorstCase: number,
): number {
  if (item.type === 'plus') return plusChipWidthWorstCase;
  return chipWidths[item.id] ?? 0;
}

//Empaqueta items en máximo 2 filas sin wrap automático
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

    // Cabe en la fila actual
    if (currentWidth + needed <= rowWidth) {
      rows[currentRow].push(item);
      currentWidth += needed;
      continue;
    }

    // Si estamos en la primera fila, intentar segunda
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

      return null;
    }

    return null;
  }

  return rows;
}

export function EventCardWithImage({
  event,
  onPress,
}: EventCardWithImageProps) {
  const tags = useMemo<string[]>(() => event.tags ?? [], [event.tags]);

  //Orden por longitud ascendente (primero las más cortas)
  const sortedTags = useMemo<TagItem[]>(() => {
    return tags
      .map((t, originalIndex) => ({
        id: `${t}__${originalIndex}`,
        label: t,
        len: t.length,
      }))
      .sort((a, b) => a.len - b.len);
  }, [tags]);

  // Medición
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

    // Asegurar que todos los chips de tags se hayan medido
    const allMeasured = sortedTags.every((t) => chipWidths[t.id] != null);
    if (!allMeasured) {
      return { rowsToRender: null, overflowCount: 0 };
    }

    // Asegurar medición del "+N" (peor caso)
    // Nota: aunque no siempre se use, es necesaria para reservar ancho correctamente cuando hay overflow.
    if (plusChipWidthWorstCase <= 0 && total > 1) {
      return { rowsToRender: null, overflowCount: 0 };
    }

    // Buscar el máximo K que quepa (de total hacia 0)
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

    return { rowsToRender: null, overflowCount: total };
  }, [sortedTags, rowWidth, chipWidths, plusChipWidthWorstCase]);

  return (
    <Pressable
      onPress={() => onPress(event)}
      className="overflow-hidden rounded-[24px] border border-[#D6E2FF] bg-white dark:border-[#20345F] dark:bg-[#05070B]"
    >
      {/* Imagen superior */}
      {event.imageUrl ? (
        <Image
          source={{ uri: event.imageUrl }}
          className="h-32 w-full"
          resizeMode="cover"
        />
      ) : null}

      {/* Contenido inferior */}
      <View className="bg-[#F8FAFF] p-4 dark:bg-[#05070B]">
        {/* Título */}
        <Text
          className="text-base font-extrabold uppercase tracking-[0.3px] text-[#4F7DF0] dark:text-[#4F7DF0]"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {event.title}
        </Text>

        {/* Chips: máximo 2 filas */}
        {sortedTags.length > 0 ? (
          <View
            className="mt-3"
            onLayout={(e) => setRowWidth(e.nativeEvent.layout.width)}
          >
            {rowsToRender ? (
              <>
                {/* Fila 1 */}
                {rowsToRender[0].length > 0 ? (
                  <View className="flex-row items-center">
                    {rowsToRender[0].map((item, idx) => {
                      const key =
                        item.type === 'plus' ? `plus-${item.label}` : item.id;
                      return (
                        <View key={key} className={idx === 0 ? '' : 'ml-2'}>
                          <View className="rounded-full border border-[#D6E2FF] bg-[#EEF4FF] px-3 py-1 dark:border-[#2D4785] dark:bg-[#0D1730]">
                            <Text
                              className="text-[11px] font-bold text-[#4F7DF0] dark:text-[#F5D94E]"
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

                {/* Fila 2 */}
                {rowsToRender[1].length > 0 ? (
                  <View className="mt-2 flex-row items-center">
                    {rowsToRender[1].map((item, idx) => {
                      const key =
                        item.type === 'plus' ? `plus-${item.label}` : item.id;
                      return (
                        <View key={key} className={idx === 0 ? '' : 'ml-2'}>
                          <View className="rounded-full border border-[#D6E2FF] bg-[#EEF4FF] px-3 py-1 dark:border-[#2D4785] dark:bg-[#0D1730]">
                            <Text
                              className="text-[11px] font-bold text-[#4F7DF0] dark:text-[#F5D94E]"
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

            {/* Medición invisible */}
            <View
              pointerEvents="none"
              style={{ position: 'absolute', left: 0, top: 0, opacity: 0 }}
            >
              <View className="flex-row items-center">
                {sortedTags.map((t, i) => (
                  <View
                    key={`measure-${t.id}`}
                    className={i === 0 ? '' : 'ml-2'}
                    onLayout={(e) => {
                      const w = e.nativeEvent.layout.width;
                      setChipWidths((prev) => {
                        if (prev[t.id] === w) return prev;
                        return { ...prev, [t.id]: w };
                      });
                    }}
                  >
                    <View className="rounded-full border border-[#D6E2FF] bg-[#EEF4FF] px-3 py-1 dark:border-[#2D4785] dark:bg-[#0D1730]">
                      <Text
                        className="text-[11px] font-bold text-[#4F7DF0] dark:text-[#F5D94E]"
                        numberOfLines={1}
                      >
                        {t.label}
                      </Text>
                    </View>
                  </View>
                ))}

                <View
                  className={sortedTags.length > 0 ? 'ml-2' : ''}
                  onLayout={(e) =>
                    setPlusChipWidthWorstCase(e.nativeEvent.layout.width)
                  }
                >
                  <View className="rounded-full border border-[#D6E2FF] bg-[#EEF4FF] px-3 py-1 dark:border-[#2D4785] dark:bg-[#0D1730]">
                    <Text
                      className="text-[11px] font-bold text-[#4F7DF0] dark:text-[#F5D94E]"
                      numberOfLines={1}
                    >
                      +{sortedTags.length}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}