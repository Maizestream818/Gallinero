import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAuth } from '@/features/auth/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import { SafeAreaView } from 'react-native-safe-area-context';

const API_BASE = 'http://10.147.18.126:3000';

// ----------------------------------------------------------------------
// Tipos y configuración
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

type Community = {
  id: string;
  name: string;
  description: string;
  color: string;
  iconName: string;
};

type Post = {
  id: string;
  communityId: string;
  authorGithubId: number;
  authorName: string;
  role: string;
  avatarUrl?: string | null;
  content: string;
  timestamp: number;
};

export function CommunitiesAdminMainScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { token, role } = useAuth();

  const [communities, setCommunities] = useState<Community[]>([]);
  const [loadingCommunities, setLoadingCommunities] = useState(true);

  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(
    null,
  );

  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [postText, setPostText] = useState('');

  const [communityModalVisible, setCommunityModalVisible] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState('');
  const [newCommunityDescription, setNewCommunityDescription] = useState('');

  const androidPaddingTop =
    Platform.OS === 'android' ? RNStatusBar.currentHeight : 0;

  // ----------------------------------------------------------------------
  // Cargar comunidades desde backend
  // ----------------------------------------------------------------------
  useEffect(() => {
    const loadCommunities = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/comunidades`);
        setCommunities(res.data || []);
      } catch (err) {
        console.error('Error cargando comunidades:', err);
        Alert.alert('Error', 'No se pudieron cargar las comunidades');
      } finally {
        setLoadingCommunities(false);
      }
    };

    loadCommunities();
  }, []);

  // Manejar botón back físico en Android (volver del detalle a la lista)
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
  // Cargar posts de una comunidad
  // ----------------------------------------------------------------------
  const loadPostsForCommunity = async (community: Community) => {
    setSelectedCommunity(community);
    setLoadingPosts(true);

    try {
      const res = await axios.get(
        `${API_BASE}/api/comunidades/${community.id}/posts`,
      );
      setPosts(res.data || []);
    } catch (err) {
      console.error('Error cargando posts:', err);
      Alert.alert('Error', 'No se pudieron cargar las publicaciones');
    } finally {
      setLoadingPosts(false);
    }
  };

  // ----------------------------------------------------------------------
  // PUBLICAR POST EN COMUNIDAD (ADMIN)
  // ----------------------------------------------------------------------
  const handlePublish = async () => {
    if (!postText.trim() || !selectedCommunity) return;

    if (!token) {
      Alert.alert('Sesión requerida', 'Debes iniciar sesión para publicar');
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE}/api/posts`,
        {
          communityId: selectedCommunity.id,
          content: postText.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const newPost: Post = res.data.post;
      setPosts((prev) => [newPost, ...prev]);
      setPostText('');
      setModalVisible(false);
    } catch (err) {
      console.error('Error publicando post:', err);
      Alert.alert('Error', 'No se pudo publicar el mensaje');
    }
  };

  // ----------------------------------------------------------------------
  // CREAR NUEVA COMUNIDAD (ADMIN)
  // ----------------------------------------------------------------------
  const handleCreateCommunity = async () => {
    const name = newCommunityName.trim();
    const description = newCommunityDescription.trim();

    if (!name || !description) {
      Alert.alert('Campos requeridos', 'Nombre y descripción son obligatorios');
      return;
    }

    if (!token || role !== 'admin') {
      Alert.alert('Permisos', 'Solo el administrador puede crear comunidades');
      return;
    }

    // Elegir tipo para color e icono
    const typeIndex = communities.length % COMMUNITY_TYPES.length;
    const type = COMMUNITY_TYPES[typeIndex];

    try {
      const res = await axios.post(
        `${API_BASE}/api/comunidades`,
        {
          name,
          description,
          color: type.color,
          iconName: type.icon,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const nueva: Community = res.data.comunidad;
      setCommunities((prev) => [nueva, ...prev]);

      setNewCommunityName('');
      setNewCommunityDescription('');
      setCommunityModalVisible(false);
    } catch (err) {
      console.error('Error creando comunidad:', err);
      Alert.alert('Error', 'No se pudo crear la comunidad');
    }
  };

  // ----------------------------------------------------------------------
  // RENDERIZADOS
  // ----------------------------------------------------------------------
  const renderCommunityItem = ({ item }: { item: Community }) => (
    <Pressable
      onPress={() => loadPostsForCommunity(item)}
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

  const renderPostItem = ({ item }: { item: Post }) => (
    <View
      className={`mb-4 rounded-2xl border p-4 shadow-sm ${
        isDark ? 'border-slate-700 bg-slate-900' : 'border-sky-200 bg-white'
      }`}
    >
      <View className="mb-3 flex-row items-center">
        <Image
          source={{
            uri:
              item.avatarUrl ||
              `https://i.pravatar.cc/150?u=${item.authorGithubId}`,
          }}
          className="h-10 w-10 rounded-full bg-slate-700"
        />
        <View className="ml-3">
          <Text
            className={`text-base font-bold ${
              isDark ? 'text-slate-50' : 'text-slate-900'
            }`}
          >
            {item.authorName}
          </Text>
          <Text
            className={`text-xs ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {item.role} •{' '}
            {new Date(item.timestamp).toLocaleString('es-MX', {
              hour: '2-digit',
              minute: '2-digit',
              day: '2-digit',
              month: '2-digit',
            })}
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
    return (
      <SafeAreaView
        className={`flex-1 ${isDark ? 'bg-slate-950' : 'bg-sky-100'}`}
        style={{ paddingTop: androidPaddingTop }}
      >
        <StatusBar style={isDark ? 'light' : 'dark'} />

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

        {loadingPosts ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator
              size="large"
              color={isDark ? 'white' : 'black'}
            />
          </View>
        ) : (
          <FlatList
            data={posts}
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
                  ¡Crea la primera publicación!
                </Text>
              </View>
            }
          />
        )}

        {/* FAB para publicar */}
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
                  disabled={!postText.trim()}
                  className={`rounded-full px-4 py-1.5 ${
                    postText.trim()
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
  // VISTA LISTA PRINCIPAL (COMUNIDADES + CREAR COMUNIDAD)
  // ----------------------------------------------------------------------
  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? 'bg-slate-950' : 'bg-sky-100'}`}
      style={{ paddingTop: androidPaddingTop }}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {loadingCommunities ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={isDark ? 'white' : 'black'} />
        </View>
      ) : (
        <FlatList
          data={communities}
          keyExtractor={(item) => item.id}
          renderItem={renderCommunityItem}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 32,
            paddingTop: 20,
          }}
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
                Administra las {communities.length} comunidades disponibles
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
      )}

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
                  !newCommunityName.trim() || !newCommunityDescription.trim()
                }
                className={`rounded-full px-4 py-1.5 ${
                  newCommunityName.trim() && newCommunityDescription.trim()
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
