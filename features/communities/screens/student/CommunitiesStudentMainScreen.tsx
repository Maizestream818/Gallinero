import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { IconSymbol } from '@/components/ui/icon-symbol'; // Importamos tu componente de iconos

// ----------------------------------------------------------------------
// 1. DUMMY DATA (Datos de prueba)
// ----------------------------------------------------------------------
const DUMMY_POSTS = [
  {
    id: '1',
    author: 'Sofía Martínez',
    role: 'Estudiante',
    time: 'Hace 20 min',
    content: '¿Alguien tiene los apuntes de la clase de Matemáticas de hoy? No pude asistir 😢',
    likes: 5,
    comments: 3,
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
  },
  {
    id: '2',
    author: 'Centro de Estudiantes',
    role: 'Admin',
    time: 'Hace 2 horas',
    content: '¡Atención! Mañana se suspenden actividades en el auditorio por mantenimiento.',
    likes: 42,
    comments: 0,
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  },
  {
    id: '3',
    author: 'Jorge Luis',
    role: 'Estudiante',
    time: 'Hace 5 horas',
    content: 'Vendo calculadora científica casi nueva. Interesados mandar DM.',
    likes: 2,
    comments: 1,
    avatar: 'https://i.pravatar.cc/150?u=a04258114e29026302d',
  },
  {
    id: '4',
    author: 'Ana Torres',
    role: 'Delegada',
    time: 'Ayer',
    content: 'Chicos, recuerden que la fecha límite para el proyecto es el viernes.',
    likes: 15,
    comments: 8,
    avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
  },
];

export function CommunitiesStudentMainScreen() {
  // Estado para la visibilidad del modal
  const [modalVisible, setModalVisible] = useState(false);
  const [postText, setPostText] = useState('');

  const handlePublish = () => {
    if (postText.trim() === '') return;
    
    // Simulación de publicación
    Alert.alert('Publicado', 'Tu post ha sido enviado a la comunidad.');
    setPostText('');
    setModalVisible(false);
  };

  // ----------------------------------------------------------------------
  // RENDER ITEM: Componente visual de cada post
  // ----------------------------------------------------------------------
  const renderPost = ({ item }: { item: typeof DUMMY_POSTS[0] }) => (
    <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
      {/* Encabezado del post */}
      <View className="flex-row items-center mb-3">
        <Image 
          source={{ uri: item.avatar }} 
          className="h-10 w-10 rounded-full bg-slate-200" 
        />
        <View className="ml-3">
          <Text className="text-base font-bold text-slate-800">{item.author}</Text>
          <Text className="text-xs text-slate-500">{item.role} • {item.time}</Text>
        </View>
      </View>

      {/* Contenido */}
      <Text className="text-sm text-slate-700 leading-5 mb-3">
        {item.content}
      </Text>

      {/* Pie del post (Botones de interacción) */}
      <View className="flex-row border-t border-slate-100 pt-3">
        <TouchableOpacity className="flex-row items-center mr-6">
          {/* CORRECCIÓN: Se agrega color y cierre de etiqueta /> */}
          <IconSymbol name="house.fill" size={16} color="#64748b" />
          <Text className="ml-1 text-xs text-slate-500 font-medium">{item.likes} Me gusta</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center">
          <IconSymbol name="paperplane.fill" size={16} color="#64748b" />
          <Text className="ml-1 text-xs text-slate-500 font-medium">{item.comments} Comentarios</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar style="dark" />

      {/* Header */}
      <View className="px-5 pt-4 pb-2">
        <Text className="text-3xl font-bold text-slate-900">Comunidad 🐔</Text>
        <Text className="text-slate-500">Lo último en el gallinero</Text>
      </View>

      {/* Lista de Publicaciones */}
      <FlatList
        data={DUMMY_POSTS}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Botón Flotante (FAB) para nuevo post */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 h-14 w-14 bg-indigo-600 rounded-full items-center justify-center shadow-lg active:bg-indigo-700"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white text-3xl font-light mb-1">+</Text>
      </TouchableOpacity>

      {/* Modal de Nuevo Post */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-3xl p-5 h-[70%]">
            
            {/* Header del Modal */}
            <View className="flex-row justify-between items-center mb-4">
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text className="text-slate-500 text-base">Cancelar</Text>
              </TouchableOpacity>
              <Text className="font-bold text-lg text-slate-800">Crear Publicación</Text>
              <TouchableOpacity 
                onPress={handlePublish}
                disabled={postText.length === 0}
                className={`${postText.length > 0 ? 'bg-indigo-600' : 'bg-slate-300'} px-4 py-1.5 rounded-full`}
              >
                <Text className="text-white font-bold text-sm">Publicar</Text>
              </TouchableOpacity>
            </View>

            {/* Input de Texto */}
            <TextInput
              className="flex-1 text-base text-slate-700 text-start"
              placeholder="¿Qué está pasando en el gallinero?"
              placeholderTextColor="#94a3b8"
              multiline
              textAlignVertical="top"
              value={postText}
              onChangeText={setPostText}
              autoFocus
            />
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}