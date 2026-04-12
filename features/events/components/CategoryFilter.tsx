import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { EVENT_CATEGORIES } from '@/features/events/data/categories';

type Props = {
  visible: boolean;
  events: any[];
  value: string[];
  onChange: (categories: string[]) => void;
  onClose: () => void;
};

export function CategoryFilter({
  visible,
  events,
  value,
  onChange,
  onClose,
}: Props) {
  const [localSelected, setLocalSelected] = useState<string[]>(value);

  useEffect(() => {
    setLocalSelected(value);
  }, [value, visible]);

  const categories = EVENT_CATEGORIES;

  const handleToggleCategory = (category: string) => {
    setLocalSelected((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category],
    );
  };

  const handleClear = () => {
    setLocalSelected([]);
  };

  const handleApplyAndClose = () => {
    onChange(localSelected);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/60 px-4">
        <View className="max-h-[88%] w-full rounded-[32px] border border-white bg-[#020b2d] px-4 py-5">
          <Text className="mb-6 text-center text-3xl font-extrabold uppercase text-blue-400">
            Selecciona una(s){'\n'}categoría(s)
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="gap-4">
              {categories.map((category) => {
                const isSelected = localSelected.includes(category);

                return (
                  <Pressable
                    key={category}
                    onPress={() => handleToggleCategory(category)}
                    className={`px-4 py-4 ${
                      isSelected ? 'bg-blue-400' : 'bg-white'
                    }`}
                  >
                    <Text className="text-center text-2xl font-extrabold uppercase text-black">
                      {category}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>

          <View className="mt-6 gap-3">
            <Pressable onPress={handleClear} className="bg-slate-200 px-4 py-4">
              <Text className="text-center text-xl font-bold uppercase text-black">
                Limpiar
              </Text>
            </Pressable>

            <Pressable
              onPress={handleApplyAndClose}
              className="bg-blue-400 px-4 py-4"
            >
              <Text className="text-center text-xl font-bold uppercase text-black">
                Aplicar
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}