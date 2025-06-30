import { create } from "zustand";
import { LoginRes } from "../../types";

type AuthState = {
  token: LoginRes | null;
  setToken: (token: LoginRes | null) => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
    token: {} as LoginRes,
    setToken: (token: LoginRes | null) => set({ token}),
  }))
