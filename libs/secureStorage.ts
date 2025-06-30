import * as SecureStore from 'expo-secure-store';

export const secureStorage = {
  getItem: async (key: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(key);
  },

  setItem: async (key: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(key, value, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED,
    });
  },

  removeItem: async (key: string): Promise<void> => {
    await SecureStore.deleteItemAsync(key);
  },

  getAllKeys: async (): Promise<string[]> => {
    return []; // SecureStore does not support listing keys
  },

  clear: async (): Promise<void> => {
    console.warn('SecureStore does not support clearing all keys.');
  },
};