// features/user/screens/admin/UserAdminMainScreen.tsx
import { StatusBar } from 'expo-status-bar';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { AdminHeader } from '@/components/admin/AdminHeader';
import { InfoRow } from '@/components/admin/InfoRow';
import { OptionsMenuModal } from '@/components/ui/OptionsMenuModal';
import type { MenuAnchor } from '@/components/ui/types/menu-anchor';
import { useAuth } from '@/features/auth/AuthContext';

//Pantalla de informacion del administrador
export function UserAdminMainScreen() {
  const router = useRouter();
  const { setRole } = useAuth();
  // Estado para abrir/cerrar menu hamburguesa
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<MenuAnchor | null>(null);
  const tabBarHeight = useBottomTabBarHeight();

  // Informacion simulada del administrador de momento
  // ASEGURAR DE CAMBIAR AL MOMENTO DE CONECTAR EL BACKEND
  const admin = {
    id: 'ADM-001',
    nombre: 'Oswaldo Cruz Garcia',
    correo: 'admin@correo.com',
    puesto: 'Coordinador',
    departamento: 'Difusion y Cultura',
    sexo: 'Masculino',
    foto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300',
  };

  return (
    <View className="items flex-1 bg-slate-900">
      <StatusBar style="light" />

      <View className="flex-1 bg-slate-100">
        <StatusBar style="dark" />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: tabBarHeight + 16 }}
        >
          <AdminHeader
            topTitle="Mi Credencial"
            subtitle="Identificacion Digital Oficial"
            name={admin.nombre}
            roleLabel="ADMINISTRADOR"
            idLabel={`ID: ${admin.id}`}
            photoUri={admin.foto}
            isMenuOpen={menuVisible}
            onOpenMenu={(anchor) => {
              setMenuAnchor(anchor);
              setMenuVisible(true);
            }}
          >
            <InfoRow label="Correo" value={admin.correo} />
            <InfoRow label="Puesto" value={admin.puesto} />
            <InfoRow label="Departamento" value={admin.departamento} />
            <InfoRow label="Sexo" value={admin.sexo} isLast />
          </AdminHeader>

          <View className="h-6" />
        </ScrollView>

        {/* Menu hamburguesa como componente reutilizable */}
        <OptionsMenuModal
          visible={menuVisible}
          anchor={menuAnchor}
          onClose={() => {
            setMenuVisible(false);
            setMenuAnchor(null);
          }}
          onLogout={() => {
            setRole(null);
            router.replace('/login');
          }}
        />
      </View>
    </View>
  );
}
