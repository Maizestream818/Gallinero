import React, { useState, useEffect } from 'react';
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
  Pressable,
  BackHandler,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { IconSymbol } from '@/components/ui/icon-symbol';

// ----------------------------------------------------------------------
// 1. GENERADOR DE 30 COMUNIDADES
// ----------------------------------------------------------------------

const COMMUNITY_TYPES = [
  {
    name: 'Salud',
    icon: 'house.fill',
    color: 'bg-emerald-500',
    desc: 'Bienestar y vida sana',
  },
  {
    name: 'Sistemas',
    icon: 'chevron.left.forwardslash.chevron.right',
    color: 'bg-blue-500',
    desc: 'Tecnología y código',
  },
  {
    name: 'Música',
    icon: 'paperplane.fill',
    color: 'bg-purple-500',
    desc: 'Arte y conciertos',
  },
  {
    name: 'Comunicación',
    icon: 'chevron.right',
    color: 'bg-orange-500',
    desc: 'Debates y noticias',
  },
  {
    name: 'Deportes',
    icon: 'house.fill',
    color: 'bg-red-500',
    desc: 'Torneos y entrenamiento',
  },
  {
    name: 'Arquitectura',
    icon: 'paperplane.fill',
    color: 'bg-slate-600',
    desc: 'Diseño y estructuras',
  },
];

const DUMMY_COMMUNITIES = Array.from({ length: 30 }, (_, i) => {
  const type = COMMUNITY_TYPES[i % COMMUNITY_TYPES.length];
  return {
    id: `c${i + 1}`,
    name: `${type.name} ${Math.floor(i / 6) + 1}`,
    description: `${type.desc} - Grupo oficial #${i + 1}`,
    iconName: type.icon,
    color: type.color,
  };
});

// ----------------------------------------------------------------------
// 2. GENERADOR DE POSTS (30 por comunidad)
// ----------------------------------------------------------------------

const AUTHORS = [
  'Sofía Martínez',
  'Jorge Luis',
  'Ana Torres',
  'Carlos Ruiz',
  'Lucía Fernández',
  'Miguel Ángel',
  'Valentina R.',
  'David P.',
];
const CONTENTS = [
  '¿Alguien tiene los apuntes de la última clase? No pude asistir 😢',
  '¡Atención! Mañana hay mantenimiento en las instalaciones.',
  'Vendo calculadora científica en buen estado. Interesados al DM.',
  '¿Saben si la cafetería está abierta hoy?',
  'Organizando grupo de estudio para los finales. ¿Quién se apunta?',
  'Perdí mi credencial cerca del edificio B, si alguien la ve avísenme.',
  'Recuerden que el viernes es la fecha límite para el proyecto.',
  'Torneo de fútbol este sábado, inscriban a sus equipos ⚽',
  '¿Alguien para compartir locker este semestre?',
  'Busco libro de anatomía usado, precio razonable.',
  'Se busca bajista para banda de rock universitario 🎸',
  '¿Alguien sabe a qué hora abre la biblioteca mañana?',
];

const generateAllPosts = () => {
  const allPosts = [];
  let postIdCounter = 1;

  DUMMY_COMMUNITIES.forEach((community) => {
    const numPosts = 30;

    for (let i = 0; i < numPosts; i++) {
      allPosts.push({
        id: `p${postIdCounter++}`,
        communityId: community.id,
        author: AUTHORS[Math.floor(Math.random() * AUTHORS.length)],
        role: 'Estudiante',
        time: `Hace ${Math.floor(Math.random() * 23) + 1} horas`,
        content: CONTENTS[Math.floor(Math.random() * CONTENTS.length)],
        avatar: `https://i.pravatar.cc/150?u=${postIdCounter}`,
      });
    }
  });

  return allPosts;
};

const INITIAL_POSTS = generateAllPosts();

export function CommunitiesStudentMainScreen() {
  const [selectedCommunity, setSelectedCommunity] = useState<
    (typeof DUMMY_COMMUNITIES)[0] | null
  >(null);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [modalVisible, setModalVisible] = useState(false);
  const [postText, setPostText] = useState('');

  useEffect(() => {
    const onBackPress = () => {
      if (selectedCommunity) {
        setSelectedCommunity(null);
        return true;
      }
      return false;
    };
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );
    return () => subscription.remove();
  }, [selectedCommunity]);

  const handlePublish = () => {
    if (postText.trim() === '') return;

    const newPost = {
      id: Date.now().toString(),
      communityId: selectedCommunity?.id,
      author: 'Tú',
      role: 'Estudiante',
      time: 'Ahora',
      content: postText,
      avatar: 'https://i.pravatar.cc/150?u=me',
    };

    setPosts([newPost, ...posts]);
    setPostText('');
    setModalVisible(false);
  };

  const androidPaddingTop =
    Platform.OS === 'android' ? RNStatusBar.currentHeight : 0;

  // ----------------------------------------------------------------------
  // RENDERIZADO
  // ----------------------------------------------------------------------

  const renderCommunityItem = ({
    item,
  }: {
    item: (typeof DUMMY_COMMUNITIES)[0];
  }) => (
    <Pressable
      onPress={() => setSelectedCommunity(item)}
      className="mb-4 flex-row items-center rounded-2xl border border-slate-100 bg-white p-4 shadow-sm active:bg-slate-50"
    >
      <View
        className={`h-12 w-12 items-center justify-center rounded-full ${item.color} mr-4`}
      >
        <IconSymbol name={item.iconName as any} size={24} color="white" />
      </View>
      <View className="flex-1">
        <Text className="text-lg font-bold text-slate-800">{item.name}</Text>
        <Text className="text-sm text-slate-500" numberOfLines={1}>
          {item.description}
        </Text>
      </View>
      <IconSymbol name="chevron.right" size={20} color="#cbd5e1" />
    </Pressable>
  );

  const renderPostItem = ({ item }: { item: (typeof INITIAL_POSTS)[0] }) => (
    <View className="mb-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <View className="mb-3 flex-row items-center">
        <Image
          source={{ uri: item.avatar }}
          className="h-10 w-10 rounded-full bg-slate-200"
        />
        <View className="ml-3">
          <Text className="text-base font-bold text-slate-800">
            {item.author}
          </Text>
          <Text className="text-xs text-slate-500">
            {item.role} • {item.time}
          </Text>
        </View>
      </View>
      <Text className="text-sm leading-5 text-slate-700">{item.content}</Text>
    </View>
  );

  // VISTA DETALLE DE COMUNIDAD
  if (selectedCommunity) {
    const communityPosts = posts.filter(
      (post) => post.communityId === selectedCommunity.id,
    );

    return (
      <SafeAreaView
        className="flex-1 bg-slate-50"
        style={{ paddingTop: androidPaddingTop }}
      >
        <StatusBar style="dark" />

        {/* Header Detalle */}
        <View className="flex-row items-center border-b border-slate-100 bg-white px-4 pt-2 pb-4">
          <TouchableOpacity
            onPress={() => setSelectedCommunity(null)}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            className="mr-3 rounded-full bg-slate-100 p-2 active:bg-slate-200"
          >
            <IconSymbol
              name="chevron.right"
              size={24}
              color="#334155"
              style={{ transform: [{ rotate: '180deg' }] }}
            />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-slate-900">
              {selectedCommunity.name}
            </Text>
            <Text className="text-xs text-slate-500">Comunidad Oficial</Text>
          </View>
        </View>

        {/* LISTA DE POSTS */}
        <FlatList
          data={communityPosts}
          keyExtractor={(item) => item.id}
          renderItem={renderPostItem}
          // CORRECCIÓN 1: Aumentamos paddingBottom a 120 para que el último post
          // suba por encima del botón flotante y no quede oculto.
          contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="mt-10 items-center">
              <Text className="mb-2 text-center text-slate-400">
                No hay publicaciones aún.
              </Text>
              <Text className="text-center text-xs text-slate-300">
                ¡Sé el primero en escribir!
              </Text>
            </View>
          }
        />

        {/* BOTÓN FLOTANTE (FAB) */}
        <TouchableOpacity
          // CORRECCIÓN 2: Cambiamos 'bottom-6' a 'bottom-20' para subirlo visualmente
          // y evitar que choque con la barra de pestañas (Tabs) de abajo.
          // Agregamos z-50 para asegurar que esté encima de todo.
          className={`absolute right-6 bottom-20 z-50 h-14 w-14 items-center justify-center rounded-full shadow-lg ${selectedCommunity.color}`}
          onPress={() => setModalVisible(true)}
        >
          <Text className="mb-1 text-3xl font-light text-white">+</Text>
        </TouchableOpacity>

        {/* Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-end bg-black/40">
            <View className="h-[70%] rounded-t-3xl bg-white p-5">
              <View className="mb-4 flex-row items-center justify-between">
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text className="text-base text-slate-500">Cancelar</Text>
                </TouchableOpacity>
                <Text className="text-lg font-bold text-slate-800">
                  Publicar en {selectedCommunity.name}
                </Text>
                <TouchableOpacity
                  onPress={handlePublish}
                  disabled={postText.length === 0}
                  className={`${postText.length > 0 ? selectedCommunity.color : 'bg-slate-300'} rounded-full px-4 py-1.5`}
                >
                  <Text className="text-sm font-bold text-white">Publicar</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                className="flex-1 text-start text-base text-slate-700"
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
    <SafeAreaView
      className="flex-1 bg-slate-50"
      style={{ paddingTop: androidPaddingTop }}
    >
      <StatusBar style="dark" />
      <View className="border-b border-slate-100 bg-white px-5 pt-6 pb-4">
        <Text className="text-3xl font-bold text-slate-900">Comunidades</Text>
        <Text className="text-slate-500">
          Explora los {DUMMY_COMMUNITIES.length} grupos disponibles
        </Text>
      </View>

      <FlatList
        data={DUMMY_COMMUNITIES}
        keyExtractor={(item) => item.id}
        renderItem={renderCommunityItem}
        contentContainerStyle={{ padding: 20 }}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </SafeAreaView>
  );
}
