import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon, Smartphone, Monitor, ArrowUp, Sparkles } from "lucide-react"
import { AuroraBackground } from "@/components/AuroraBackground"
import { useUIStore } from "@/stores/useUIStore"
import { cn } from "@/lib/utils"

const PLACEHOLDERS = [
  "What shall we build today?",
  "Describe your next big idea…",
  "What feature are you designing?",
  "Tell me about your app idea…",
]

type Tab = "App" | "Web"

export function HomePage() {
  const { theme, toggleTheme } = useUIStore()
  const isDark = theme === "dark"

  const [tab, setTab] = useState<Tab>("App")
  const [prompt, setPrompt] = useState("")
  const [phIndex] = useState(() => Math.floor(Math.random() * PLACEHOLDERS.length))

  const hasPrompt = prompt.trim().length > 0

  return (
    <div
      className={cn("relative min-h-screen overflow-hidden flex flex-col transition-colors duration-500")}
      style={{ backgroundColor: isDark ? "#080810" : "#f0eeff" }}
    >
      {/* aurora */}
      <AuroraBackground isDark={isDark} />

      {/* dot grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: isDark
            ? "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)"
            : "radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* vignette: dark center at top so text is readable */}
      <div
        className="fixed inset-0 pointer-events-none z-[2]"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 80% 55% at 50% 10%, rgba(8,8,16,0.92) 0%, rgba(8,8,16,0.4) 60%, transparent 100%)"
            : "radial-gradient(ellipse 80% 55% at 50% 10%, rgba(244,242,255,0.88) 0%, rgba(244,242,255,0.3) 60%, transparent 100%)",
        }}
      />

      {/* ── NAVBAR ─────────────────────────────────────── */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5">
        {/* logo */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <span className={cn("text-lg font-semibold tracking-tight", isDark ? "text-white" : "text-gray-900")}>
            rose<span className="text-violet-400">3.0</span>
          </span>
          <span className={cn(
            "text-[10px] font-medium px-2 py-0.5 rounded-full border",
            isDark
              ? "border-white/20 text-white/50 bg-white/5"
              : "border-gray-300 text-gray-500 bg-white/60"
          )}>
            BETA
          </span>
        </motion.div>

        {/* right actions */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <button
            onClick={toggleTheme}
            className={cn(
              "p-2.5 rounded-full border transition-all duration-200",
              isDark
                ? "border-white/15 bg-white/5 text-white/70 hover:bg-white/15"
                : "border-gray-200 bg-white/60 text-gray-600 hover:bg-white/90"
            )}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
              </motion.div>
            </AnimatePresence>
          </button>

          <button className={cn(
            "px-5 py-2 rounded-full text-sm font-medium transition-all duration-200",
            isDark
              ? "bg-white text-black hover:bg-white/90"
              : "bg-gray-900 text-white hover:bg-gray-700"
          )}>
            Get started
          </button>
        </motion.div>
      </nav>

      {/* ── HERO ───────────────────────────────────────── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl"
        >
          <h1 className={cn(
            "text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.08] mb-5",
            isDark ? "text-white" : "text-gray-900"
          )}>
            Build at the<br />
            speed of thought
          </h1>
          <p className={cn(
            "text-base sm:text-lg max-w-md mx-auto",
            isDark ? "text-white/50" : "text-gray-500"
          )}>
            From idea to working product — fast, beautiful, and yours.
          </p>
        </motion.div>

        {/* ── PROMPT BOX ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "mt-10 w-full max-w-2xl rounded-2xl border backdrop-blur-xl shadow-2xl overflow-hidden",
            isDark
              ? "bg-white/5 border-white/10"
              : "bg-white/50 border-white/80"
          )}
          style={{
            boxShadow: isDark
              ? "0 0 0 1px rgba(255,255,255,0.06) inset, 0 32px 80px rgba(0,0,0,0.5)"
              : "0 0 0 1px rgba(255,255,255,0.9) inset, 0 32px 80px rgba(0,0,0,0.1)",
          }}
        >
          {/* textarea */}
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={PLACEHOLDERS[phIndex]}
            rows={4}
            className={cn(
              "w-full px-5 pt-5 pb-2 text-sm bg-transparent outline-none resize-none",
              isDark
                ? "text-white placeholder:text-white/25"
                : "text-gray-900 placeholder:text-gray-400"
            )}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
              }
            }}
          />

          {/* toolbar */}
          <div className="flex items-center justify-between px-4 py-3">
            {/* left: tabs */}
            <div className="flex items-center gap-1">
              {(["App", "Web"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150",
                    tab === t
                      ? isDark
                        ? "bg-white/15 text-white"
                        : "bg-black/10 text-gray-900"
                      : isDark
                        ? "text-white/40 hover:text-white/70 hover:bg-white/5"
                        : "text-gray-400 hover:text-gray-700 hover:bg-black/5"
                  )}
                >
                  {t === "App" ? <Smartphone size={12} /> : <Monitor size={12} />}
                  {t}
                </button>
              ))}
            </div>

            {/* right: model badge + send */}
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border",
                isDark
                  ? "border-white/10 bg-white/5 text-white/50"
                  : "border-gray-200 bg-white/60 text-gray-500"
              )}>
                <Sparkles size={11} />
                Claude Sonnet
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "p-2 rounded-lg transition-all duration-150",
                  hasPrompt
                    ? "bg-violet-500 text-white hover:bg-violet-400"
                    : isDark
                      ? "bg-white/10 text-white/30 cursor-not-allowed"
                      : "bg-black/8 text-gray-400 cursor-not-allowed"
                )}
                disabled={!hasPrompt}
              >
                <ArrowUp size={15} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* suggestion chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 flex flex-wrap items-center justify-center gap-2"
        >
          {["Dashboard app", "Landing page", "E-commerce", "Portfolio"].map((chip) => (
            <button
              key={chip}
              onClick={() => setPrompt(chip)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs border transition-all duration-150",
                isDark
                  ? "border-white/10 text-white/40 hover:border-white/25 hover:text-white/70 hover:bg-white/5"
                  : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600 hover:bg-white/60"
              )}
            >
              {chip}
            </button>
          ))}
        </motion.div>
      </main>

      <div className="relative z-10 h-12" />
    </div>
  )
}
