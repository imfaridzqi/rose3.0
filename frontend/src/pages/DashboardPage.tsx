import { useMemo, useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Sun, Cloud, Moon, X, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { DashboardLayout } from "@/layouts/DashboardLayout"
import { useUIStore } from "@/stores/useUIStore"
import { useTodayJadwal, type JadwalEntry } from "@/hooks/useJadwals"
import { cn } from "@/lib/utils"

// ── mock data ─────────────────────────────────────────────────────────

type User = {
  id: number
  name: string
  email: string
  role: "Admin" | "Editor" | "Viewer"
  status: "Active" | "Inactive"
  joined: string
}

const MOCK_USERS: User[] = [
  { id: 1,  name: "Milda Pratika",   email: "milda@rose.io",    role: "Admin",  status: "Active",   joined: "2025-01-12" },
  { id: 2,  name: "Faridz Qi",       email: "faridz@rose.io",   role: "Admin",  status: "Active",   joined: "2025-01-15" },
  { id: 3,  name: "Rina Sari",       email: "rina@example.com", role: "Editor", status: "Active",   joined: "2025-02-03" },
  { id: 4,  name: "Budi Santoso",    email: "budi@example.com", role: "Viewer", status: "Inactive", joined: "2025-02-18" },
  { id: 5,  name: "Dewi Lestari",    email: "dewi@example.com", role: "Editor", status: "Active",   joined: "2025-03-07" },
  { id: 6,  name: "Andi Kurniawan",  email: "andi@example.com", role: "Viewer", status: "Active",   joined: "2025-03-21" },
  { id: 7,  name: "Siti Nuraini",    email: "siti@example.com", role: "Editor", status: "Active",   joined: "2025-04-02" },
  { id: 8,  name: "Reza Pratama",    email: "reza@example.com", role: "Viewer", status: "Inactive", joined: "2025-04-15" },
  { id: 9,  name: "Lia Amelia",      email: "lia@example.com",  role: "Editor", status: "Active",   joined: "2025-04-28" },
  { id: 10, name: "Hendra Wijaya",   email: "hendra@example.com",role: "Viewer",status: "Active",   joined: "2025-05-01" },
]

type CardKey = "total" | "pagi" | "siang" | "malam"

const CARDS: { key: CardKey; label: string; icon: React.ElementType; iconCls: string; borderCls: string }[] = [
  { key: "total", label: "Total Masuk",  icon: Users, iconCls: "bg-violet-500/15 text-violet-400", borderCls: "hover:border-violet-400/40" },
  { key: "pagi",  label: "Shift Pagi",   icon: Sun,   iconCls: "bg-amber-500/15  text-amber-400",  borderCls: "hover:border-amber-400/40"  },
  { key: "siang", label: "Shift Siang",  icon: Cloud, iconCls: "bg-sky-500/15    text-sky-400",    borderCls: "hover:border-sky-400/40"    },
  { key: "malam", label: "Shift Malam",  icon: Moon,  iconCls: "bg-indigo-500/15 text-indigo-400", borderCls: "hover:border-indigo-400/40" },
]

const roleColor: Record<User["role"], string> = {
  Admin:  "bg-violet-500/15 text-violet-400",
  Editor: "bg-sky-500/15 text-sky-400",
  Viewer: "bg-gray-500/15 text-gray-400",
}

// ── component ─────────────────────────────────────────────────────────

export function DashboardPage() {
  const { theme } = useUIStore()
  const isDark = theme === "dark"
  const [sorting, setSorting] = useState<SortingState>([])
  const [selectedCard, setSelectedCard] = useState<CardKey | null>(null)

  const { data: jadwal, isLoading: jadwalLoading } = useTodayJadwal()

  const modalData: JadwalEntry[] = selectedCard
    ? selectedCard === "total"
      ? [...(jadwal?.pagi ?? []), ...(jadwal?.siang ?? []), ...(jadwal?.malam ?? [])]
      : (jadwal?.[selectedCard] ?? [])
    : []

  const modalTitle: Record<CardKey, string> = {
    total: "Total Masuk",
    pagi:  "Shift Pagi",
    siang: "Shift Siang",
    malam: "Shift Malam",
  }

  const glass = isDark
    ? "bg-white/[0.04] border-white/[0.08]"
    : "bg-white/60 border-black/[0.06]"

  const columns = useMemo<ColumnDef<User>[]>(() => [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
            {row.original.name[0]}
          </div>
          <div>
            <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-gray-900")}>{row.original.name}</p>
            <p className={cn("text-xs", isDark ? "text-white/40" : "text-gray-400")}>{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ getValue }) => (
        <span className={cn("px-2 py-1 rounded-md text-xs font-medium", roleColor[getValue() as User["role"]])}>
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const active = getValue() === "Active"
        return (
          <div className="flex items-center gap-1.5">
            <span className={cn("w-1.5 h-1.5 rounded-full", active ? "bg-emerald-400" : "bg-gray-400")} />
            <span className={cn("text-xs", active
              ? isDark ? "text-emerald-400" : "text-emerald-600"
              : isDark ? "text-white/40" : "text-gray-400"
            )}>
              {getValue() as string}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "joined",
      header: "Joined",
      cell: ({ getValue }) => (
        <span className={cn("text-xs", isDark ? "text-white/40" : "text-gray-400")}>
          {new Date(getValue() as string).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
        </span>
      ),
    },
  ], [isDark])

  const table = useReactTable({
    data: MOCK_USERS,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 6 } },
  })

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* page title */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className={cn("text-lg sm:text-xl font-semibold", isDark ? "text-white" : "text-gray-900")}>
            Dashboard
          </h1>
          <p className={cn("text-xs sm:text-sm mt-0.5", isDark ? "text-white/40" : "text-gray-400")}>
            Welcome back — here's what's happening today.
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
                  {jadwalLoading ? (
                    <span className="inline-block w-8 h-7 rounded-md bg-current opacity-10 animate-pulse" />
                  ) : (
                    count ?? 0
                  )}
                </p>
                <p className={cn("text-xs mt-0.5", isDark ? "text-white/40" : "text-gray-400")}>
                  {card.label}
                </p>
                <p className={cn("text-[10px] mt-1.5 font-medium", isDark ? "text-white/20" : "text-gray-300")}>
                  Klik untuk detail
                </p>
              </motion.button>
            )
          })}
        </div>

        {/* ── TABLE ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className={cn("rounded-2xl border backdrop-blur-md overflow-hidden", glass)}
        >
          {/* table header */}
          <div className={cn("flex items-center justify-between px-4 sm:px-5 py-3.5 sm:py-4 border-b", isDark ? "border-white/[0.08]" : "border-black/[0.06]")}>
            <div>
              <h2 className={cn("text-sm font-semibold", isDark ? "text-white" : "text-gray-900")}>Users</h2>
              <p className={cn("text-xs mt-0.5", isDark ? "text-white/40" : "text-gray-400")}>{MOCK_USERS.length} total members</p>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-violet-500 hover:bg-violet-400 text-white text-xs font-medium transition-colors whitespace-nowrap">
              + Add user
            </button>
          </div>

          {/* table — horizontal scroll on mobile */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead>
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id} className={cn("border-b", isDark ? "border-white/[0.06]" : "border-black/[0.05]")}>
                    {hg.headers.map((header) => (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className={cn(
                          "text-left px-4 sm:px-5 py-3 text-xs font-medium select-none",
                          isDark ? "text-white/35" : "text-gray-400",
                          header.column.getCanSort() && "cursor-pointer hover:text-violet-400 transition-colors",
                          // "Joined" kolom disembunyikan di layar kecil
                          header.id === "joined" && "hidden md:table-cell",
                        )}
                      >
                        <div className="flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getIsSorted() === "asc" && <ChevronUp size={12} />}
                          {header.column.getIsSorted() === "desc" && <ChevronDown size={12} />}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.04 }}
                    className={cn(
                      "border-b last:border-0 transition-colors",
                      isDark ? "border-white/[0.04] hover:bg-white/[0.03]" : "border-black/[0.04] hover:bg-black/[0.02]"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={cn(
                          "px-4 sm:px-5 py-3 sm:py-3.5",
                          cell.column.id === "joined" && "hidden md:table-cell",
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* pagination */}
          <div className={cn("flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5 border-t", isDark ? "border-white/[0.06]" : "border-black/[0.05]")}>
            <span className={cn("text-xs", isDark ? "text-white/30" : "text-gray-400")}>
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className={cn("p-1.5 rounded-lg transition-colors disabled:opacity-30",
                  isDark ? "text-white/50 hover:text-white hover:bg-white/8" : "text-gray-500 hover:text-gray-900 hover:bg-black/5")}
              ><ChevronLeft size={15} /></button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className={cn("p-1.5 rounded-lg transition-colors disabled:opacity-30",
                  isDark ? "text-white/50 hover:text-white hover:bg-white/8" : "text-gray-500 hover:text-gray-900 hover:bg-black/5")}
              ><ChevronRight size={15} /></button>
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
              <div className={cn("flex items-center justify-between px-5 py-4 border-b", isDark ? "border-white/[0.08]" : "border-black/[0.06]")}>
                <div>
                  <h3 className={cn("text-sm font-semibold", isDark ? "text-white" : "text-gray-900")}>
                    {modalTitle[selectedCard]}
                  </h3>
                  <p className={cn("text-xs mt-0.5", isDark ? "text-white/35" : "text-gray-400")}>
                    {jadwal?.date ? new Date(jadwal.date + "T00:00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "—"}
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
                  <ul className="divide-y" style={{ borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}>
                    {modalData.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-center justify-between px-5 py-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                            {item.name[0]}
                          </div>
                          <div className="min-w-0">
                            <p className={cn("text-sm font-medium truncate", isDark ? "text-white/90" : "text-gray-800")}>
                              {item.name}
                            </p>
                            <p className={cn("text-[11px] truncate", isDark ? "text-white/35" : "text-gray-400")}>
                              {item.nmTeam}
                            </p>
                          </div>
                        </div>
                        <span className={cn("ml-3 shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full",
                          item.kodeShift.startsWith("A") ? "bg-amber-500/15 text-amber-400" :
                          item.kodeShift.startsWith("B") ? "bg-sky-500/15 text-sky-400" :
                          "bg-indigo-500/15 text-indigo-400"
                        )}>
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
