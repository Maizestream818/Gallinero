import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  SafeAreaView,
  Image,
  Pressable,
  BackHandler,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { IconSymbol } from '@/components/ui/icon-symbol';

// ----------------------------------------------------------------------
// 1. DATOS INICIALES (Se usarán para resetear al recargar la página)
// ----------------------------------------------------------------------

const DUMMY_COMMUNITIES = [
  { 
    id: 'c1', 
    name: 'Salud', 
    description: 'Tips de bienestar, campañas de vacunación y deporte.', 
    iconName: 'house.fill', 
    color: 'bg-emerald-500' 
  },
  { 
    id: 'c2', 
    name: 'Sistemas', 
    description: 'Programación, hackathons y dudas técnicas.', 
    iconName: 'chevron.left.forwardslash.chevron.right', 
    color: 'bg-blue-500'
  },
  { 
    id: 'c3', 
    name: 'Música', 
    description: 'Ensayos, conciertos y venta de instrumentos.', 
    iconName: 'paperplane.fill', 
    color: 'bg-purple-500' 
  },
  { 
    id: 'c4', 
    name: 'Comunicación', 
    description: 'Noticias, debates y avisos de la facultad.', 
    iconName: 'chevron.right', 
    color: 'bg-orange-500' 
  },
];

const INITIAL_POSTS = [
  {
    id: 'p1',
    author: 'Sofía Martínez',
    role: 'Estudiante',
    time: 'Hace 20 min',
    content: '¿Alguien tiene los apuntes de la clase de hoy? No pude asistir 😢',
    avatar: 'https://i.pravatar.cc/150?u=1',
  },
  {
    id: 'p2',
    author: 'Centro de Estudiantes',
    role: 'Admin',
    time: 'Hace 2 horas',
    content: '¡Atención! Mañana mantenimiento en los laboratorios.',
    avatar: 'https://i.pravatar.cc/150?u=2',
  },
  {
    id: 'p3',
    author: 'Jorge Luis',
    role: 'Estudiante',
    time: 'Hace 5 horas',
    content: 'Vendo calculadora científica. DM.',
    avatar: 'https://i.pravatar.cc/150?u=3',
  },
];

export function CommunitiesStudentMainScreen() {
  const [selectedCommunity, setSelectedCommunity] = useState<typeof DUMMY_COMMUNITIES[0] | null>(null);
  
  // ESTADO DE LOS POSTS: Inicia con los datos dummy, pero permite agregar nuevos
  const [posts, setPosts] = useState(INITIAL_POSTS);

  const [modalVisible, setModalVisible] = useState(false);
  const [postText, setPostText] = useState('');

  // Manejo del botón físico "Atrás" en Android
  useEffect(() => {
    const onBackPress = () => {
      if (selectedCommunity) {
        setSelectedCommunity(null);
        return true; 
      }
      return false; 
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [selectedCommunity]);

  // ----------------------------------------------------------------------
  // LÓGICA PARA CREAR EL NUEVO POST
  // ----------------------------------------------------------------------
  const handlePublish = () => {
    if (postText.trim() === '') return;

    // 1. Crear el objeto del nuevo post
    const newPost = {
      id: Date.now().toString(), // ID único basado en la hora actual
      author: 'Tú', // Nombre del usuario actual (simulado)
      role: 'Estudiante',
      time: 'Ahora',
      content: postText,
      avatar: 'https://i.pravatar.cc/150?u=me', // Avatar diferente para identificar que eres tú
    };

    // 2. Agregarlo al principio de la lista actual
    setPosts([newPost, ...posts]);

    // 3. Limpiar y cerrar
    setPostText('');
    setModalVisible(false);
  };

  // ----------------------------------------------------------------------
  // RENDERIZADO
  // ----------------------------------------------------------------------

  const renderCommunityItem = ({ item }: { item: typeof DUMMY_COMMUNITIES[0] }) => (
    <Pressable 
      onPress={() => setSelectedCommunity(item)}
      className="mb-4 flex-row items-center rounded-2xl bg-white p-4 shadow-sm border border-slate-100 active:bg-slate-50"
    >
      <View className={`h-12 w-12 items-center justify-center rounded-full ${item.color} mr-4`}>
        <IconSymbol name={item.iconName as any} size={24} color="white" />
      </View>
      <View className="flex-1">
        <Text className="text-lg font-bold text-slate-800">{item.name}</Text>
        <Text className="text-sm text-slate-500" numberOfLines={1}>{item.description}</Text>
      </View>
      <IconSymbol name="chevron.right" size={20} color="#cbd5e1" />
    </Pressable>
  );

  const renderPostItem = ({ item }: { item: typeof INITIAL_POSTS[0] }) => (
    <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
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
      <Text className="text-sm text-slate-700 leading-5">
        {item.content}
      </Text>
    </View>
  );

  // VISTA DETALLE DE COMUNIDAD
  if (selectedCommunity) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50">
        <StatusBar style="dark" />
        
        <View className="flex-row items-center px-4 pt-2 pb-4 bg-white border-b border-slate-100">
          <TouchableOpacity 
            onPress={() => setSelectedCommunity(null)}
            className="p-2 mr-2 rounded-full bg-slate-100 active:bg-slate-200"
          >
            <IconSymbol 
              name="chevron.right" 
              size={24} 
              color="#334155" 
              style={{ transform: [{ rotate: '180deg' }] }}
            />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-slate-900">{selectedCommunity.name}</Text>
            <Text className="text-xs text-slate-500">Comunidad Oficial</Text>
          </View>
        </View>

        {/* AQUÍ PASAMOS EL ESTADO 'posts' EN LUGAR DE LA LISTA FIJA */}
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPostItem}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity
          className={`absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full shadow-lg ${selectedCommunity.color}`}
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-white text-3xl font-light mb-1">+</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-end bg-black/40">
            <View className="bg-white rounded-t-3xl p-5 h-[70%]">
              <View className="flex-row justify-between items-center mb-4">
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text className="text-slate-500 text-base">Cancelar</Text>
                </TouchableOpacity>
                <Text className="font-bold text-lg text-slate-800">Publicar en {selectedCommunity.name}</Text>
                <TouchableOpacity 
                  onPress={handlePublish}
                  disabled={postText.length === 0}
                  className={`${postText.length > 0 ? selectedCommunity.color : 'bg-slate-300'} px-4 py-1.5 rounded-full`}
                >
                  <Text className="text-white font-bold text-sm">Publicar</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                className="flex-1 text-base text-slate-700 text-start"
                placeholder={`Comparte algo con el grupo de ${selectedCommunity.name}...`}
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

  // VISTA LISTA PRINCIPAL
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar style="dark" />
      <View className="px-5 pt-6 pb-4">
        <Text className="text-3xl font-bold text-slate-900">Comunidades</Text>
        <Text className="text-slate-500">Selecciona un grupo para ver sus posts</Text>
      </View>
      <FlatList
        data={DUMMY_COMMUNITIES}
        keyExtractor={(item) => item.id}
        renderItem={renderCommunityItem}
        contentContainerStyle={{ padding: 20 }}
      />
    </SafeAreaView>
  );
}