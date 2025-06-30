import AsyncStorage from '@react-native-async-storage/async-storage';

export const secureStorage = {
  getItem: async (key: string): Promise<string | null> => {
    return await AsyncStorage.getItem(key);
  },

  setItem: async (key: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(key, value);
  },

  removeItem: async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key);
  },

  getAllKeys: async (): Promise< readonly string[]> => {
    return await AsyncStorage.getAllKeys();
  },

  clear: async (): Promise<void> => {
    await AsyncStorage.clear();
  },
};