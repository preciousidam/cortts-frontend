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
import { ForgotPasswordReq, LoginRes, RegisterReq, ResetPasswordReq, VerifyReq } from '@/types';
import { useForgotPasswordMutation, useLoginMutation, useRegisterMutation, useResetPasswordMutation, useVerifyMutation } from '@/store/auth/mutations';
import api from '@/libs/api';
import { AuthContext } from '@/contexts/AuthContext';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { Button } from '@/components/button';
import { AxiosError } from 'axios';
import Toast from 'react-native-toast-message';


// AuthProvider wraps the app and provides context
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isFetching, setIsFetching] = useState(true);
  const {replace, push, setParams} = useRouter();
  const queryClient = useQueryClient();
  const { setToken, token } = useAuthStore();
  const interceptorRef = useRef<number | null>(null);
  const [form, setForm] = useState<FormData>();

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
    onError(error, variables, context) {
      console.log(error, 'error');
      // alert("Login failed. Please check your credentials and try again.");
      Toast.show({text1: "Error", text2: "Login failed. Please check your credentials and try again.", type: 'error' });
      if (error instanceof AxiosError && error?.status === 403) {
        push({pathname: '/(auths)/verify', params: { email: variables.get('username') as string }});
        return;
      }
    }
  });

  const { mutateRegister, isError: isRegError, isPending: isRegPending } = useRegisterMutation<RegisterReq, LoginRes>({
    onSuccess(data, variables, context) {
      push({pathname: '/(auths)/verify', params: { email: variables?.email }});
    },
    onError(error, variables, context) {
      const err = error as AxiosError;
      console.log(err?.status, 'error');
      if (err?.status === 409) {
        // alert("User already exists. Please login.");
        Toast.show({text1: "User already exists", text2: "Please login to continue.", type: 'error' });
        replace({ pathname: '/(auths)/login', params: { email: variables?.email } });
        return;
      } else {
        // alert("Registration failed. Please try again.");
        Toast.show({text1: "Error", text2: "Registration failed. Please try again.", type: 'error' });
      }
    }
  });

  const { mutateVerify, isError: isVerError, isPending: isVerPending } = useVerifyMutation<VerifyReq, LoginRes>({
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
    onError(error, variables, context) {
      const err = error as AxiosError;
      console.log(err?.status, 'error');
      Toast.show({text1: "Error", text2: "Registration failed. Please try again.", type: 'error' });
      if (err?.status === 403) {
        // alert("Verification failed. Please check your email and try again.");
        replace({pathname: '/(auths)/verify', params: { email: variables?.email }});
        return;
      }
    }
  });

  const { mutateForgotPassword, data, variables } = useForgotPasswordMutation<ForgotPasswordReq, void>({
    onSuccess(data, variables, context) {
      Toast.show({text1: "Success", text2: "Password reset link sent to your email.", type: 'success' });
      replace({pathname: '/(auths)/forgot-password', params: { step: 'verification', email: variables?.email }});
    },
    onError(error, variables, context) {
      const err = error as AxiosError;
      console.log(err?.status, 'error');
      if (err?.status === 404) {
        // alert("Email not found. Please register.");
        Toast.show({text1: "Email not found", text2: "Please register to continue.", type: 'error' });
        replace({ pathname: '/(auths)/register', params: { email: variables?.email } });
        return;
      } else {
        Toast.show({text1: "Error", text2: "Failed to send password reset link. Please try again.", type: 'error' });
      }
    }
  });

  const { mutateResetPassword } = useResetPasswordMutation<ResetPasswordReq, void>({
    onSuccess(data, variables, context) {
      // alert("Password reset successful. You can now login.");
      Toast.show({text1: "Success", text2: "Password reset successful. You can now login.", type: 'success' });
      setParams({ step: 'done' });
    },
    onError(error, variables, context) {
      const err = error as AxiosError;
      console.log(err?.status, 'error');
      alert("Failed to reset password. Please try again.");
    }
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

  const register = (data: RegisterReq) => {
    mutateRegister(data);
  };

  const logout = async () => {
    setToken(null);
    await secureStorage.removeItem('auth_token');
    replace('/(auths)/login')
  };

  const verify = (data: VerifyReq) => {
    mutateVerify(data);
  };

  const forgotPassword = (data: ForgotPasswordReq) => {
    mutateForgotPassword(data);
  };

  const resetPassword = (data: ResetPasswordReq) => {
    mutateResetPassword(data);
  };


  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        verify,
        forgotPassword,
        resetPassword,
        role: token?.role,
        isAuthenticated: !!token?.access_token,
        isError: isError || isRegError || isVerError,
        isLoading: isPending || isFetching || isRegPending || isVerPending,
        isPending: isPending || isRegPending || isVerPending,
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
