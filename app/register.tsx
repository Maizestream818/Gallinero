// app/register.tsx

import { useAuth } from '@/features/auth/AuthContext';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const params = useLocalSearchParams();
  const githubId = Number(params.githubId);
  const avatarUrl = params.avatarUrl as string;
  const nombreGitHub = params.nombreGitHub as string;
  const emailGitHub = params.email ? (params.email as string) : '';

  const [nombre, setNombre] = useState(nombreGitHub || '');
  const [email, setEmail] = useState(emailGitHub);
  const [password, setPassword] = useState('');
  const [idEscolar, setIdEscolar] = useState('');
  const [edad, setEdad] = useState('');
  const [sexo, setSexo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (loading) return;
    setLoading(true);

    if (!nombre || !email || !password || !idEscolar || !edad || !sexo) {
      setLoading(false);
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    try {
      const res = await axios.post(
        'http://10.147.18.126:3000/api/auth/github/register',
        {
          githubId,
          nombre,
          email,
          password,
          idEscolar,
          edad: Number(edad),
          sexo,
          avatarUrl,
        },
      );

      const { token, role } = res.data;

      // Guardar sesión con el rol REAL
      await login({
        role: (role as 'admin' | 'student') || 'student',
        token,
        githubId,
      });

      router.replace('/(tabs)');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo registrar el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-900 px-6 pt-20">
      <StatusBar style="light" />

      <Text className="mb-4 text-3xl font-bold text-white">
        Completar registro
      </Text>

      <Text className="mb-6 text-slate-400">
        Bienvenido {nombreGitHub}. Completa tus datos.
      </Text>

      {/* 📌 Nombre */}
      <Text className="mb-1 text-xs text-slate-300">Nombre</Text>
      <TextInput
        className="mb-4 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white"
        value={nombre}
        onChangeText={setNombre}
      />

      {/* 📌 Correo */}
      <Text className="mb-1 text-xs text-slate-300">Correo electrónico</Text>
      <TextInput
        className="mb-4 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white"
        value={email}
        onChangeText={setEmail}
        editable={!emailGitHub} // si vino desde GitHub, queda bloqueado
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* 📌 Contraseña */}
      <Text className="mb-1 text-xs text-slate-300">Contraseña</Text>
      <TextInput
        className="mb-4 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder="••••••••"
        placeholderTextColor="#64748b"
      />

      {/* 📌 ID Escolar */}
      <Text className="mb-1 text-xs text-slate-300">ID Escolar</Text>
      <TextInput
        className="mb-4 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white"
        value={idEscolar}
        onChangeText={setIdEscolar}
        keyboardType="number-pad"
      />

      {/* 📌 Edad */}
      <Text className="mb-1 text-xs text-slate-300">Edad</Text>
      <TextInput
        className="mb-4 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white"
        value={edad}
        onChangeText={setEdad}
        keyboardType="number-pad"
      />

      {/* 📌 Sexo */}
      <Text className="mb-1 text-xs text-slate-300">Sexo (M/F)</Text>
      <TextInput
        className="mb-8 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white"
        value={sexo}
        onChangeText={setSexo}
        autoCapitalize="characters"
        maxLength={1}
      />

      {/* BOTÓN REGISTRAR */}
      <Pressable
        onPress={handleRegister}
        disabled={loading}
        className={`items-center justify-center rounded-xl px-4 py-3 ${
          loading ? 'bg-slate-600' : 'bg-emerald-500'
        }`}
      >
        <Text className="text-sm font-semibold text-white">
          {loading ? 'Guardando...' : 'Registrarse'}
        </Text>
      </Pressable>
    </View>
  );
}
