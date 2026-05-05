import { create } from "zustand"
import { persist } from "zustand/middleware"

type User = {
  id: number
  name: string
  email: string
  createdAt: string
}

type AuthState = {
  token: string | null
  user: User | null
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    { name: "rose-auth" }  // key di localStorage
  )
)
