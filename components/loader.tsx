// components/loader.tsx
import { Image } from 'expo-image';
import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

type LoaderProps = {
  title?: string;
  subtitle?: string;
};

// 👇 función normal, SIN export aquí
function Loader({
  title = 'Bienvenido',
  subtitle = 'Cargando aplicación...',
}: LoaderProps) {
  return (
    <ThemedView style={styles.container}>
      <Image source={require('@/assets/images/logo.png')} style={styles.logo} />

      <ThemedText type="title" style={styles.title}>
        {title}
      </ThemedText>

      {subtitle ? (
        <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
      ) : null}

      <ActivityIndicator style={styles.loader} size="large" />
    </ThemedView>
  );
}

// 👇 ÚNICO export del archivo
export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 24,
  },
  title: {
    marginBottom: 6,
  },
  subtitle: {
    opacity: 0.7,
    marginBottom: 16,
  },
  loader: {
    marginTop: 8,
  },
});
