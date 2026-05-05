import { useEffect, useRef } from "react"

type Blob = {
  x: number
  y: number
  homeX: number
  homeY: number
  radius: number
  hue: number
  t: number
  speed: number
  amplitude: number
}

export function FluidBackground({ isDark }: { isDark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -9999, y: -9999 })
  const blobsRef = useRef<Blob[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initBlobs()
    }

    const initBlobs = () => {
      const hues = isDark
        ? [260, 200, 290, 230, 310, 170, 245]
        : [300, 260, 220, 280, 340, 200, 320]

      blobsRef.current = hues.map((hue) => {
        const homeX = Math.random() * canvas.width
        const homeY = Math.random() * canvas.height
        return {
          x: homeX,
          y: homeY,
          homeX,
          homeY,
          radius: Math.random() * 250 + 180,
          hue,
          t: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.004 + 0.001,
          amplitude: Math.random() * 120 + 60,
        }
      })
    }

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = isDark ? "#060610" : "#f5f0ff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.globalCompositeOperation = "screen"

      blobsRef.current.forEach((blob) => {
        blob.t += blob.speed

        const targetX = blob.homeX + Math.sin(blob.t) * blob.amplitude
        const targetY = blob.homeY + Math.cos(blob.t * 0.71) * blob.amplitude

        // drift home position slowly
        blob.homeX += (Math.random() - 0.5) * 0.3
        blob.homeY += (Math.random() - 0.5) * 0.3
        blob.homeX = Math.max(0, Math.min(canvas.width, blob.homeX))
        blob.homeY = Math.max(0, Math.min(canvas.height, blob.homeY))

        // mouse attraction
        const dx = mouse.current.x - blob.x
        const dy = mouse.current.y - blob.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const pull = dist < 350 ? ((350 - dist) / 350) * 0.04 : 0

        blob.x += (targetX - blob.x) * 0.025 + dx * pull
        blob.y += (targetY - blob.y) * 0.025 + dy * pull

        const sat = isDark ? "80%" : "70%"
        const lit = isDark ? "55%" : "68%"
        const alpha = isDark ? 0.65 : 0.55

        const g = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius)
        g.addColorStop(0, `hsla(${blob.hue}, ${sat}, ${lit}, ${alpha})`)
        g.addColorStop(0.5, `hsla(${blob.hue + 20}, ${sat}, ${lit}, ${alpha * 0.4})`)
        g.addColorStop(1, `hsla(${blob.hue}, ${sat}, ${lit}, 0)`)

        ctx.beginPath()
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      })

      ctx.globalCompositeOperation = "source-over"
      animId = requestAnimationFrame(draw)
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("resize", resize)
    resize()
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("resize", resize)
    }
  }, [isDark])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ filter: "blur(60px) saturate(1.4)" }}
    />
  )
}
