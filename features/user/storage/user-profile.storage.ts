import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

import type { UserProfile } from '@/features/user/types/user-profile';

const STORAGE_KEY_PREFIX = '@gallinero/user-profile/v1';

function getStorageKey(userId: string) {
  return `${STORAGE_KEY_PREFIX}/${userId}`;
}

function getProfilePhotosDir(): string | null {
  if (!FileSystem.documentDirectory) {
    return null;
  }

  return `${FileSystem.documentDirectory}profile-photos`;
}

async function deletePreviousProfilePhotos(
  photosDir: string,
  userId: string,
): Promise<void> {
  try {
    const entries = await FileSystem.readDirectoryAsync(photosDir);
    const userPhotoFiles = entries.filter(
      (entry) => entry.startsWith(`${userId}-`) || entry === `${userId}.jpg`,
    );

    await Promise.all(
      userPhotoFiles.map((entry) =>
        FileSystem.deleteAsync(`${photosDir}/${entry}`, { idempotent: true }),
      ),
    );
  } catch {
    // Ignore cleanup failures; a new photo can still be saved.
  }
}

export async function validateStoredPhotoUri(uri: string): Promise<boolean> {
  if (!uri) {
    return false;
  }

  if (!uri.startsWith('file://')) {
    return true;
  }

  try {
    const info = await FileSystem.getInfoAsync(uri);
    return info.exists && !info.isDirectory;
  } catch {
    return false;
  }
}

export async function saveProfilePhotoToAppStorage(
  tempUri: string,
  userId: string,
): Promise<string> {
  if (!tempUri) {
    throw new Error('No photo URI provided');
  }

  const photosDir = getProfilePhotosDir();
  if (!photosDir) {
    // Fallback for unsupported environments.
    return tempUri;
  }

  await FileSystem.makeDirectoryAsync(photosDir, { intermediates: true });
  await deletePreviousProfilePhotos(photosDir, userId);

  const destinationUri = `${photosDir}/${userId}-${Date.now()}.jpg`;

  await FileSystem.copyAsync({
    from: tempUri,
    to: destinationUri,
  });

  return destinationUri;
}

export async function loadUserProfile(
  userId: string,
  fallback: UserProfile,
): Promise<UserProfile> {
  try {
    const raw = await AsyncStorage.getItem(getStorageKey(userId));
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    const merged: UserProfile = {
      ...fallback,
      ...parsed,
    };

    const isPhotoValid = await validateStoredPhotoUri(merged.foto);
    if (!isPhotoValid) {
      merged.foto = fallback.foto;
    }

    return merged;
  } catch {
    return fallback;
  }
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(
    getStorageKey(profile.id),
    JSON.stringify(profile),
  );
}
