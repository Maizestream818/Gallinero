import type { MenuAnchor } from '@/components/ui/types/menu-anchor';
import { useAuth } from '@/features/auth/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//Este componente representa los estilos del menu
type Props = {
  visible: boolean;
  anchor?: MenuAnchor | null;
  onClose: () => void;
  onLogout?: () => void;
  onQR?: () => void;
  onEdit?: () => void;
  title?: string;
};

//Se renderiza usando un Modal para aparecer sobre toda la pantalla
export function OptionsMenuModal({
  visible,
  anchor = null,
  onClose,
  onQR,
  onEdit,
  title = 'OPCIONES',
}: Props) {
  const router = useRouter();
  const { logout } = useAuth();
  // Tema del sistema para aplicar colores al panel del menú
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const palette = Colors[colorScheme ?? 'light'];

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const insets = useSafeAreaInsets();
  const { width: viewportWidth, height: viewportHeight } =
    useWindowDimensions();
  const [panelHeight, setPanelHeight] = React.useState(260);

  const horizontalMargin = 12;
  const verticalMargin = 8;
  const maxPanelWidth = 240;

  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

  const panelWidth = Math.min(
    maxPanelWidth,
    Math.max(120, viewportWidth - horizontalMargin * 2),
  );

  const hasValidAnchor = !!anchor && anchor.width > 0 && anchor.height > 0;

  const minLeft = horizontalMargin;
  const maxLeft = Math.max(
    minLeft,
    viewportWidth - panelWidth - horizontalMargin,
  );
  const desiredLeft = hasValidAnchor
    ? anchor.x + anchor.width - panelWidth
    : viewportWidth - panelWidth - 12;
  const left = clamp(desiredLeft, minLeft, maxLeft);

  const minTop = insets.top + verticalMargin;
  const maxTop = Math.max(
    minTop,
    viewportHeight - insets.bottom - panelHeight - verticalMargin,
  );
  const desiredTop = hasValidAnchor
    ? anchor.y + anchor.height + 8
    : insets.top + 12;
  const top = clamp(desiredTop, minTop, maxTop);

  // Colores del panel según el tema del sistema
  const panelBg = isDark ? '#1e293b' : '#ffffff';
  const panelBorder = isDark ? '#334155' : '#E2E8F0';
  const titleColor = palette.icon;
  const dividerColor = isDark ? '#334155' : '#E2E8F0';
  const optionColor = palette.text;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade" //Animacion suave de entrada y salida
      onRequestClose={onClose} //Necesario para Android ya que es el "Boton atras"
    >
      <View style={styles.modalRoot}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View
          style={[
            styles.menuPanel,
            { top, left, width: panelWidth, backgroundColor: panelBg, borderColor: panelBorder },
          ]}
          onLayout={(event) => {
            const nextHeight = event.nativeEvent.layout.height;
            if (nextHeight !== panelHeight) {
              setPanelHeight(nextHeight);
            }
          }}
        >
          <Text style={[styles.menuTitle, { color: titleColor }]}>{title}</Text>

          <View style={[styles.divider, { backgroundColor: dividerColor }]} />

          {/*  BOTON QR  */}
          {/*{onQR && (
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                onClose();
                onQR();
              }}
            >
              <Text style={[styles.optionText, { color: optionColor }]}>Codigo QR</Text>
            </Pressable>
          )} */}

          {/*  EDITAR INFORMACION  */}
          {onEdit && (
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                onClose();
                onEdit();
              }}
            >
              <Text style={[styles.optionText, { color: optionColor }]}>Editar Informacion</Text>
            </Pressable>
          )}

          <Pressable
            style={styles.menuItem}
            onPress={() => {
              onClose();
              handleLogout();
            }}
          >
            <Text style={styles.logoutText}>Cerrar sesion</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

//Estilos para el menu
const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.30)',
  },
  //Panel flotante del menu
  menuPanel: {
    position: 'absolute',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,

    // Android
    elevation: 12,

    // iOS
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  //Estilo del titulo del menu
  menuTitle: {
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 6,
    letterSpacing: 1,
  },
  //Separador visual
  divider: {
    height: 1,
    marginVertical: 6,
  },
  menuItem: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 12,
  },
  logoutText: {
    color: '#DC2626',
    fontWeight: '700',
  },
  optionText: {
    fontWeight: '600',
  },
});
