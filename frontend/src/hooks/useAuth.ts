import { useMutation, useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { api } from "@/lib/api"
import { useAuthStore } from "@/stores/useAuthStore"

type User = {
  id: number
  nik: string
  name: string
  email: string
  createdAt: string
}

type LoginPayload = { nik: string; password: string }
type LoginResponse = { token: string; user: User }
type MeResponse = { user: User }

export function useLogin() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: LoginPayload) =>
      api.post<LoginResponse>("/auth/login", data),
    onSuccess: ({ token, user }) => {
      setAuth(token, user)
      navigate("/dashboard")
    },
  })
}

export function useCurrentUser() {
  const token = useAuthStore((s) => s.token)

  return useQuery<User>({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get<MeResponse>("/auth/me")
      return res.user
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  })
}

export function useLogout() {
  const { clearAuth } = useAuthStore()
  const navigate = useNavigate()

  return () => {
    clearAuth()
    navigate("/")
  }
}
