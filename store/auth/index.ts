import { create } from "zustand";
import { LoginRes } from "@/types";

type AuthState = {
  token: LoginRes | null;
  setToken: (token: LoginRes | null) => void;
  previewRole: 'admin' | 'agent' | 'client' | null;
  setPreviewRole: (role: AuthState['previewRole']) => void;
  clearPreviewRole: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
    token: {} as LoginRes,
    setToken: (token: LoginRes | null) => set({ token}),
    setPreviewRole: (role: AuthState['previewRole']) => set({ previewRole: role }),
    clearPreviewRole: () => set({ previewRole: null }),
    previewRole: null,
  }));
