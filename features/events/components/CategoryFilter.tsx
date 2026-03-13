// features/events/components/CategoryFilter.tsx
import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { EVENT_CATEGORIES } from '@/features/events/data/categories';

interface CategoryFilterProps {
  categoryFilter: string | null;
  setCategoryFilter: (category: string | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categoryFilter,
  setCategoryFilter,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const isDark = useColorScheme() === 'dark';

  const colors = {
    containerBg: isDark ? '#1e293b' : '#f1f5f9',
    containerBorder: isDark ? '#334155' : '#e2e8f0',
    title: isDark ? '#f1f5f9' : '#0f172a',
    btnBg: isDark ? '#334155' : '#e2e8f0',
    btnText: isDark ? '#f1f5f9' : '#1e293b',
    modalOverlay: 'rgba(0,0,0,0.5)',
    modalBg: isDark ? '#1e293b' : '#ffffff',
    modalTitle: isDark ? '#f1f5f9' : '#0f172a',
    itemBg: isDark ? '#334155' : '#e2e8f0',
    itemSelectedBg: '#4CAF50',
    itemText: isDark ? '#f1f5f9' : '#1e293b',
    closeBg: '#ef4444',
  };

  const handleCategoryChange = (category: string | null) => {
    // Si se selecciona la misma categoría, se deselecciona
    setCategoryFilter(category === categoryFilter ? null : category);
    setModalVisible(false);
  };

  return (
    <View
      style={{
        backgroundColor: colors.containerBg,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.containerBorder,
      }}
    >
      <Text style={{ color: colors.title, fontSize: 16, fontWeight: 'bold' }}>
        Filtrar por categoría
      </Text>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          marginTop: 12,
          backgroundColor: colors.btnBg,
          borderRadius: 8,
          padding: 10,
        }}
      >
        <Text style={{ color: colors.btnText, fontSize: 16 }}>
          {categoryFilter ? categoryFilter : 'Todos los eventos'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.modalOverlay,
          }}
        >
          <View
            style={{
              backgroundColor: colors.modalBg,
              width: 300,
              borderRadius: 10,
              padding: 10,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 10,
                color: colors.modalTitle,
              }}
            >
              Selecciona una categoría
            </Text>

            <FlatList
              data={EVENT_CATEGORIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleCategoryChange(item)}
                  style={{
                    backgroundColor:
                      categoryFilter === item ? colors.itemSelectedBg : colors.itemBg,
                    padding: 10,
                    marginBottom: 5,
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ color: colors.itemText, fontSize: 16 }}>{item}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                backgroundColor: colors.closeBg,
                padding: 10,
                borderRadius: 5,
                marginTop: 10,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#ffffff', fontSize: 16 }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
