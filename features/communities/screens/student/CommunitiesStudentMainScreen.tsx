// features/communities/screens/student/CommunitiesStudentMainScreen.tsx
import { IconSymbol } from '@/components/ui/icon-symbol';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  Alert,
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

import {
  parseCreate,
  parseFind,
  type ParseBaseFields,
} from '@/lib/parseClient';
// Importación del logger de actividad
import { logActivity } from '@/utils/activityLogger'; // <-- NUEVO (Ajusta la ruta si es necesario)

// ----------------------------------------------------------------------
// 1. CONFIGURACIÓN / TIPOS
// ----------------------------------------------------------------------

const COMMUNITY_TYPES = [
  // ... (tipos)
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

type Community = {
  id: string;
  name: string;
  description: string;
  iconName: string;
  color: string;
};

type CommunityPost = {
  id: string;
  communityId: string;
  author: string;
  role: string;
  time: string;
  content: string;
  avatar: string;
};

type CommunityRecord = ParseBaseFields & Partial<Community>;
type CommunityPostRecord = ParseBaseFields & Partial<CommunityPost>;

// ----------------------------------------------------------------------
// 2. PANTALLA PRINCIPAL (STUDENT)
// ----------------------------------------------------------------------

export function CommunitiesStudentMainScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [communities, setCommunities] = useState<Community[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);

  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(
    null,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [postText, setPostText] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const androidPaddingTop =
    Platform.OS === 'android' ? RNStatusBar.currentHeight : 0;

  // --------------------------------------------------------------------
  // CARGAR DATOS DESDE BACK4APP
  // --------------------------------------------------------------------

  const loadDataFromDatabase = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const [communityResults, postResults] = await Promise.all([
        parseFind<CommunityRecord>('Community'),
        parseFind<CommunityPostRecord>('CommunityPost'),
      ]);

      const mappedCommunities: Community[] = communityResults.map(
        (item, index) => {
          const type = COMMUNITY_TYPES[index % COMMUNITY_TYPES.length];

          return {
            id: item.objectId,
            name: item.name ?? `Comunidad ${index + 1}`,
            description: item.description ?? type.desc,
            iconName: item.iconName ?? type.icon,
            color: item.color ?? type.color,
          };
        },
      );

      const mappedPosts: CommunityPost[] = postResults.map((item) => ({
        id: item.objectId,
        communityId: item.communityId ?? '',
        author: item.author ?? 'Desconocido',
        role: item.role ?? 'Miembro',
        time: item.time ?? 'Hace un momento',
        content: item.content ?? '',
        avatar:
          item.avatar ??
          'https://i.pravatar.cc/150?u=gallinero-community-default',
      }));

      setCommunities(mappedCommunities);
      setPosts(mappedPosts);
    } catch (err: any) {
      console.error('Error cargando comunidades/posts (student)', err);
      setErrorMsg(String(err?.message ?? err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDataFromDatabase();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDataFromDatabase();
    setRefreshing(false);
  };

  // --------------------------------------------------------------------
  // BACK BUTTON ANDROID (cerrar detalle)
  // --------------------------------------------------------------------

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

  // --------------------------------------------------------------------
  // PUBLICAR POST (GUARDAR EN CommunityPost)
  // --------------------------------------------------------------------

  const handlePublish = async () => {
    if (postText.trim() === '' || !selectedCommunity) return;

    const payload = {
      communityId: selectedCommunity.id,
      author: 'Tú',
      role: 'Estudiante',
      time: 'Ahora',
      content: postText.trim(),
      avatar: 'https://i.pravatar.cc/150?u=student',
    };

    try {
      const created = await parseCreate('CommunityPost', payload);

      const newPost: CommunityPost = {
        id: created.objectId,
        ...payload,
      };

      setPosts((prev) => [newPost, ...prev]);

      // REGISTRO DE ACTIVIDAD: Realizaste un post
      await logActivity(`Realizaste un post en "${selectedCommunity.name}"`); // <-- NUEVO

      setPostText('');
      setModalVisible(false);
    } catch (err: any) {
      console.log('Error publicando post (student)', err);
      Alert.alert('Error', `Error al publicar: ${err?.message ?? err}`);
    }
  };

  // --------------------------------------------------------------------
  // RENDERIZADOS
  // --------------------------------------------------------------------

  // ... (renderCommunityItem, renderPostItem, y resto del componente) ...

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

  const renderPostItem = ({ item }: { item: CommunityPost }) => (
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

  // --------------------------------------------------------------------
  // VISTA DETALLE DE COMUNIDAD
  // --------------------------------------------------------------------

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
              Comunidad oficial
            </Text>
          </View>
        </View>

        {/* LISTA DE POSTS */}
        <FlatList<CommunityPost>
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
                ¡Sé el primero en escribir!
              </Text>
            </View>
          }
        />

        {/* BOTÓN FLOTANTE PARA PUBLICAR */}
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
                  disabled={postText.trim().length === 0}
                  className={`rounded-full px-4 py-1.5 ${
                    postText.trim().length > 0
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
                placeholder={`Comparte algo con el grupo de ${selectedCommunity.name}...`}
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

  // --------------------------------------------------------------------
  // VISTA LISTA PRINCIPAL
  // --------------------------------------------------------------------

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? 'bg-slate-950' : 'bg-sky-100'}`}
      style={{ paddingTop: androidPaddingTop }}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View
        className={`border-b px-5 pt-6 pb-4 ${
          isDark ? 'border-slate-800 bg-slate-950' : 'border-sky-200 bg-sky-100'
        }`}
      >
        <Text
          className={`text-3xl font-bold ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          Comunidades
        </Text>
        <Text
          className={`mt-1 text-xs ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          Explora las comunidades disponibles
        </Text>

        {isLoading && (
          <Text
            className={`mt-1 text-xs ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Cargando comunidades...
          </Text>
        )}

        {errorMsg && (
          <Text className="mt-1 text-xs font-semibold text-red-400">
            Error al cargar datos: {errorMsg}
          </Text>
        )}
      </View>

      <FlatList<Community>
        data={communities}
        keyExtractor={(item) => item.id}
        renderItem={renderCommunityItem}
        contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          !isLoading ? (
            <View className="mt-10 items-center">
              <Text
                className={`mb-2 text-center ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                No hay comunidades disponibles.
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
