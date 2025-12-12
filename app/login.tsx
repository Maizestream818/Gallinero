// app/login.tsx
import { useAuth } from '@/features/auth/AuthContext';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';

import axios from 'axios';
import * as AuthSession from 'expo-auth-session';

// GitHub OAuth discovery
const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
};

const GITHUB_CLIENT_ID = 'Ov23li2VpuVlOKyrfV6Z';

// 🔗 Backend
const API_BASE = 'http://10.147.18.126:3000';

export default function LoginScreen() {
  const router = useRouter();
  const { setRole, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ========================================================
  // 🔐 CONFIG AUTHSESSION (Expo, sin proxy)
  // ========================================================

  // Usamos esquema nativo (definido en app.json / app.config)
  const redirectUri = AuthSession.makeRedirectUri({
    native: 'gallinero://',
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GITHUB_CLIENT_ID,
      scopes: ['read:user', 'user:email'],
      redirectUri,
      usePKCE: false,
    },
    discovery,
  );

  // Debug opcional
  useEffect(() => {
    console.log('Redirect URI:', redirectUri);
  }, [redirectUri]);

  // ========================================================
  // 🔄 MANEJAR RESPUESTA DE GITHUB (OAuth)
  // ========================================================
  useEffect(() => {
    const handleAuthResponse = async () => {
      if (!response) return;

      if (response.type !== 'success') {
        if (response.type !== 'dismiss') {
          console.log('GitHub response:', response);
          Alert.alert('Cancelado', 'No se completó el login con GitHub.');
        }
        return;
      }

      const code = (response.params as any).code;
      if (!code) {
        Alert.alert('Error', 'GitHub no devolvió código de autorización.');
        return;
      }

      try {
        // 1️⃣ Intercambiar code → access_token + githubUser
        const exchangeRes = await axios.post(
          `${API_BASE}/api/auth/github/exchange`,
          { code },
        );

        const { githubUser } = exchangeRes.data;

        // 2️⃣ Verificar si el usuario ya existe
        const loginRes = await axios.post(`${API_BASE}/api/auth/github/login`, {
          githubId: githubUser.id,
        });

        // Si es primera vez → ir a pantalla de registro extra
        if (loginRes.data.firstTime) {
          // Intentar sacar email primario si viene de GitHub
          const emailFromGithub = (githubUser.email as string | null) || ''; // muchas veces viene null

          router.push({
            pathname: '/register',
            params: {
              githubId: githubUser.id.toString(),
              avatarUrl: githubUser.avatar_url,
              nombreGitHub: githubUser.name || githubUser.login,
              email: emailFromGithub,
            },
          });
          return;
        }

        // 3️⃣ Usuario YA existe → usamos token + role REAL del backend
        const { token, user } = loginRes.data;

        const roleFromBackend = user?.role === 'admin' ? 'admin' : 'student';

        await login({
          role: roleFromBackend,
          token,
          githubId: githubUser.id,
        });

        // (Opcional) mantener compat con cosas que lean setRole
        setRole(roleFromBackend);

        router.replace('/(tabs)');
      } catch (err) {
        console.error('Error en flujo GitHub:', err);
        Alert.alert('Error', 'Falló el inicio de sesión con GitHub.');
      }
    };

    handleAuthResponse();
  }, [response, router, login, setRole]);

  // ========================================================
  // ✉️ LOGIN POR EMAIL + PASSWORD (USA BACKEND)
  // ========================================================
  const handleLoginEmailPassword = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert('Campos requeridos', 'Ingresa correo y contraseña.');
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/api/auth/login-email`, {
        email: trimmedEmail,
        password: trimmedPassword,
      });

      const { token, role, githubId } = res.data;

      const finalRole = role === 'admin' ? 'admin' : 'student';

      await login({
        role: finalRole,
        token,
        githubId,
      });

      setRole(finalRole);

      Alert.alert(
        'Sesión iniciada',
        `Has iniciado sesión como: ${finalRole.toUpperCase()}`,
      );
      router.replace('/(tabs)');
    } catch (err: any) {
      console.error(
        'Error en login-email:',
        err?.response?.data || err.message,
      );
      Alert.alert(
        'Error',
        err?.response?.data?.error || 'No se pudo iniciar sesión con email.',
      );
    }
  };

  // ========================================================
  // 🔐 BOTÓN LOGIN CON GITHUB
  // ========================================================
  const handleGithubLogin = () => {
    if (!request) {
      Alert.alert('Espera', 'Todavía no está listo el login con GitHub.');
      return;
    }
    promptAsync();
  };

  // ========================================================
  // UI
  // ========================================================
  return (
    <View className="flex-1 justify-center bg-slate-900 px-6">
      <StatusBar style="light" />

      <Text className="mb-2 text-3xl font-bold text-white">Iniciar sesión</Text>
      <Text className="mb-6 text-xs text-slate-400">
        Pantalla de inicio antes de las pestañas.
      </Text>

      {/* LOGIN NORMAL (EMAIL + PASSWORD) */}
      <View className="gap-3">
        <View>
          <Text className="mb-1 text-xs text-slate-300">Correo</Text>
          <TextInput
            className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
            placeholder="correo@ejemplo.com"
            placeholderTextColor="#64748b"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View>
          <Text className="mb-1 text-xs text-slate-300">Contraseña</Text>
          <TextInput
            className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white"
            placeholder="••••••••"
            placeholderTextColor="#64748b"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
      </View>

      <Pressable
        onPress={handleLoginEmailPassword}
        className="mt-6 items-center justify-center rounded-xl bg-emerald-500 px-4 py-3 active:bg-emerald-600"
      >
        <Text className="text-sm font-semibold text-white">
          Entrar con correo
        </Text>
      </Pressable>

      {/* LOGIN CON GITHUB */}
      <Pressable
        onPress={handleGithubLogin}
        className="mt-4 items-center justify-center rounded-xl bg-slate-700 px-4 py-3 active:bg-slate-800"
      >
        <Text className="text-sm font-semibold text-white">
          Continuar con GitHub
        </Text>
      </Pressable>
    </View>
  );
}
