// features/user/screens/student/UserStudentMainScreen.tsx
import { StatusBar } from 'expo-status-bar';

import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { AdminHeader } from '@/components/user/AdminHeader';
import { InfoRow } from '@/components/user/InfoRow';
import { OptionsMenuModal } from '@/components/ui/OptionsMenuModal';

export function UserStudentMainScreen() {
  // Estado para abrir/cerrar menú hamburguesa
  const [menuVisible, setMenuVisible] = useState(false);

  // Información simulada del administrador de momento
  // ASEGURAR DE CAMBIAR AL MOMENTO DE CONECTAR EL BACKEND
  const admin = {
    id: '242453',
    nombre: 'Luis Fernando Navarro Lozano',
    correo: 'alumno@correo.com',
    carrera: 'Ingeniería en Sistemas Computacionales',
    grado: '8to Semestre',
    grupo: 'B',
    sexo: 'Masculino',
    nivel_academico: 'Licenciatura',
    foto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300',
  };

  return (
    <View className="items flex-1 bg-slate-900">
      <StatusBar style="light" />

      <View className="flex-1 bg-slate-100">
        <StatusBar style="dark" />

        <ScrollView showsVerticalScrollIndicator={false}>
          <AdminHeader
            topTitle="Mi Credencial"
            subtitle="Identificación Digital Oficial"
            name={admin.nombre}
            roleLabel="ADMINISTRADOR"
            idLabel={`ID: ${admin.id}`}
            photoUri={admin.foto}
            onOpenMenu={() => setMenuVisible(true)}
          >
            <InfoRow label="Correo" value={admin.correo} />
            <InfoRow label="Carrera" value={admin.carrera} />
            <InfoRow label="Grado" value={admin.grado} />
            <InfoRow label="Grupo" value={admin.grupo} />
            <InfoRow
              label="Nivel Académico"
              value={admin.nivel_academico}
              isLast
            />
          </AdminHeader>

          <View className="h-6" />
        </ScrollView>

        {/* Menú hamburguesa como componente reutilizable */}
        <OptionsMenuModal
          visible={menuVisible}
          onClose={() => setMenuVisible(false)}
          onLogout={() => {
            console.log('Cerrar sesión');
            // OJO: Conectar el logout real después
          }}
        />
      </View>
    </View>
  );
}
