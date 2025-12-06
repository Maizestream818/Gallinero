import { IconSymbol } from '@/components/ui/icon-symbol';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  StatusBar as RNStatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ----------------------------------------------------------------------
// 1. GENERADOR DE 14 COMUNIDADES
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

const DUMMY_COMMUNITIES = Array.from({ length: 14 }, (_, i) => {
  const type = COMMUNITY_TYPES[i % COMMUNITY_TYPES.length];
  return {
    id: `c${i + 1}`,
    name: `${type.name} ${Math.floor(i / 6) + 1}`,
    description: `${type.desc} - Grupo oficial #${i + 1}`,
    iconName: type.icon,
    color: type.color,
  };
});

type Community = (typeof DUMMY_COMMUNITIES)[0];

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
  const allPosts: any[] = [];
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

export function CommunitiesAdminMainScreen() {
  // Comunidades dinámicas
  const [communities, setCommunities] =
    useState<Community[]>(DUMMY_COMMUNITIES);

  // Comunidad seleccionada (detalle)
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(
    null,
  );

  // Posts
  const [posts, setPosts] = useState(INITIAL_POSTS);

  // Modal publicar post
  const [modalVisible, setModalVisible] = useState(false);
  const [postText, setPostText] = useState('');

  // Modal crear comunidad
  const [communityModalVisible, setCommunityModalVisible] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState('');
  const [newCommunityDescription, setNewCommunityDescription] = useState('');

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

  // ----------------------------------------------------------------------
  // PUBLICAR POST EN COMUNIDAD
  // ----------------------------------------------------------------------
  const handlePublish = () => {
    if (postText.trim() === '' || !selectedCommunity) return;

    const newPost = {
      id: Date.now().toString(),
      communityId: selectedCommunity.id,
      author: 'Tú',
      role: 'Administrador',
      time: 'Ahora',
      content: postText,
      avatar: 'https://i.pravatar.cc/150?u=admin',
    };

    setPosts([newPost, ...posts]);
    setPostText('');
    setModalVisible(false);
  };

  // ----------------------------------------------------------------------
  // CREAR NUEVA COMUNIDAD
  // ----------------------------------------------------------------------
  const handleCreateCommunity = () => {
    const name = newCommunityName.trim();
    const description = newCommunityDescription.trim();

    if (!name || !description) {
      return;
    }

    const typeIndex = communities.length % COMMUNITY_TYPES.length;
    const type = COMMUNITY_TYPES[typeIndex];

    const newCommunity: Community = {
      id: `c${communities.length + 1}`,
      name,
      description,
      iconName: type.icon,
      color: type.color,
    };

    setCommunities([newCommunity, ...communities]);
    setNewCommunityName('');
    setNewCommunityDescription('');
    setCommunityModalVisible(false);

    // Si quiere abrirla de inmediato:
    // setSelectedCommunity(newCommunity);
  };

  const androidPaddingTop =
    Platform.OS === 'android' ? RNStatusBar.currentHeight : 0;

  // ----------------------------------------------------------------------
  // RENDERIZADOS
  // ----------------------------------------------------------------------

  const renderCommunityItem = ({ item }: { item: Community }) => (
    <Pressable
      onPress={() => setSelectedCommunity(item)}
      className="mb-4 flex-row items-center rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-sm active:bg-slate-800"
    >
      <View
        className={`mr-4 h-12 w-12 items-center justify-center rounded-full ${item.color}`}
      >
        <IconSymbol name={item.iconName as any} size={24} color="white" />
      </View>
      <View className="flex-1">
        <Text className="text-lg font-bold text-slate-50">{item.name}</Text>
        <Text className="text-sm text-slate-400" numberOfLines={1}>
          {item.description}
        </Text>
      </View>
      <IconSymbol name="chevron.right" size={20} color="#64748b" />
    </Pressable>
  );

  const renderPostItem = ({ item }: { item: (typeof INITIAL_POSTS)[0] }) => (
    <View className="mb-4 rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-sm">
      <View className="mb-3 flex-row items-center">
        <Image
          source={{ uri: item.avatar }}
          className="h-10 w-10 rounded-full bg-slate-700"
        />
        <View className="ml-3">
          <Text className="text-base font-bold text-slate-50">
            {item.author}
          </Text>
          <Text className="text-xs text-slate-400">
            {item.role} • {item.time}
          </Text>
        </View>
      </View>
      <Text className="text-sm leading-5 text-slate-200">{item.content}</Text>
    </View>
  );

  // ----------------------------------------------------------------------
  // VISTA DETALLE DE COMUNIDAD
  // ----------------------------------------------------------------------
  if (selectedCommunity) {
    const communityPosts = posts.filter(
      (post) => post.communityId === selectedCommunity.id,
    );

    return (
      <SafeAreaView
        className="flex-1 bg-slate-900"
        style={{ paddingTop: androidPaddingTop }}
      >
        <StatusBar style="light" />

        {/* Header Detalle */}
        <View className="flex-row items-center border-b border-slate-800 bg-slate-900 px-4 pt-2 pb-4">
          <TouchableOpacity
            onPress={() => setSelectedCommunity(null)}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            className="mr-3 rounded-full bg-slate-800 p-2 active:bg-slate-700"
          >
            <IconSymbol
              name="chevron.right"
              size={24}
              color="#e2e8f0"
              style={{ transform: [{ rotate: '180deg' }] }}
            />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-bold text-slate-50">
              {selectedCommunity.name}
            </Text>
            <Text className="text-xs text-slate-400">
              Panel de administración
            </Text>
          </View>
        </View>

        {/* LISTA DE POSTS */}
        <FlatList
          data={communityPosts}
          keyExtractor={(item) => item.id}
          renderItem={renderPostItem}
          contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="mt-10 items-center">
              <Text className="mb-2 text-center text-slate-400">
                No hay publicaciones aún.
              </Text>
              <Text className="text-center text-xs text-slate-500">
                ¡Cree la primera publicación!
              </Text>
            </View>
          }
        />

        {/* BOTÓN FLOTANTE (FAB) PARA PUBLICAR */}
        <TouchableOpacity
          className={`absolute right-6 bottom-20 z-50 h-14 w-14 items-center justify-center rounded-full shadow-lg ${selectedCommunity.color}`}
          onPress={() => setModalVisible(true)}
        >
          <Text className="mb-1 text-3xl font-light text-white">+</Text>
        </TouchableOpacity>

        {/* Modal Publicar */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-end bg-slate-950/90">
            <View className="h-[70%] rounded-t-3xl border border-slate-800 bg-slate-900 p-5">
              <View className="mb-4 flex-row items-center justify-between">
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text className="text-base text-slate-300">Cancelar</Text>
                </TouchableOpacity>
                <Text className="text-lg font-bold text-slate-50">
                  Publicar en {selectedCommunity.name}
                </Text>
                <TouchableOpacity
                  onPress={handlePublish}
                  disabled={postText.length === 0}
                  className={`rounded-full px-4 py-1.5 ${
                    postText.length > 0
                      ? selectedCommunity.color
                      : 'bg-slate-700'
                  }`}
                >
                  <Text className="text-sm font-bold text-white">Publicar</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                className="flex-1 text-start text-base text-slate-50"
                placeholder={`Comparte algo con la comunidad de ${selectedCommunity.name}...`}
                placeholderTextColor="#64748b"
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

  // ----------------------------------------------------------------------
  // VISTA LISTA PRINCIPAL (COMUNIDADES + BOTÓN CREAR COMUNIDAD)
  // ----------------------------------------------------------------------
  return (
    <SafeAreaView
      className="flex-1 bg-slate-900"
      style={{ paddingTop: androidPaddingTop }}
    >
      <StatusBar style="light" />

      <View className="border-b border-slate-800 bg-slate-900 px-5 pt-6 pb-4">
        <Text className="text-3xl font-bold text-white">
          Comunidades (Admin)
        </Text>
        <Text className="mt-1 text-xs text-slate-300">
          Administre las {communities.length} comunidades disponibles
        </Text>

        {/* Botón verde al estilo "Agregar evento" */}
        <Pressable
          onPress={() => setCommunityModalVisible(true)}
          className="mt-3 self-start rounded-full bg-emerald-600 px-4 py-2 active:opacity-80"
        >
          <Text className="text-xs font-semibold text-white">
            Crear comunidad
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={communities}
        keyExtractor={(item) => item.id}
        renderItem={renderCommunityItem}
        contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />

      {/* Modal Crear Comunidad */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={communityModalVisible}
        onRequestClose={() => setCommunityModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-slate-950/90">
          <View className="h-[65%] rounded-t-3xl border border-slate-800 bg-slate-900 p-5">
            <View className="mb-4 flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => setCommunityModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text className="text-base text-slate-300">Cancelar</Text>
              </TouchableOpacity>
              <Text className="text-lg font-bold text-slate-50">
                Crear nueva comunidad
              </Text>
              <TouchableOpacity
                onPress={handleCreateCommunity}
                disabled={
                  newCommunityName.trim().length === 0 ||
                  newCommunityDescription.trim().length === 0
                }
                className={`rounded-full px-4 py-1.5 ${
                  newCommunityName.trim().length > 0 &&
                  newCommunityDescription.trim().length > 0
                    ? 'bg-emerald-600'
                    : 'bg-slate-700'
                }`}
              >
                <Text className="text-sm font-bold text-white">Crear</Text>
              </TouchableOpacity>
            </View>

            <View className="gap-4">
              <TextInput
                className="rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-base text-slate-50"
                placeholder="Nombre de la comunidad"
                placeholderTextColor="#64748b"
                value={newCommunityName}
                onChangeText={setNewCommunityName}
              />
              <TextInput
                className="h-32 rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-base text-slate-50"
                placeholder="Descripción de la comunidad"
                placeholderTextColor="#64748b"
                value={newCommunityDescription}
                onChangeText={setNewCommunityDescription}
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
