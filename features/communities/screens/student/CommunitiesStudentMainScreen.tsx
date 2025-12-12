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

export function CommunitiesStudentMainScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { token } = useAuth();

  const [communities, setCommunities] = useState<Community[]>([]);
  const [loadingCommunities, setLoadingCommunities] = useState(true);

  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(
    null,
  );
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [postText, setPostText] = useState('');

  const androidPaddingTop =
    Platform.OS === 'android' ? RNStatusBar.currentHeight : 0;

  // ----------------------------------------------------------------------
  // Cargar comunidades reales
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

  // Manejar botón back en detalle
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
  // Cargar posts de comunidad
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
  // Publicar post (estudiante)
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
              Comunidad oficial
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
                  ¡Sé el primero en escribir!
                </Text>
              </View>
            }
          />
        )}

        {/* FAB */}
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

  // ----------------------------------------------------------------------
  // VISTA LISTA PRINCIPAL
  // ----------------------------------------------------------------------
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
          Explora los {communities.length} grupos disponibles
        </Text>
      </View>

      {loadingCommunities ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={isDark ? 'white' : 'black'} />
        </View>
      ) : (
        <FlatList
          data={communities}
          keyExtractor={(item) => item.id}
          renderItem={renderCommunityItem}
          contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      )}
    </SafeAreaView>
  );
}
