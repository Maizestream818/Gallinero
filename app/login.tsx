// app/login.tsx
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  isAdminEmail,
  loginUser,
  registerUser,
  type RegisterUserInput,
} from '@/lib/parseClient';

// Usamos el AuthContext para guardar user + rol (objeto plano)
import { useAuth } from '@/features/auth/AuthContext';

// 🔹 Logger de actividad (Back4App)
import { logActivity } from '@/utils/activityLogger';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Traemos del contexto el setter global
  const { setAuth } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Campos comunes
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Campos solo registro
  const [fullName, setFullName] = useState('');
  const [career, setCareer] = useState('');
  const [studentId, setStudentId] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);

  // ------------------------------
  // HANDLERS
  // ------------------------------

  const handleRegister = async () => {
    if (loading) return;

    if (
      !fullName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword ||
      !career.trim() ||
      !studentId.trim() ||
      !gender.trim() ||
      !age.trim()
    ) {
      Alert.alert('Campos incompletos', 'Por favor llene todos los campos.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Contraseñas distintas', 'Las contraseñas no coinciden.');
      return;
    }

    const ageNumber = Number(age);
    if (Number.isNaN(ageNumber) || ageNumber <= 0) {
      Alert.alert('Edad inválida', 'Ingrese una edad válida.');
      return;
    }

    setLoading(true);
    try {
      const payload: RegisterUserInput = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        career: career.trim(),
        studentId: studentId.trim(),
        gender: gender.trim(),
        age: ageNumber,
      };

      await registerUser(payload);

      Alert.alert(
        'Registro exitoso',
        'Su cuenta ha sido creada. Ahora puede iniciar sesión.',
      );

      // Limpiar y cambiar a modo login
      setPassword('');
      setConfirmPassword('');
      setMode('login');
    } catch (error: any) {
      console.error('Error registrando usuario', error);
      Alert.alert(
        'Error al registrar',
        error?.message ?? 'Ocurrió un error al registrar.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (loading) return;

    if (!email.trim() || !password) {
      Alert.alert(
        'Campos incompletos',
        'Ingrese correo electrónico y contraseña.',
      );
      return;
    }

    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();

      // 1) Autenticación con Parse vía REST
      const apiUser = await loginUser(normalizedEmail, password);
      // apiUser trae: objectId, email, fullName, career, studentId, gender, age, sessionToken, etc.

      // 2) Verificar si es admin
      const admin = await isAdminEmail(normalizedEmail);
      const role: 'admin' | 'student' = admin ? 'admin' : 'student';

      // 3) Construimos el usuario plano para el contexto
      const authUser = {
        objectId: apiUser.objectId as string,
        email: (apiUser.email as string) ?? normalizedEmail,
        fullName: apiUser.fullName as string | undefined,
        career: apiUser.career as string | undefined,
        studentId: apiUser.studentId as string | undefined,
        gender: apiUser.gender as string | undefined,
        age: apiUser.age as number | undefined,
      };

      // 4) Guardamos en AuthContext
      setAuth({ user: authUser, role });

      const nameFromDb = authUser.fullName ?? authUser.email;
      const roleLabel = role === 'admin' ? 'Administrador' : 'Alumno';

      // 5) Registrar INICIO DE SESIÓN en ActivityLog (Back4App)
      await logActivity(`Inició sesión (${roleLabel})`, {
        userId: authUser.objectId,
        email: authUser.email,
        fullName: authUser.fullName,
      });

      // 6) Mensaje de bienvenida
      if (role === 'admin') {
        Alert.alert('Bienvenido', `${nameFromDb}\n(Rol: Administrador)`);
      } else {
        Alert.alert('Bienvenido', `${nameFromDb}\n(Rol: Alumno)`);
      }

      // 7) Navega al layout principal (grupo de tabs)
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Error al iniciar sesión', error);
      Alert.alert(
        'Error al iniciar sesión',
        error?.message ?? 'Revise su correo y contraseña.',
      );
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  // UI
  // ------------------------------

  const bgClass = isDark ? 'bg-slate-950' : 'bg-sky-100';
  const cardClass = isDark
    ? 'bg-slate-900 border-slate-800'
    : 'bg-white border-sky-200';
  const labelClass = isDark ? 'text-slate-200' : 'text-slate-700';
  const inputClass = isDark
    ? 'border-slate-700 bg-slate-800 text-slate-50'
    : 'border-sky-200 bg-sky-50 text-slate-900';

  return (
    <KeyboardAvoidingView
      className={`flex-1 ${bgClass}`}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center py-10">
          {/* Título */}
          <View className="mb-8">
            <Text
              className={`text-center text-3xl font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Gallinero
            </Text>
            <Text
              className={`mt-2 text-center text-xs ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Inicie sesión o cree su cuenta para continuar
            </Text>
          </View>

          {/* Tabs Login / Registro */}
          <View
            className={`mb-4 flex-row rounded-full border p-1 ${
              isDark ? 'border-slate-700' : 'border-sky-300'
            }`}
          >
            <TouchableOpacity
              className={`flex-1 items-center rounded-full py-2 ${
                mode === 'login' ? 'bg-emerald-600' : 'bg-transparent'
              }`}
              onPress={() => setMode('login')}
              disabled={loading}
            >
              <Text
                className={`text-xs font-semibold ${
                  mode === 'login'
                    ? 'text-white'
                    : isDark
                      ? 'text-slate-300'
                      : 'text-slate-700'
                }`}
              >
                Iniciar sesión
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 items-center rounded-full py-2 ${
                mode === 'register' ? 'bg-emerald-600' : 'bg-transparent'
              }`}
              onPress={() => setMode('register')}
              disabled={loading}
            >
              <Text
                className={`text-xs font-semibold ${
                  mode === 'register'
                    ? 'text-white'
                    : isDark
                      ? 'text-slate-300'
                      : 'text-slate-700'
                }`}
              >
                Registrarse
              </Text>
            </TouchableOpacity>
          </View>

          {/* Card principal */}
          <View className={`rounded-2xl border p-5 ${cardClass}`}>
            {/* CAMPOS COMUNES (correo / password) */}
            <Text className={`mb-1 text-xs font-semibold ${labelClass}`}>
              Correo electrónico
            </Text>
            <TextInput
              className={`mb-3 rounded-xl border px-3 py-2 text-sm ${inputClass}`}
              placeholder="correo@ejemplo.com"
              placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text className={`mb-1 text-xs font-semibold ${labelClass}`}>
              Contraseña
            </Text>
            <TextInput
              className={`mb-3 rounded-xl border px-3 py-2 text-sm ${inputClass}`}
              placeholder="********"
              placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {/* CAMPOS SOLO REGISTRO */}
            {mode === 'register' && (
              <>
                <Text className={`mb-1 text-xs font-semibold ${labelClass}`}>
                  Nombre completo
                </Text>
                <TextInput
                  className={`mb-3 rounded-xl border px-3 py-2 text-sm ${inputClass}`}
                  placeholder="Nombre y apellidos"
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                  value={fullName}
                  onChangeText={setFullName}
                />

                <Text className={`mb-1 text-xs font-semibold ${labelClass}`}>
                  Carrera
                </Text>
                <TextInput
                  className={`mb-3 rounded-xl border px-3 py-2 text-sm ${inputClass}`}
                  placeholder="Ingeniería en Sistemas..."
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                  value={career}
                  onChangeText={setCareer}
                />

                <Text className={`mb-1 text-xs font-semibold ${labelClass}`}>
                  ID
                </Text>
                <TextInput
                  className={`mb-3 rounded-xl border px-3 py-2 text-sm ${inputClass}`}
                  placeholder="Matrícula / ID"
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                  value={studentId}
                  onChangeText={setStudentId}
                />

                <Text className={`mb-1 text-xs font-semibold ${labelClass}`}>
                  Género
                </Text>
                <TextInput
                  className={`mb-3 rounded-xl border px-3 py-2 text-sm ${inputClass}`}
                  placeholder="Masculino, Femenino, Otro..."
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                  value={gender}
                  onChangeText={setGender}
                />

                <Text className={`mb-1 text-xs font-semibold ${labelClass}`}>
                  Edad
                </Text>
                <TextInput
                  className={`mb-3 rounded-xl border px-3 py-2 text-sm ${inputClass}`}
                  placeholder="23"
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                  keyboardType="number-pad"
                  value={age}
                  onChangeText={setAge}
                />

                <Text className={`mb-1 text-xs font-semibold ${labelClass}`}>
                  Confirmar contraseña
                </Text>
                <TextInput
                  className={`mb-3 rounded-xl border px-3 py-2 text-sm ${inputClass}`}
                  placeholder="********"
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </>
            )}

            {/* BOTÓN PRINCIPAL */}
            <TouchableOpacity
              className={`mt-4 items-center rounded-full bg-emerald-600 py-3 active:opacity-80 ${
                loading ? 'opacity-70' : ''
              }`}
              onPress={mode === 'login' ? handleLogin : handleRegister}
              disabled={loading}
            >
              <Text className="text-xs font-semibold text-white">
                {loading
                  ? 'Procesando...'
                  : mode === 'login'
                    ? 'Iniciar sesión'
                    : 'Crear cuenta'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
