import React, { ReactNode } from "react";
import { View, Text, SafeAreaView, Pressable, Image } from "react-native";
import { HamburgerIcon } from "./HamburguerIcon";

//Este componente representa la credencial del usuario administrador
//Recibe informacion básica del usuario que se muestra en el layout
type Props = {
  topTitle?: string;
  subtitle?: string;

  name: string;
  roleLabel?: string;
  idLabel?: string;

  photoUri?: string;
  onOpenMenu?: () => void;

  //Se importan los InfoRow desde la pantalla
  children?: ReactNode;
};

export function AdminHeader({
  topTitle = "Mi Credencial",
  subtitle = "Identificación Digital Oficial",
  name,
  roleLabel = "ADMINISTRADOR",
  idLabel = "ID: ADM-0001",
  photoUri,
  onOpenMenu,
  children,
}: Props) {
  return (
    //SafeAreaView evita que el contenido se empalme con la barra de estado
    <SafeAreaView className="bg-slate-120">
      {/* Header blanco superior */}
      <View className="px-4 pt-5 pb-3"></View>
      <View className="bg-white px-4 pt-3 pb-3">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-base font-bold text-slate-900">{topTitle}</Text>
            <Text className="text-xs text-slate-500">{subtitle}</Text>
          </View>

          {/* Botón hamburguesa  */}
          <Pressable
            onPress={onOpenMenu}
            className="h-10 w-10 items-center justify-center rounded-full bg-white"
            style={{
              elevation: 6,
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 3 },
            }}
          >
           <HamburgerIcon color="#111827" size={18} lineHeight={2.2} gap={3} />
          </Pressable>
        </View>
      </View>

      {/* Tarjeta credencial */}
      <View className="px-4 pt-4">
        <View
          className="rounded-2xl bg-white overflow-hidden"
          style={{
            elevation: 6,
            shadowColor: "#000",
            shadowOpacity: 0.12,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          {/* Banda azul */}
          <View className="bg-blue-600 px-4 py-4 items-center">
            <Text className="text-white text-xs tracking-widest font-bold">
              {roleLabel}
            </Text>
          </View>

          <View className="px-4 pb-4">
            {/* Foto + nombre */}
            <View className="flex-row gap-3">
              <View className="-mt-6">
                <View className="h-20 w-20 rounded-xl bg-white p-1">
                  <View className="h-full w-full rounded-lg bg-slate-200 overflow-hidden items-center justify-center">
                    {photoUri ? (
                      <Image source={{ uri: photoUri }} className="h-full w-full" />
                    ) : (
                      <Text className="text-2xl"> </Text>
                    )}
                  </View>
                </View>
              </View>

              <View className="flex-1 pt-2">
                <Text className="text-base font-bold text-slate-900">{name}</Text>
                <Text className="mt-1 text-xs text-slate-500">{idLabel}</Text>
              </View>
            </View>

            {/*Caja  donde van los InfoRow */}
            <View className="mt-4 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden">
              {children}
            </View>

            {/* Verificación */}
            <View className="mt-3 items-center">
              <Text className="text-[11px] text-slate-400">
                 Documento digital verificado
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
