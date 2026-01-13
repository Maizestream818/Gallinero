// features/user/screens/admin/UserAdminMainScreen.tsx
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Text,View, ScrollView } from 'react-native';

import { AdminHeader } from '@/components/admin/AdminHeader';
import { InfoRow } from '@/components/admin/InfoRow';
import { OptionsMenuModal } from '@/components/ui/OptionsMenuModal';

//Pantalla de informacion del administrador 
export function UserAdminMainScreen() {
  // Estado para abrir/cerrar menú hamburguesa
  const [menuVisible, setMenuVisible] = useState(false);

  // Información simulada del administrador de momento 
  // ASEGURAR DE CAMBIAR AL MOMENTO DE CONECTAR EL BACKEND
  const admin = {
    id: "ADM-001",
    nombre: "Oswaldo Cruz García",
    correo: "admin@correo.com",
    puesto: "Coordinador",
    departamento: "Difusión y Cultura",
    sexo: "Masculino",
    foto: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300",
  };

  return (
    <View className="flex-1 items bg-slate-900">
    <StatusBar style="light"/>

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
          <InfoRow label="Puesto" value={admin.puesto} />
          <InfoRow label="Departamento" value={admin.departamento} />
          <InfoRow label="Sexo" value={admin.sexo} isLast />
        </AdminHeader>

        <View className="h-6" />
      </ScrollView>

      {/* Menú hamburguesa como componente reutilizable */}
      <OptionsMenuModal
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onLogout={() => {
          console.log("Cerrar sesión");
          // OJO: Conectar el logout real después
        }}
      />
    </View>
    </View>
  );
}
