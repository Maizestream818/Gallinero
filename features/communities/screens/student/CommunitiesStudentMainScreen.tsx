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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { IconSymbol } from '@/components/ui/icon-symbol';

// ----------------------------------------------------------------------
// 1. GENERADOR DE 30 COMUNIDADES (Igual que antes)
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
// 2. GENERADOR DE POSTS ALEATORIOS (NUEVO)
// ----------------------------------------------------------------------

// Bancos de datos para generar variedad
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
const ROLES = ['Estudiante', 'Delegado', 'Admin', 'Estudiante', 'Estudiante']; // Más probabilidad de ser estudiante
const CONTENTS = [
  '¿Alguien tiene los apuntes de la última clase? No pude asistir 😢',
  '¡Atención! Mañana hay mantenimiento en las instalaciones.',
  'Vendo calculadora científica en buen estado. Interesados al DM.',
  '¿Saben si la cafetería está abierta hoy?',
  'Organizando grupo de estudio para los finales. ¿Quién se apunta?',
  'Perdí mi credencial cerca del edificio B, si alguien la ve avísenme.',
  'Recuerden que el viernes es la fecha límite para el proyecto.',
  '¿Alguna recomendación de profesor para esta materia?',
  'Se busca bajista para banda de rock.',
  'Torneo de fútbol este sábado, inscriban a sus equipos ⚽',
];

// Función que genera posts automáticamente
const generateAllPosts = () => {
  const allPosts = [];
  let postIdCounter = 1;

  DUMMY_COMMUNITIES.forEach((community) => {
    // Generar entre 4 y 6 posts por comunidad de forma aleatoria
    const numPosts = Math.floor(Math.random() * 3) + 4;

    for (let i = 0; i < numPosts; i++) {
      allPosts.push({
        id: `p${postIdCounter++}`,
        communityId: community.id, // Vinculamos el post a esta comunidad
        author: AUTHORS[Math.floor(Math.random() * AUTHORS.length)],
        role: ROLES[Math.floor(Math.random() * ROLES.length)],
        time: `Hace ${Math.floor(Math.random() * 12) + 1} horas`,
        content: CONTENTS[Math.floor(Math.random() * CONTENTS.length)],
        likes: Math.floor(Math.random() * 50),
        comments: Math.floor(Math.random() * 10),
        // Avatar aleatorio de pravatar
        avatar: `https://i.pravatar.cc/150?u=${postIdCounter}`,
      });
    }
  });

  return allPosts;
};

// Generamos la lista inicial una sola vez
const INITIAL_POSTS = generateAllPosts();

export function CommunitiesStudentMainScreen() {
  const [selectedCommunity, setSelectedCommunity] = useState<
    (typeof DUMMY_COMMUNITIES)[0] | null
  >(null);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [modalVisible, setModalVisible] = useState(false);
  const [postText, setPostText] = useState('');

  // Manejo del botón físico Atrás
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

  // Publicar post
  const handlePublish = () => {
    if (postText.trim() === '') return;

    const newPost = {
      id: Date.now().toString(),
      communityId: selectedCommunity?.id,
      author: 'Tú',
      role: 'Estudiante',
      time: 'Ahora',
      content: postText,
      likes: 0,
      comments: 0,
      avatar: 'https://i.pravatar.cc/150?u=me',
    };

    setPosts([newPost, ...posts]);
    setPostText('');
    setModalVisible(false);
  };

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
      <SafeAreaView className="flex-1 bg-slate-50">
        <StatusBar style="dark" />

        <View className="flex-row items-center border-b border-slate-100 bg-white px-4 pt-2 pb-4">
          <TouchableOpacity
            onPress={() => setSelectedCommunity(null)}
            className="mr-2 rounded-full bg-slate-100 p-2 active:bg-slate-200"
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

        <FlatList
          data={communityPosts}
          keyExtractor={(item) => item.id}
          renderItem={renderPostItem}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
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

        <TouchableOpacity
          className={`absolute right-6 bottom-6 h-14 w-14 items-center justify-center rounded-full shadow-lg ${selectedCommunity.color}`}
          onPress={() => setModalVisible(true)}
        >
          <Text className="mb-1 text-3xl font-light text-white">+</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-end bg-black/40">
            <View className="h-[70%] rounded-t-3xl bg-white p-5">
              <View className="mb-4 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => setModalVisible(false)}>
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
    <SafeAreaView className="flex-1 bg-slate-50">
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
