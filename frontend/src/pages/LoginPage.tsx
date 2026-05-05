import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Eye, EyeOff, Sun, Moon, Loader2 } from "lucide-react"
import { FluidBackground } from "@/components/FluidBackground"
import { useUIStore } from "@/stores/useUIStore"
import { cn } from "@/lib/utils"

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const { theme, toggleTheme } = useUIStore()
  const isDark = theme === "dark"
  const [showPass, setShowPass] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormValues) => {
    await new Promise((r) => setTimeout(r, 1200))
    console.log("login →", data)
  }

  const glass = isDark
    ? "bg-white/5 border-white/10"
    : "bg-white/40 border-white/70"

  const inputClass = cn(
    "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 border backdrop-blur-sm",
    isDark
      ? "bg-white/5 border-white/10 text-white placeholder:text-white/25 focus:border-violet-400/50 focus:bg-white/10"
      : "bg-white/50 border-black/10 text-gray-900 placeholder:text-gray-400 focus:border-violet-400/60 focus:bg-white/80"
  )

  return (
    <div className={cn("relative min-h-screen flex items-center justify-center overflow-hidden", isDark && "dark")}>
      <FluidBackground isDark={isDark} />

      {/* noise overlay for texture */}
      <div
        className="fixed inset-0 pointer-events-none z-[1] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
        }}
      />

      {/* theme toggle */}
      <motion.button
        onClick={toggleTheme}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "fixed top-5 right-5 z-50 p-3 rounded-full backdrop-blur-md border transition-colors duration-300",
          isDark
            ? "bg-white/10 border-white/15 text-white/80 hover:bg-white/20"
            : "bg-black/5 border-black/10 text-gray-700 hover:bg-black/10"
        )}
      >
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </motion.div>
      </motion.button>

      {/* card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "relative z-10 w-full max-w-sm mx-4 rounded-2xl p-8 backdrop-blur-2xl border shadow-2xl",
          glass
        )}
      >
        {/* inner glow ring */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: isDark
              ? "inset 0 0 0 1px rgba(255,255,255,0.06), 0 0 80px rgba(139,92,246,0.15)"
              : "inset 0 0 0 1px rgba(255,255,255,0.8), 0 0 80px rgba(139,92,246,0.1)",
          }}
        />

        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mb-7 text-center"
        >
          <div className={cn("text-3xl font-bold tracking-tight mb-1", isDark ? "text-white" : "text-gray-900")}>
            rose<span className="text-violet-400">3.0</span>
          </div>
          <p className={cn("text-xs", isDark ? "text-white/40" : "text-gray-500")}>
            Sign in to continue
          </p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* email */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className={cn("block text-xs font-medium mb-1.5", isDark ? "text-white/50" : "text-gray-600")}>
              Email
            </label>
            <input {...register("email")} type="email" placeholder="you@example.com" className={inputClass} />
            {errors.email && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1.5 text-xs text-red-400">
                {errors.email.message}
              </motion.p>
            )}
          </motion.div>

          {/* password */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <label className={cn("block text-xs font-medium mb-1.5", isDark ? "text-white/50" : "text-gray-600")}>
              Password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                className={cn(inputClass, "pr-11")}
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

          {/* forgot */}
          <div className="flex justify-end">
            <a href="#" className={cn("text-xs hover:underline underline-offset-2", isDark ? "text-white/40 hover:text-white/70" : "text-gray-400 hover:text-gray-700")}>
              Forgot password?
            </a>
          </div>

          {/* submit */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2",
              isDark
                ? "bg-violet-500 hover:bg-violet-400 text-white disabled:bg-violet-800 disabled:text-violet-400"
                : "bg-violet-600 hover:bg-violet-500 text-white disabled:bg-violet-300"
            )}
          >
            {isSubmitting && <Loader2 size={15} className="animate-spin" />}
            {isSubmitting ? "Signing in…" : "Sign in"}
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
    </div>
  )
}
