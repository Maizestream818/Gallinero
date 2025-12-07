import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

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
  };

  const androidPaddingTop =
    Platform.OS === 'android' ? RNStatusBar.currentHeight : 0;

  // ----------------------------------------------------------------------
  // RENDERIZADOS
  // ----------------------------------------------------------------------

  const renderCommunityItem = ({ item }: { item: Community }) => (
    <Pressable
      onPress={() => setSelectedCommunity(item)}
      className={`mb-4 flex-row items-center rounded-2xl border p-4 shadow-sm active:opacity-80 ${
        isDark ? 'border-slate-700 bg-slate-900' : 'border-sky-200 bg-white'
      }`}
    >
      <View
        className={`mr-4 h-12 w-12 items-center justify-center rounded-full ${item.color}`}
      >
        <IconSymbol name={item.iconName as any} size={24} color="white" />
      </View>
      <View className="flex-1">
        <Text
          className={`text-lg font-bold ${
            isDark ? 'text-slate-50' : 'text-slate-900'
          }`}
        >
          {item.name}
        </Text>
        <Text
          className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
          numberOfLines={1}
        >
          {item.description}
        </Text>
      </View>
      <IconSymbol
        name="chevron.right"
        size={20}
        color={isDark ? '#64748b' : '#0f172a'}
      />
    </Pressable>
  );

  const renderPostItem = ({ item }: { item: (typeof INITIAL_POSTS)[0] }) => (
    <View
      className={`mb-4 rounded-2xl border p-4 shadow-sm ${
        isDark ? 'border-slate-700 bg-slate-900' : 'border-sky-200 bg-white'
      }`}
    >
      <View className="mb-3 flex-row items-center">
        <Image
          source={{ uri: item.avatar }}
          className="h-10 w-10 rounded-full bg-slate-700"
        />
        <View className="ml-3">
          <Text
            className={`text-base font-bold ${
              isDark ? 'text-slate-50' : 'text-slate-900'
            }`}
          >
            {item.author}
          </Text>
          <Text
            className={`text-xs ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {item.role} • {item.time}
          </Text>
        </View>
      </View>
      <Text
        className={`text-sm leading-5 ${
          isDark ? 'text-slate-200' : 'text-slate-700'
        }`}
      >
        {item.content}
      </Text>
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
        className={`flex-1 ${isDark ? 'bg-slate-950' : 'bg-sky-100'}`}
        style={{ paddingTop: androidPaddingTop }}
      >
        <StatusBar style={isDark ? 'light' : 'dark'} />

        {/* Header Detalle */}
        <View
          className={`flex-row items-center border-b px-4 pt-2 pb-4 ${
            isDark
              ? 'border-slate-800 bg-slate-950'
              : 'border-sky-200 bg-sky-100'
          }`}
        >
          <TouchableOpacity
            onPress={() => setSelectedCommunity(null)}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            className={`mr-3 rounded-full p-2 active:opacity-80 ${
              isDark ? 'bg-slate-800' : 'bg-slate-200'
            }`}
          >
            <IconSymbol
              name="chevron.right"
              size={24}
              color={isDark ? '#e2e8f0' : '#0f172a'}
              style={{ transform: [{ rotate: '180deg' }] }}
            />
          </TouchableOpacity>
          <View>
            <Text
              className={`text-xl font-bold ${
                isDark ? 'text-slate-50' : 'text-slate-900'
              }`}
            >
              {selectedCommunity.name}
            </Text>
            <Text
              className={`text-xs ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
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
              <Text
                className={`mb-2 text-center ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                No hay publicaciones aún.
              </Text>
              <Text
                className={`text-center text-xs ${
                  isDark ? 'text-slate-500' : 'text-slate-500'
                }`}
              >
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
          <View
            className={`flex-1 justify-end ${
              isDark ? 'bg-slate-950/90' : 'bg-sky-100/95'
            }`}
          >
            <View
              className={`h-[70%] rounded-t-3xl border p-5 ${
                isDark
                  ? 'border-slate-800 bg-slate-900'
                  : 'border-sky-200 bg-white'
              }`}
            >
              <View className="mb-4 flex-row items-center justify-between">
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text
                    className={`text-base ${
                      isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    Cancelar
                  </Text>
                </TouchableOpacity>
                <Text
                  className={`text-lg font-bold ${
                    isDark ? 'text-slate-50' : 'text-slate-900'
                  }`}
                >
                  Publicar en {selectedCommunity.name}
                </Text>
                <TouchableOpacity
                  onPress={handlePublish}
                  disabled={postText.length === 0}
                  className={`rounded-full px-4 py-1.5 ${
                    postText.length > 0
                      ? selectedCommunity.color
                      : isDark
                        ? 'bg-slate-700'
                        : 'bg-slate-300'
                  }`}
                >
                  <Text className="text-sm font-bold text-white">Publicar</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                className={`flex-1 text-start text-base ${
                  isDark ? 'text-slate-50' : 'text-slate-900'
                }`}
                placeholder={`Comparte algo con la comunidad de ${selectedCommunity.name}...`}
                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
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
      className={`flex-1 ${isDark ? 'bg-slate-950' : 'bg-sky-100'}`}
      style={{ paddingTop: androidPaddingTop }}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <FlatList
        data={communities}
        keyExtractor={(item) => item.id}
        renderItem={renderCommunityItem}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 32,
          paddingTop: 20,
        }}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        ListHeaderComponent={
          <View
            className={`mb-3 border-b pb-4 ${
              isDark ? 'border-slate-800' : 'border-sky-200'
            }`}
          >
            <Text
              className={`text-3xl font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Comunidades (Admin)
            </Text>
            <Text
              className={`mt-1 text-xs ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Administre las {communities.length} comunidades disponibles
            </Text>

            <Pressable
              onPress={() => setCommunityModalVisible(true)}
              className="mt-3 self-start rounded-full bg-emerald-600 px-4 py-2 active:opacity-80"
            >
              <Text className="text-xs font-semibold text-white">
                Crear comunidad
              </Text>
            </Pressable>
          </View>
        }
      />

      {/* Modal Crear Comunidad */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={communityModalVisible}
        onRequestClose={() => setCommunityModalVisible(false)}
      >
        <View
          className={`flex-1 justify-end ${
            isDark ? 'bg-slate-950/90' : 'bg-sky-100/95'
          }`}
        >
          <View
            className={`h-[65%] rounded-t-3xl border p-5 ${
              isDark
                ? 'border-slate-800 bg-slate-900'
                : 'border-sky-200 bg-white'
            }`}
          >
            <View className="mb-4 flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => setCommunityModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text
                  className={`text-base ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>
              <Text
                className={`text-lg font-bold ${
                  isDark ? 'text-slate-50' : 'text-slate-900'
                }`}
              >
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
                    : isDark
                      ? 'bg-slate-700'
                      : 'bg-slate-300'
                }`}
              >
                <Text className="text-sm font-bold text-white">Crear</Text>
              </TouchableOpacity>
            </View>

            <View className="gap-4">
              <TextInput
                className={`rounded-2xl border px-4 py-3 text-base ${
                  isDark
                    ? 'border-slate-700 bg-slate-800 text-slate-50'
                    : 'border-sky-200 bg-sky-50 text-slate-900'
                }`}
                placeholder="Nombre de la comunidad"
                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                value={newCommunityName}
                onChangeText={setNewCommunityName}
              />
              <TextInput
                className={`h-32 rounded-2xl border px-4 py-3 text-base ${
                  isDark
                    ? 'border-slate-700 bg-slate-800 text-slate-50'
                    : 'border-sky-200 bg-sky-50 text-slate-900'
                }`}
                placeholder="Descripción de la comunidad"
                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
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
