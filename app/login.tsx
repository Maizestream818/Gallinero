// app/login.tsx
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { useAuth } from '@/features/auth/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { setRole } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const normalizedEmail = email.trim().toLowerCase();

    // Si termina en @admin -> admin, en caso contrario -> student
    const isAdmin = normalizedEmail.endsWith('@admin');
    const newRole = isAdmin ? 'admin' : 'student';

    // Guardamos el rol en el contexto
    setRole(newRole);

    // Mensaje solo para probar
    Alert.alert(
      'Sesión iniciada',
      `Has iniciado sesión como: ${newRole.toUpperCase()}`,
    );

    // Luego te manda a las pestañas
    router.replace('/(tabs)');
  };

  return (
    <View className="flex-1 justify-center bg-slate-900 px-6">
      <StatusBar style="light" />

      <Text className="mb-2 text-3xl font-bold text-white">Iniciar sesión</Text>
      <Text className="mb-6 text-xs text-slate-400">
        Pantalla de inicio que se muestra antes de las pestañas.
      </Text>

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
        onPress={handleLogin}
        className="mt-6 items-center justify-center rounded-xl bg-emerald-500 px-4 py-3 active:bg-emerald-600"
      >
        <Text className="text-sm font-semibold text-white">Entrar</Text>
      </Pressable>
    </View>
  );
}
