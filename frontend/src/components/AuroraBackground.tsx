import { useEffect, useRef } from "react"

type AuroraBlob = {
  xFrac: number
  yFrac: number
  radiusFrac: number
  hue: number
  tOffset: number
  speed: number
  yAmp: number
}

const BLOBS: AuroraBlob[] = [
  { xFrac: 0.05, yFrac: 0.82, radiusFrac: 0.48, hue: 172, tOffset: 0,   speed: 0.0006, yAmp: 0.025 },
  { xFrac: 0.25, yFrac: 0.88, radiusFrac: 0.52, hue: 210, tOffset: 1.2, speed: 0.0008, yAmp: 0.030 },
  { xFrac: 0.48, yFrac: 0.92, radiusFrac: 0.58, hue: 262, tOffset: 2.4, speed: 0.0007, yAmp: 0.020 },
  { xFrac: 0.70, yFrac: 0.88, radiusFrac: 0.54, hue: 288, tOffset: 0.8, speed: 0.0009, yAmp: 0.028 },
  { xFrac: 0.92, yFrac: 0.82, radiusFrac: 0.46, hue: 318, tOffset: 1.9, speed: 0.0006, yAmp: 0.022 },
]

export function AuroraBackground({ isDark }: { isDark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: 0.5, y: 0.8 })
  const tRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      }
    }

    const draw = () => {
      const W = canvas.width
      const H = canvas.height
      tRef.current += 1

      ctx.clearRect(0, 0, W, H)

      // transparent canvas — background color comes from the page div
      ctx.globalCompositeOperation = "source-over"

      const parallaxX = (mouse.current.x - 0.5) * 40
      const parallaxY = (mouse.current.y - 0.5) * 20

      BLOBS.forEach((blob) => {
        const t = tRef.current * blob.speed + blob.tOffset
        const x = blob.xFrac * W + parallaxX * (blob.xFrac - 0.5)
        const y = blob.yFrac * H + Math.sin(t) * blob.yAmp * H + parallaxY * 0.3
        const r = blob.radiusFrac * H
        const hueShift = Math.sin(t * 0.3) * 15
        const h = blob.hue + hueShift

        let color0: string, color1: string, color2: string

        if (isDark) {
          // screen blend on dark bg → bright glowing aurora
          ctx.globalCompositeOperation = "screen"
          color0 = `hsla(${h},     85%, 52%, 0.80)`
          color1 = `hsla(${h + 20},85%, 52%, 0.35)`
          color2 = `hsla(${h},     85%, 52%, 0)`
        } else {
          // source-over on light bg → visible colorful blobs
          ctx.globalCompositeOperation = "source-over"
          color0 = `hsla(${h},     75%, 58%, 0.45)`
          color1 = `hsla(${h + 20},75%, 58%, 0.18)`
          color2 = `hsla(${h},     75%, 58%, 0)`
        }

        const g = ctx.createRadialGradient(x, y, 0, x, y, r)
        g.addColorStop(0,   color0)
        g.addColorStop(0.4, color1)
        g.addColorStop(1,   color2)

        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
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
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ filter: "blur(72px) saturate(1.5)" }}
    />
  )
}
