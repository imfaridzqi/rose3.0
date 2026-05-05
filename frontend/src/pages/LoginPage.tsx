import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Sun, Moon, Loader2, AlertCircle } from "lucide-react"
import { AuroraBackground } from "@/components/AuroraBackground"
import { useUIStore } from "@/stores/useUIStore"
import { useLogin } from "@/hooks/useAuth"
import { ApiError } from "@/lib/api"
import { cn } from "@/lib/utils"

const schema = z.object({
  nik: z.string().min(1, "NIK wajib diisi").regex(/^\d+$/, "NIK harus berupa angka"),
  password: z.string().min(8, "Password minimal 8 karakter"),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const { theme, toggleTheme } = useUIStore()
  const isDark = theme === "dark"
  const [showPass, setShowPass] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const login = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormValues) => {
    setServerError(null)
    try {
      await login.mutateAsync(data)
    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(err.message)
      } else {
        setServerError("Unable to connect to server. Make sure the backend is running.")
      }
    }
  }

  const inputBase = cn(
    "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 border",
    isDark
      ? "bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-violet-400/60 focus:bg-white/10"
      : "bg-white/60 border-black/8 text-gray-900 placeholder:text-gray-400 focus:border-violet-400/70 focus:bg-white/90"
  )

  return (
    <div
      className="relative min-h-screen overflow-hidden flex flex-col transition-colors duration-500"
      style={{ backgroundColor: isDark ? "#080810" : "#f0eeff" }}
    >
      {/* aurora canvas */}
      <AuroraBackground isDark={isDark} />

      {/* dot grid */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: isDark
            ? "radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px)"
            : "radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* vignette — darkens top-center so text is readable */}
      <div
        className="fixed inset-0 pointer-events-none z-[2]"
        style={{
          background: isDark
            ? "radial-gradient(ellipse 90% 60% at 50% 5%, rgba(8,8,16,0.88) 0%, rgba(8,8,16,0.3) 55%, transparent 100%)"
            : "radial-gradient(ellipse 90% 60% at 50% 5%, rgba(240,238,255,0.85) 0%, rgba(240,238,255,0.2) 55%, transparent 100%)",
        }}
      />

      {/* ── NAVBAR ─────────────────────────────────── */}
      <nav className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5">
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
            isDark ? "border-white/20 text-white/50 bg-white/5" : "border-gray-300 text-gray-500 bg-white/60"
          )}>
            BETA
          </span>
        </motion.div>

        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "p-2.5 rounded-full border transition-colors duration-300",
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
        </motion.button>
      </nav>

      {/* ── LOGIN CARD ─────────────────────────────── */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 -mt-6 sm:-mt-8">
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "w-full max-w-sm rounded-2xl p-6 sm:p-8 backdrop-blur-2xl border shadow-2xl",
            isDark
              ? "bg-white/5 border-white/10"
              : "bg-white/50 border-white/80"
          )}
          style={{
            boxShadow: isDark
              ? "inset 0 0 0 1px rgba(255,255,255,0.06), 0 32px 80px rgba(0,0,0,0.6)"
              : "inset 0 0 0 1px rgba(255,255,255,0.9), 0 32px 80px rgba(139,92,246,0.12)",
          }}
        >
          {/* header */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6 sm:mb-7 text-center"
          >
            <h1 className={cn("text-2xl sm:text-3xl font-bold tracking-tight mb-1", isDark ? "text-white" : "text-gray-900")}>
              rose<span className="text-violet-400">3.0</span>
            </h1>
            <p className={cn("text-xs", isDark ? "text-white/40" : "text-gray-500")}>
              Sign in to continue
            </p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* server error banner */}
            <AnimatePresence>
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs"
                >
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  {serverError}
                </motion.div>
              )}
            </AnimatePresence>
            {/* NIK */}
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className={cn("block text-xs font-medium mb-1.5", isDark ? "text-white/50" : "text-gray-600")}>
                NIK
              </label>
              <input
                {...register("nik")}
                type="text"
                inputMode="numeric"
                placeholder="Masukkan NIK Anda"
                className={inputBase}
              />
              {errors.nik && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1.5 text-xs text-red-400">
                  {errors.nik.message}
                </motion.p>
              )}
            </motion.div>

            {/* password */}
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <label className={cn("text-xs font-medium", isDark ? "text-white/50" : "text-gray-600")}>
                  Password
                </label>
                <a href="#" className={cn("text-xs hover:underline underline-offset-2", isDark ? "text-white/35 hover:text-white/60" : "text-gray-400 hover:text-gray-600")}>
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  className={cn(inputBase, "pr-11")}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors",
                    isDark ? "text-white/30 hover:text-white/60" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1.5 text-xs text-red-400">
                  {errors.password.message}
                </motion.p>
              )}
            </motion.div>

            {/* submit */}
            <motion.button
              type="submit"
              disabled={login.isPending}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 mt-2",
                isDark
                  ? "bg-violet-500 hover:bg-violet-400 text-white disabled:bg-violet-900 disabled:text-violet-500"
                  : "bg-violet-600 hover:bg-violet-500 text-white disabled:bg-violet-300"
              )}
            >
              {login.isPending && <Loader2 size={15} className="animate-spin" />}
              {login.isPending ? "Signing in…" : "Sign in"}
            </motion.button>
          </form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={cn("mt-6 text-center text-xs", isDark ? "text-white/25" : "text-gray-400")}
          >
            Don't have an account?{" "}
            <a href="#" className={cn("font-medium underline underline-offset-2", isDark ? "text-violet-400 hover:text-violet-300" : "text-violet-600 hover:text-violet-500")}>
              Sign up
            </a>
          </motion.p>
        </motion.div>
      </main>

      <div className="relative z-10 h-12" />
    </div>
  )
}
