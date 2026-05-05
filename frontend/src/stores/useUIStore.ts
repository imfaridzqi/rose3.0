import { create } from "zustand"

type UIState = {
  theme: "light" | "dark"
  sidebarOpen: boolean
  toggleTheme: () => void
  toggleSidebar: () => void
}

export const useUIStore = create<UIState>((set) => ({
  theme: "light",
  sidebarOpen: false,
  toggleTheme: () =>
    set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}))
