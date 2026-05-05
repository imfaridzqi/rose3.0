import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, Users, BarChart3, Settings,
  Bell, Search, Menu, X, Sun, Moon, LogOut, ChevronRight,
} from "lucide-react"
import { useUIStore } from "@/stores/useUIStore"
import { useAuthStore } from "@/stores/useAuthStore"
import { useLogout, useCurrentUser } from "@/hooks/useAuth"
import { cn } from "@/lib/utils"

type NavItem = { label: string; icon: React.ElementType }

const NAV: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Users",     icon: Users },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings",  icon: Settings },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useUIStore()
  const isDark = theme === "dark"
  const user = useAuthStore((s) => s.user)
  const { data: currentUser } = useCurrentUser()
  const logout = useLogout()
  const displayUser = currentUser ?? user

  // true = mobile viewport (< 768px)
  const [isMobile, setIsMobile] = useState(false)
  // desktop: controls collapse (icon-only vs full)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  // mobile: controls overlay drawer visibility
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeNav, setActiveNav] = useState("Dashboard")

  // Detect viewport changes
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const update = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches)
      if (e.matches) setDrawerOpen(false)   // close drawer on resize to mobile
      else setSidebarOpen(true)              // expand sidebar on resize to desktop
    }
    update(mq)
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  const glass = isDark
    ? "bg-white/[0.04] border-white/[0.08]"
    : "bg-white/70 border-black/[0.06]"

  const handleHamburger = () => {
    if (isMobile) setDrawerOpen((v) => !v)
    else setSidebarOpen((v) => !v)
  }

  const SidebarContent = () => (
    <>
      {/* logo */}
      <div className="flex items-center gap-3 px-4 py-5 h-16 border-b border-inherit shrink-0">
        <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">R</span>
        </div>
        <AnimatePresence>
          {(sidebarOpen || isMobile) && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
              className={cn("font-semibold text-sm whitespace-nowrap", isDark ? "text-white" : "text-gray-900")}
            >
              rose<span className="text-violet-400">3.0</span>
            </motion.span>
          )}
        </AnimatePresence>
        {/* close button inside drawer on mobile */}
        {isMobile && (
          <button
            onClick={() => setDrawerOpen(false)}
            className={cn("ml-auto p-1 rounded-lg", isDark ? "text-white/50 hover:text-white" : "text-gray-400 hover:text-gray-700")}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* nav items */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {NAV.map((item) => {
          const Icon = item.icon
          const isActive = activeNav === item.label
          return (
            <button
              key={item.label}
              onClick={() => { setActiveNav(item.label); if (isMobile) setDrawerOpen(false) }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-violet-500/15 text-violet-400"
                  : isDark
                    ? "text-white/50 hover:text-white/80 hover:bg-white/5"
                    : "text-gray-500 hover:text-gray-900 hover:bg-black/5"
              )}
            >
              <Icon size={18} className="shrink-0" />
              <AnimatePresence>
                {(sidebarOpen || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.12 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && (sidebarOpen || isMobile) && (
                <ChevronRight size={14} className="ml-auto text-violet-400" />
              )}
            </button>
          )
        })}
      </nav>

      {/* bottom actions */}
      <div className="px-2 pb-4 pt-4 border-t border-inherit space-y-1 shrink-0">
        <button
          onClick={toggleTheme}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
            isDark ? "text-white/50 hover:text-white/80 hover:bg-white/5" : "text-gray-500 hover:text-gray-900 hover:bg-black/5"
          )}
        >
          {isDark ? <Sun size={18} className="shrink-0" /> : <Moon size={18} className="shrink-0" />}
          <AnimatePresence>
            {(sidebarOpen || isMobile) && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                {isDark ? "Light mode" : "Dark mode"}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <button
          onClick={logout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
            isDark ? "text-white/50 hover:text-red-400 hover:bg-red-500/10" : "text-gray-500 hover:text-red-500 hover:bg-red-50"
          )}
        >
          <LogOut size={18} className="shrink-0" />
          <AnimatePresence>
            {(sidebarOpen || isMobile) && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                Sign out
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* user info */}
        {(sidebarOpen || isMobile) && displayUser && (
          <div className={cn("mt-2 px-3 py-2.5 rounded-xl border", isDark ? "border-white/[0.06] bg-white/[0.03]" : "border-black/[0.05] bg-black/[0.02]")}>
            <p className={cn("text-xs font-medium truncate", isDark ? "text-white/80" : "text-gray-800")}>{displayUser.name}</p>
            <p className={cn("text-[10px] truncate mt-0.5", isDark ? "text-white/35" : "text-gray-400")}>{displayUser.email}</p>
          </div>
        )}
      </div>
    </>
  )

  return (
    <div
      className="flex h-screen overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: isDark ? "#080810" : "#f0eeff" }}
    >
      {/* dot grid */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: isDark
            ? "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)"
            : "radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* ── DESKTOP SIDEBAR ─────────────────────── */}
      {!isMobile && (
        <motion.aside
          animate={{ width: sidebarOpen ? 220 : 68 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className={cn(
            "relative z-10 flex flex-col h-full border-r backdrop-blur-xl overflow-hidden shrink-0",
            glass
          )}
        >
          <SidebarContent />
        </motion.aside>
      )}

      {/* ── MOBILE OVERLAY DRAWER ───────────────── */}
      {isMobile && (
        <AnimatePresence>
          {drawerOpen && (
            <>
              {/* backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setDrawerOpen(false)}
                className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
              />
              {/* drawer panel */}
              <motion.aside
                key="drawer"
                initial={{ x: -260 }}
                animate={{ x: 0 }}
                exit={{ x: -260 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className={cn(
                  "fixed left-0 top-0 z-40 flex flex-col h-full border-r backdrop-blur-2xl shadow-2xl",
                  glass
                )}
                style={{ width: 260 }}
              >
                <SidebarContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      )}

      {/* ── MAIN ─────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* topbar */}
        <header className={cn(
          "flex items-center gap-3 h-14 sm:h-16 px-4 sm:px-5 border-b backdrop-blur-xl shrink-0",
          glass
        )}>
          <button
            onClick={handleHamburger}
            className={cn(
              "p-2 rounded-lg transition-colors shrink-0",
              isDark ? "text-white/50 hover:text-white hover:bg-white/8" : "text-gray-500 hover:text-gray-900 hover:bg-black/5"
            )}
          >
            {/* on desktop show X/Menu based on sidebarOpen; on mobile always show Menu */}
            {!isMobile && sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* search — hidden on mobile, visible from sm */}
          <div className={cn(
            "hidden sm:flex items-center gap-2 flex-1 max-w-xs px-3 py-2 rounded-xl border text-sm",
            isDark
              ? "bg-white/5 border-white/8 text-white/30"
              : "bg-black/[0.03] border-black/[0.06] text-gray-400"
          )}>
            <Search size={14} />
            <span>Search…</span>
          </div>

          {/* search icon only on mobile */}
          <button className={cn(
            "sm:hidden p-2 rounded-lg transition-colors",
            isDark ? "text-white/50 hover:text-white hover:bg-white/8" : "text-gray-500 hover:text-gray-900 hover:bg-black/5"
          )}>
            <Search size={18} />
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button className={cn(
              "relative p-2 rounded-lg transition-colors",
              isDark ? "text-white/50 hover:text-white hover:bg-white/8" : "text-gray-500 hover:text-gray-900 hover:bg-black/5"
            )}>
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-500" />
            </button>

            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold shrink-0">
              {displayUser?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
          </div>
        </header>

        {/* page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
