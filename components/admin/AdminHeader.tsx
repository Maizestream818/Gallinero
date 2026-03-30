import React, { ReactNode, useRef } from 'react';
import { Image, Pressable, SafeAreaView, Text, View } from 'react-native';
import { HamburgerIcon } from './HamburguerIcon';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { MenuAnchor } from '@/components/ui/types/menu-anchor';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

//Este componente representa la credencial del usuario administrador
//Recibe informacion basica del usuario que se muestra en el layout
type Props = {
  topTitle?: string;
  subtitle?: string;

  name: string;
  roleLabel?: string;
  idLabel?: string;

  photoUri?: string;
  onOpenMenu?: (anchor: MenuAnchor) => void;
  isMenuOpen?: boolean;
  // Callback opcional para editar la foto — muestra el lápiz si se provee
  onEditPhoto?: () => void;

  //Se importan los InfoRow desde la pantalla
  children?: ReactNode;
};

export function AdminHeader({
  topTitle = 'Mi Credencial',
  subtitle = 'Identificacion Digital Oficial',
  name,
  roleLabel = 'ADMINISTRADOR',
  idLabel = 'ID: ADM-0001',
  photoUri,
  onOpenMenu,
  isMenuOpen = false,
  onEditPhoto,
  children,
}: Props) {
  const menuButtonRef = useRef<View>(null);
  // Detecta el tema del sistema (dark/light) para aplicar colores correctamente
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const palette = Colors[colorScheme ?? 'light'];

  const handleOpenMenu = () => {
    if (!onOpenMenu) {
      return;
    }

    menuButtonRef.current?.measureInWindow((x, y, width, height) => {
      onOpenMenu({ x, y, width, height });
    });
  };

  // Se usa un azul de acento fijo (#2563eb) para la banda en light.
  // En dark mode la banda usa el fondo secundario oscuro para no romper la paleta.
  const ACCENT = '#2563eb';
  const colors = {
    safeArea: palette.background,
    headerBg: isDark ? '#1e293b' : '#ffffff',
    headerTitle: isDark ? '#f1f5f9' : '#0f172a',
    headerSubtitle: isDark ? '#94a3b8' : '#64748b',
    menuBtnBg: isDark ? '#334155' : '#ffffff',
    menuBtnIcon: palette.icon,
    cardBg: isDark ? '#1e293b' : '#ffffff',
    cardBorder: isDark ? '#334155' : 'transparent',
    photoBg: isDark ? '#334155' : '#e2e8f0',
    photoRing: isDark ? '#1e293b' : '#ffffff',
    userName: palette.text,
    userId: palette.icon,
    infoBoxBg: isDark ? '#0f172a' : '#f8fafc',
    infoBoxBorder: isDark ? '#334155' : '#e2e8f0',
    verifyText: isDark ? '#475569' : '#94a3b8',
    // Banda del rol: azul en light, fondo oscuro secundario en dark
    roleBandBg: isDark ? '#0f172a' : ACCENT,
    roleBandText: isDark ? '#94a3b8' : '#ffffff',
    // Botón lápiz: azul en light, fondo secundario en dark con ícono del tema
    pencilBg: isDark ? '#334155' : ACCENT,
    pencilIcon: isDark ? palette.text : '#ffffff',
    pencilBorder: palette.background,
  };

  return (
    //SafeAreaView evita que el contenido se empalme con la barra de estado
    <SafeAreaView style={{ backgroundColor: colors.safeArea }}>
      {/* Header superior — barra con título "Mi Credencial" */}
      <View style={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 12 }} />
      <View style={{ backgroundColor: colors.headerBg, paddingHorizontal: 16, paddingVertical: 12 }}>
        <View className="flex-row items-center justify-between">
          <View>
            <Text style={{ color: colors.headerTitle, fontSize: 15, fontWeight: 'bold' }}>
              {topTitle}
            </Text>
            <Text style={{ color: colors.headerSubtitle, fontSize: 12 }}>{subtitle}</Text>
          </View>

          {/* Boton hamburguesa  */}
          <View ref={menuButtonRef} collapsable={false}>
            <Pressable
              onPress={handleOpenMenu}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={{
                height: 40,
                width: 40,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
                backgroundColor: colors.menuBtnBg,
                elevation: 6,
                shadowColor: '#000',
                shadowOpacity: isDark ? 0.4 : 0.15,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 3 },
              }}
            >
              <HamburgerIcon
                color={colors.menuBtnIcon}
                size={18}
                lineHeight={2.2}
                gap={3}
                open={isMenuOpen}
              />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Tarjeta credencial */}
      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <View
          style={{
            overflow: 'hidden',
            borderRadius: 16,
            backgroundColor: colors.cardBg,
            borderWidth: isDark ? 1 : 0,
            borderColor: colors.cardBorder,
            elevation: 6,
            shadowColor: '#000',
            shadowOpacity: isDark ? 0.4 : 0.12,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          {/* Banda de color — azul de acento siempre legible en dark y light */}
          <View style={{ alignItems: 'center', backgroundColor: colors.roleBandBg, paddingHorizontal: 16, paddingVertical: 16 }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', letterSpacing: 2, color: colors.roleBandText }}>
              {roleLabel}
            </Text>
          </View>

          <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
            {/* Foto + nombre + botón lápiz */}
            <View className="flex-row gap-3">
              {/* Foto con botón lápiz al estilo Facebook */}
              <View style={{ marginTop: -24, overflow: 'visible' }}>
                <View
                  style={{
                    height: 80,
                    width: 80,
                    borderRadius: 40,
                    backgroundColor: colors.photoRing,
                    padding: 4,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      borderRadius: 40,
                      backgroundColor: colors.photoBg,
                    }}
                  >
                    {photoUri ? (
                      <Image
                        source={{ uri: photoUri }}
                        className="h-full w-full"
                      />
                    ) : (
                      <Text className="text-2xl"> </Text>
                    )}
                  </View>
                </View>

                {/* Botón lápiz — solo se muestra si se provee onEditPhoto */}
                {onEditPhoto && (
                  <Pressable
                    onPress={onEditPhoto}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: 26,
                      height: 26,
                      borderRadius: 13,
                      backgroundColor: colors.pencilBg,
                      borderWidth: 2,
                      borderColor: colors.pencilBorder,
                      alignItems: 'center',
                      justifyContent: 'center',
                      elevation: 4,
                      shadowColor: '#000',
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      shadowOffset: { width: 0, height: 2 },
                    }}
                  >
                    <IconSymbol name="pencil" size={13} color={colors.pencilIcon} />
                  </Pressable>
                )}
              </View>

              <View className="flex-1 pt-2">
                <Text style={{ color: colors.userName, fontSize: 15, fontWeight: 'bold' }}>
                  {name}
                </Text>
                <Text style={{ color: colors.userId, fontSize: 12, marginTop: 4 }}>{idLabel}</Text>
              </View>
            </View>

            {/*Caja  donde van los InfoRow */}
            <View
              style={{
                marginTop: 16,
                overflow: 'hidden',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.infoBoxBorder,
                backgroundColor: colors.infoBoxBg,
              }}
            >
              {children}
            </View>

            {/* Verificacion */}
            <View className="mt-3 items-center">
              <Text style={{ color: colors.verifyText, fontSize: 11 }}>
                Documento digital verificado
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
