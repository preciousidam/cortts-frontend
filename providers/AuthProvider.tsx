import React, { useEffect, useRef, useState } from 'react';
import Constants from "expo-constants";
import { Platform, View } from 'react-native';
import { useSyncQueriesExternal } from "react-query-external-sync";
import { secureStorage } from '@/libs/secureStorage';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'expo-router';
import { LoginRes } from '@/types';
import { useLoginMutation, useRegisterMutation } from '@/store/auth/mutations';
import api from '@/libs/api';
import { AuthContext } from '@/contexts/AuthContext';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { Button } from '@/components/button';


// AuthProvider wraps the app and provides context
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isFetching, setIsFetching] = useState(true);
  const {replace, push} = useRouter();
  const queryClient = useQueryClient();
  const { setToken, token } = useAuthStore();
  const interceptorRef = useRef<number | null>(null);

  const { mutateLogin, isError, isPending, isSuccess, error } = useLoginMutation<FormData, LoginRes>({
    onSuccess(data, variables, context) {
      setToken(data);
      secureStorage.setItem("auth_token", JSON.stringify(data));
      if (data.role == 'admin') {
        replace('/(app)/(admin)');
      } else if (data.role == 'agent') {
        replace('/(app)/(agent)');
      } else {
        replace('/(app)/(client)');
      }
    },
  });

  const { mutateRegister, isError: isRegError, isPending: isRegPending } = useRegisterMutation<FormData, LoginRes>({
    onSuccess(data, variables, context) {
      
    },
  });

  useEffect(() => {
    // Add response interceptor once
    if (interceptorRef.current === null) {
      const id = api.interceptors.response.use(
        (response) => response,
        async (error) => {
          if (error.response?.status === 401) {
            console.warn('Unauthorized. Logging out...');
            setToken(null);
            await secureStorage.removeItem('auth_token');
            // optionally: redirect to login
            replace('/(auths)/login')
          }
          return Promise.reject(error);
        }
      );
      interceptorRef.current = id;
    }

    // Optional cleanup (not necessary unless you're unmounting)
    return () => {
      if (interceptorRef.current !== null) {
        api.interceptors.response.eject(interceptorRef.current);
        interceptorRef.current = null;
      }
    };
  }, [setToken]);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const str_token = await secureStorage.getItem('auth_token');
        if (str_token) {
          const token = JSON.parse(str_token) as LoginRes;
          setToken(token);
        }
      } catch (err) {
        console.warn('Failed to load auth token:', err);
      } finally {
        setIsFetching(false);
      }
    };

    loadAuth();
  }, [setToken]);


  const hostIP = Constants.expoGoConfig?.debuggerHost?.split(`:`)[0] || Constants.expoConfig?.hostUri?.split(`:`)[0] || 'localhost';

  useSyncQueriesExternal({
    queryClient,
    socketURL: `http://${hostIP}:42831`, // Default port for React Native DevTools
    deviceName: Platform?.OS || "web", // Platform detection
    platform: Platform?.OS || "web", // Use appropriate platform identifier
    deviceId: Platform?.OS || "web", // Use a PERSISTENT identifier (see note below)
    extraDeviceInfo: {
      // Optional additional info about your device
      appVersion: "1.0.0",
      // Add any relevant platform info
    },
    enableLogs: false,
    envVariables: {
      NODE_ENV: process.env.NODE_ENV,
      // Add any private environment variables you want to monitor
      // Public environment variables are automatically loaded
    },
    // Storage monitoring with CRUD operations
    // mmkvStorage: storage, // MMKV storage for ['#storage', 'mmkv', 'key'] queries + monitoring
    asyncStorage: AsyncStorage, // AsyncStorage for ['#storage', 'async', 'key'] queries + monitoring
    secureStorage: SecureStore, // SecureStore for ['#storage', 'secure', 'key'] queries + monitoring
    secureStorageKeys: Platform.OS == 'web' ? [] : [
      // "userToken",
      // "refreshToken",
      // "biometricKey",
      // "deviceId",
      "auth_token"
    ], // SecureStore keys to monitor
  });

  const login = (data: FormData) => {
    mutateLogin(data);
  };

  const register = (data: FormData) => {
    mutateRegister(data);
  };

  const logout = async () => {
    setToken(null);
    await secureStorage.removeItem('auth_token');
    replace('/(auths)/login')
  };

  return (
    <AuthContext.Provider 
      value={{ 
        login, 
        logout,  
        role: token?.role,
        isAuthenticated: !!token?.access_token,
        isError: isError || isRegError,
        isLoading: isPending || isFetching || isRegPending,
        isPending: isPending || isRegPending,
        register
      }}
    >
      <View style={{ flex: 1 }}>
        {children}
        <Button onPress={() => push('/storybook')} iconOnly icon={<Ionicons name="menu" size={24} color="#fff" />} style={{ position: 'absolute', right: 32, bottom: 32 }} />
      </View>
    </AuthContext.Provider>
  );
};
