import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"

type User = {
  id: number
  name: string
  email: string
  createdAt: string
}

type NewUser = Pick<User, "name" | "email">

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => api.get("/users"),
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: NewUser) => api.post<User>("/users", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/users/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  })
}
