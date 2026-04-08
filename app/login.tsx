import { useAuth } from '@/features/auth/AuthContext';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { setRole } = useAuth();

  function handleLogin(role: 'student' | 'admin') {
    setRole(role);
    router.replace('/(tabs)');
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
        backgroundColor: '#1e293b',
      }}
    >
      <Text
        style={{
          color: 'white',
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 16,
        }}
      >
        UAAPP — Login temporal
      </Text>
      <Pressable
        onPress={() => handleLogin('student')}
        style={{
          backgroundColor: '#10b981',
          paddingHorizontal: 32,
          paddingVertical: 12,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: 'white', fontWeight: '600' }}>
          Entrar como Estudiante
        </Text>
      </Pressable>
      <Pressable
        onPress={() => handleLogin('admin')}
        style={{
          backgroundColor: '#3b82f6',
          paddingHorizontal: 32,
          paddingVertical: 12,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: 'white', fontWeight: '600' }}>
          Entrar como Admin
        </Text>
      </Pressable>
    </View>
  );
}
