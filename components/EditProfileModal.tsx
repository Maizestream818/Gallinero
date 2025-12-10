import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Modal, Pressable, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

type Props = {
  visible: boolean;
  onClose: () => void;
  profile: {
    displayName: string;
    email: string;
    avatar: string | null;
  };
  onSave: (data: any) => void;
};

export function EditProfileModal({ visible, onClose, profile, onSave }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    setName(profile.displayName);
    setEmail(profile.email);
    setAvatar(profile.avatar);
  }, [profile, visible]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Se requiere permiso a galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const save = () => {
    if (!name.trim()) {
      Alert.alert('El nombre es obligatorio');
      return;
    }

    onSave({
      displayName: name.trim(),
      email: email.trim(),
      avatar,
    });

    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Editar perfil</Text>

          <Pressable onPress={pickImage}>
            <Image
              source={avatar ? { uri: avatar } : require('@/assets/avatar-placeholder.png')}
              style={styles.avatar}
            />
            <Text style={styles.small}>Cambiar foto</Text>
          </Pressable>

          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Correo"
            value={email}
            keyboardType="email-address"
            onChangeText={setEmail}
          />

          <View style={styles.row}>
            <Pressable onPress={onClose} style={styles.cancelBtn}>
              <Text>Cancelar</Text>
            </Pressable>

            <Pressable onPress={save} style={styles.saveBtn}>
              <Text style={{ color: '#fff' }}>Guardar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: '#0008', justifyContent: 'center' },
  card: { backgroundColor: '#fff', margin: 20, borderRadius: 12, padding: 20 },
  title: { fontSize: 20, fontWeight: '600', textAlign: 'center', marginBottom: 12 },
  avatar: { width: 96, height: 96, borderRadius: 48, alignSelf: 'center' },
  small: { textAlign: 'center', marginVertical: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelBtn: { padding: 12 },
  saveBtn: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
});
