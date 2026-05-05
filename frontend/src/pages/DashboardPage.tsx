import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Sun, Cloud, Moon, X, ChevronLeft, ChevronRight } from "lucide-react"
import { DashboardLayout } from "@/layouts/DashboardLayout"
import { useUIStore } from "@/stores/useUIStore"
import { useTodayJadwal, type JadwalEntry } from "@/hooks/useJadwals"
import { cn } from "@/lib/utils"

type CardKey = "total" | "pagi" | "siang" | "malam"

const CARDS: { key: CardKey; label: string; icon: React.ElementType; iconCls: string; borderCls: string }[] = [
  { key: "total", label: "Total Masuk",  icon: Users, iconCls: "bg-violet-500/15 text-violet-400", borderCls: "hover:border-violet-400/40" },
  { key: "pagi",  label: "Shift Pagi",   icon: Sun,   iconCls: "bg-amber-500/15  text-amber-400",  borderCls: "hover:border-amber-400/40"  },
  { key: "siang", label: "Shift Siang",  icon: Cloud, iconCls: "bg-sky-500/15    text-sky-400",    borderCls: "hover:border-sky-400/40"    },
  { key: "malam", label: "Shift Malam",  icon: Moon,  iconCls: "bg-indigo-500/15 text-indigo-400", borderCls: "hover:border-indigo-400/40" },
]

const PAGE_SIZE = 10

function formatTime(t: string | null) {
  if (!t) return "-"
  return t.slice(0, 5) // "07:00:00" → "07:00"
}

function ketColor(ket: string | null, isDark: boolean) {
  if (!ket) return isDark ? "text-white/25" : "text-gray-300"
  if (ket.startsWith("Lebih cepat")) return "text-emerald-400"
  if (ket.startsWith("Terlambat"))   return "text-red-400"
  if (ket === "Tepat waktu")         return "text-sky-400"
  return isDark ? "text-white/50" : "text-gray-500"
}

function shiftBadge(kode: string) {
  if (kode.startsWith("A")) return "bg-amber-500/15 text-amber-400"
  if (kode.startsWith("B")) return "bg-sky-500/15 text-sky-400"
  if (kode.startsWith("C")) return "bg-indigo-500/15 text-indigo-400"
  return "bg-gray-500/15 text-gray-400"
}

export function DashboardPage() {
  const { theme } = useUIStore()
  const isDark = theme === "dark"
  const [selectedCard, setSelectedCard] = useState<CardKey | null>(null)
  const [page, setPage] = useState(0)

  const { data: jadwal, isLoading } = useTodayJadwal()

  const list = jadwal?.list ?? []
  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE))
  const pageData = list.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const modalData: JadwalEntry[] =
    !selectedCard ? [] :
    selectedCard === "total"
      ? [...(jadwal?.pagi ?? []), ...(jadwal?.siang ?? []), ...(jadwal?.malam ?? [])]
      : (jadwal?.[selectedCard] ?? [])

  const modalTitle: Record<CardKey, string> = {
    total: "Total Masuk", pagi: "Shift Pagi", siang: "Shift Siang", malam: "Shift Malam",
  }

  const glass = isDark
    ? "bg-white/[0.04] border-white/[0.08]"
    : "bg-white/60 border-black/[0.06]"

  const divider = isDark ? "border-white/[0.06]" : "border-black/[0.05]"

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">

        {/* page title */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={cn("text-lg sm:text-xl font-semibold", isDark ? "text-white" : "text-gray-900")}>
            Dashboard
          </h1>
          <p className={cn("text-xs sm:text-sm mt-0.5", isDark ? "text-white/40" : "text-gray-400")}>
            {jadwal?.date
              ? new Date(jadwal.date + "T00:00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
              : "Memuat data…"}
          </p>
        </motion.div>

        {/* ── JADWAL CARDS ───────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          {CARDS.map((card, i) => {
            const Icon = card.icon
            const count = jadwal
              ? card.key === "total" ? jadwal.total : jadwal[card.key].length
              : null
            return (
              <motion.button
                key={card.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => setSelectedCard(card.key)}
                className={cn(
                  "rounded-2xl border p-4 sm:p-5 backdrop-blur-md text-left transition-all duration-150 cursor-pointer",
                  glass, card.borderCls
                )}
              >
                <div className="mb-3 sm:mb-4">
                  <div className={cn("p-2 rounded-xl w-fit", card.iconCls)}>
                    <Icon size={16} />
                  </div>
                </div>
                <p className={cn("text-xl sm:text-2xl font-bold tracking-tight", isDark ? "text-white" : "text-gray-900")}>
                  {isLoading
                    ? <span className="inline-block w-8 h-7 rounded-md bg-current opacity-10 animate-pulse" />
                    : (count ?? 0)
                  }
                </p>
                <p className={cn("text-xs mt-0.5", isDark ? "text-white/40" : "text-gray-400")}>{card.label}</p>
                <p className={cn("text-[10px] mt-1.5", isDark ? "text-white/20" : "text-gray-300")}>Klik untuk detail</p>
              </motion.button>
            )
          })}
        </div>

        {/* ── JADWAL TABLE ───────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className={cn("rounded-2xl border backdrop-blur-md overflow-hidden", glass)}
        >
          {/* header */}
          <div className={cn("flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b", divider)}>
            <div>
              <h2 className={cn("text-sm font-semibold", isDark ? "text-white" : "text-gray-900")}>
                Jadwal Agent Hari Ini
              </h2>
              <p className={cn("text-xs mt-0.5", isDark ? "text-white/40" : "text-gray-400")}>
                {isLoading ? "Memuat…" : `${list.length} agent terjadwal`}
              </p>
            </div>
          </div>

          {/* table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px]">
              <thead>
                <tr className={cn("border-b", divider)}>
                  {["Nama", "Team", "Shift", "Jam Masuk", "Keterangan", "Jam Keluar"].map(h => (
                    <th key={h} className={cn("text-left px-4 sm:px-5 py-3 text-xs font-medium", isDark ? "text-white/35" : "text-gray-400")}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className={cn("border-b last:border-0", divider)}>
                        {Array.from({ length: 6 }).map((_, j) => (
                          <td key={j} className="px-5 py-3.5">
                            <div className={cn("h-3 rounded-full animate-pulse", isDark ? "bg-white/8" : "bg-black/6")}
                              style={{ width: `${[120, 160, 60, 44, 180, 44][j]}px` }} />
                          </td>
                        ))}
                      </tr>
                    ))
                  : pageData.map((row, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className={cn("border-b last:border-0 transition-colors", isDark
                          ? "border-white/[0.04] hover:bg-white/[0.03]"
                          : "border-black/[0.04] hover:bg-black/[0.02]"
                        )}
                      >
                        {/* Nama */}
                        <td className="px-4 sm:px-5 py-3 sm:py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                              {row.name[0]}
                            </div>
                            <span className={cn("text-sm font-medium whitespace-nowrap", isDark ? "text-white/85" : "text-gray-800")}>
                              {row.name}
                            </span>
                          </div>
                        </td>
                        {/* Team */}
                        <td className="px-4 sm:px-5 py-3 sm:py-3.5">
                          <span className={cn("text-xs truncate max-w-[160px] block", isDark ? "text-white/50" : "text-gray-500")}>
                            {row.nmTeam}
                          </span>
                        </td>
                        {/* Shift */}
                        <td className="px-4 sm:px-5 py-3 sm:py-3.5">
                          <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", shiftBadge(row.kodeShift))}>
                            {row.kodeShift}
                          </span>
                        </td>
                        {/* Jam Masuk */}
                        <td className="px-4 sm:px-5 py-3 sm:py-3.5">
                          <span className={cn("text-sm font-mono", isDark ? "text-white/70" : "text-gray-700")}>
                            {formatTime(row.jamMasuk)}
                          </span>
                        </td>
                        {/* Keterangan */}
                        <td className="px-4 sm:px-5 py-3 sm:py-3.5">
                          <span className={cn("text-xs", ketColor(row.ket, isDark))}>
                            {row.ket ?? "Belum presensi"}
                          </span>
                        </td>
                        {/* Jam Keluar */}
                        <td className="px-4 sm:px-5 py-3 sm:py-3.5">
                          <span className={cn("text-sm font-mono", isDark ? "text-white/70" : "text-gray-700")}>
                            {formatTime(row.jamKeluar)}
                          </span>
                        </td>
                      </motion.tr>
                    ))
                }
              </tbody>
            </table>
          </div>

          {/* pagination */}
          <div className={cn("flex items-center justify-between px-4 sm:px-5 py-3 border-t", divider)}>
            <span className={cn("text-xs", isDark ? "text-white/30" : "text-gray-400")}>
              Halaman {page + 1} dari {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className={cn("p-1.5 rounded-lg transition-colors disabled:opacity-30",
                  isDark ? "text-white/50 hover:text-white hover:bg-white/8" : "text-gray-500 hover:text-gray-900 hover:bg-black/5")}
              >
                <ChevronLeft size={15} />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className={cn("p-1.5 rounded-lg transition-colors disabled:opacity-30",
                  isDark ? "text-white/50 hover:text-white hover:bg-white/8" : "text-gray-500 hover:text-gray-900 hover:bg-black/5")}
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </motion.div>

      </div>

      {/* ── MODAL ──────────────────────────────── */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className={cn("w-full max-w-md rounded-2xl border shadow-2xl backdrop-blur-2xl overflow-hidden", glass)}
            >
              {/* modal header */}
              <div className={cn("flex items-center justify-between px-5 py-4 border-b", divider)}>
                <div>
                  <h3 className={cn("text-sm font-semibold", isDark ? "text-white" : "text-gray-900")}>
                    {modalTitle[selectedCard]}
                  </h3>
                  <p className={cn("text-xs mt-0.5", isDark ? "text-white/35" : "text-gray-400")}>
                    {jadwal?.date
                      ? new Date(jadwal.date + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
                      : "—"}
                    {" · "}{modalData.length} orang
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCard(null)}
                  className={cn("p-1.5 rounded-lg transition-colors", isDark ? "text-white/40 hover:text-white hover:bg-white/8" : "text-gray-400 hover:text-gray-700 hover:bg-black/5")}
                >
                  <X size={16} />
                </button>
              </div>
              {/* modal body */}
              <div className="max-h-80 overflow-y-auto">
                {modalData.length === 0 ? (
                  <p className={cn("text-center text-sm py-10", isDark ? "text-white/25" : "text-gray-400")}>
                    Tidak ada jadwal untuk hari ini
                  </p>
                ) : (
                  <ul className={cn("divide-y", isDark ? "divide-white/[0.05]" : "divide-black/[0.05]")}>
                    {modalData.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.025 }}
                        className="flex items-center justify-between px-5 py-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                            {item.name[0]}
                          </div>
                          <div className="min-w-0">
                            <p className={cn("text-sm font-medium truncate", isDark ? "text-white/90" : "text-gray-800")}>{item.name}</p>
                            <p className={cn("text-[11px] truncate", isDark ? "text-white/35" : "text-gray-400")}>{item.nmTeam}</p>
                          </div>
                        </div>
                        <span className={cn("ml-3 shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full", shiftBadge(item.kodeShift))}>
                          {item.kodeShift}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
