import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList } from 'react-native';

interface CategoryFilterProps {
  categoryFilter: string | null;
  setCategoryFilter: (category: string | null) => void;
}

const categories = [
  'Cinema Universidad',
  'Ballet Folclorico Universidad',
  'Farandula Universitaria',
  'Helikón',
  'Talentos Universitarios',
  'Galerías y Exposiciones',
  'Museo Nacional de la Muerte',
  'Servicio Social',
]; // Lista de categorías

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categoryFilter,
  setCategoryFilter,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleCategoryChange = (category: string | null) => {
    if (category === categoryFilter) {
      setCategoryFilter(null); // Si la categoría es la misma, la des-seleccionamos
    } else {
      setCategoryFilter(category); // Si no, la asignamos
    }
    setModalVisible(false); // Cierra el modal después de seleccionar
  };

  return (
    <View style={{ backgroundColor: '#1F2937', padding: 12, borderRadius: 8 }}>
      <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: 'bold' }}>
        Filtrar por categoría
      </Text>

      {/* Filtro de Categoría con Modal */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          marginTop: 12,
          backgroundColor: '#374151',
          borderRadius: 8,
          padding: 10,
        }}
      >
        <Text
          style={{
            color: '#ffffff',
            fontSize: 16,
          }}
        >
          {categoryFilter ? categoryFilter : 'Otros Eventos'}
        </Text>
      </TouchableOpacity>

      {/* Modal para seleccionar categoría */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              width: 300,
              borderRadius: 10,
              padding: 10,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              Selecciona una categoría
            </Text>

            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleCategoryChange(item)}
                  style={{
                    backgroundColor:
                      categoryFilter === item ? '#4CAF50' : '#374151', // Fondo verde si está seleccionado
                    padding: 10,
                    marginBottom: 5,
                    borderRadius: 5,
                  }}
                >
                  <Text
                    style={{
                      color: '#ffffff',
                      fontSize: 16,
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                backgroundColor: '#f44336',
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