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
import type { MenuAnchor } from '@/components/ui/types/menu-anchor';

//Este componente representa los estilos del menu
type Props = {
  visible: boolean;
  anchor?: MenuAnchor | null;
  onClose: () => void;
  onLogout?: () => void;
  onQR?: () => void;
  onEditPhoto?: () => void;
  onEdit?: () => void;
  title?: string;
};

//Se renderiza usando un Modal para aparecer sobre toda la pantalla
export function OptionsMenuModal({
  visible,
  anchor = null,
  onClose,
  onQR,
  onLogout,
  onEditPhoto,
  onEdit,
  title = 'OPCIONES',
}: Props) {
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
          style={[styles.menuPanel, { top, left, width: panelWidth }]}
          onLayout={(event) => {
            const nextHeight = event.nativeEvent.layout.height;
            if (nextHeight !== panelHeight) {
              setPanelHeight(nextHeight);
            }
          }}
        >
          <Text style={styles.menuTitle}>{title}</Text>

          <View style={styles.divider} />

          {/*  BOTON QR  */}
          {/*{onQR && (
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                onClose();
                onQR();
              }}
            >
              <Text style={styles.optionText}>Codigo QR</Text>
            </Pressable>
          )} */}

          {/*  EDITAR  */}
          {onEditPhoto && (
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                onClose();
                onEditPhoto();
              }}
            >
              <Text style={styles.optionText}>Editar foto de perfil</Text>
            </Pressable>
          )}

          {onEdit && (
            <Pressable
              style={styles.menuItem}
              onPress={() => {
                onClose();
                onEdit();
              }}
            >
              <Text style={styles.optionText}>Editar Informacion</Text>
            </Pressable>
          )}

          <Pressable
            style={styles.menuItem}
            onPress={() => {
              onClose();
              onLogout?.();
            }}
          >
            <Text style={styles.logoutText}>Cerrar sesion</Text>
          </Pressable>

          <Pressable style={styles.menuItem} onPress={onClose}>
            <Text style={styles.cancelText}>Cancelar</Text>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',

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
    color: '#64748B',
    paddingHorizontal: 8,
    paddingVertical: 6,
    letterSpacing: 1,
  },
  //Separador visual
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
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
    color: '#1E293B',
    fontWeight: '600',
  },

  cancelText: {
    color: '#334155',
    fontWeight: '600',
  },
});
