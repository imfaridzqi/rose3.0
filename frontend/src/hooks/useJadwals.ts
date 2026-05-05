import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

export type JadwalEntry = {
  name: string
  nmTeam: string
  nmShift: string
  kodeShift: string
  jamMasuk: string | null
  jamKeluar: string | null
  ket: string | null
}

export type TodayJadwalResponse = {
  date: string
  total: number
  pagi: JadwalEntry[]
  siang: JadwalEntry[]
  malam: JadwalEntry[]
  list: JadwalEntry[]
}

export function useTodayJadwal() {
  return useQuery<TodayJadwalResponse>({
    queryKey: ["jadwals", "today"],
    queryFn: () => api.get<TodayJadwalResponse>("/jadwals/today"),
    staleTime: 5 * 60 * 1000,
  })
}
