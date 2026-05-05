import { useEffect, useRef } from "react"

type AuroraBlob = {
  xFrac: number
  yFrac: number
  radiusFrac: number
  hue: number
  tOffset: number
  speed: number
  yAmp: number
  depth: number  // 0.0 = far (moves less), 1.0 = close (moves more)
}

const BLOBS: AuroraBlob[] = [
  { xFrac: 0.05, yFrac: 0.82, radiusFrac: 0.48, hue: 172, tOffset: 0.0, speed: 0.0006, yAmp: 0.025, depth: 0.4 },
  { xFrac: 0.25, yFrac: 0.88, radiusFrac: 0.52, hue: 210, tOffset: 1.2, speed: 0.0008, yAmp: 0.030, depth: 0.7 },
  { xFrac: 0.48, yFrac: 0.92, radiusFrac: 0.58, hue: 262, tOffset: 2.4, speed: 0.0007, yAmp: 0.020, depth: 1.0 },
  { xFrac: 0.70, yFrac: 0.88, radiusFrac: 0.54, hue: 288, tOffset: 0.8, speed: 0.0009, yAmp: 0.028, depth: 0.6 },
  { xFrac: 0.92, yFrac: 0.82, radiusFrac: 0.46, hue: 318, tOffset: 1.9, speed: 0.0006, yAmp: 0.022, depth: 0.3 },
]

export function AuroraBackground({ isDark }: { isDark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rawMouse = useRef({ x: 0.5, y: 0.5 })
  const smoothMouse = useRef({ x: 0.5, y: 0.5 })
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
      rawMouse.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      }
    }

    const draw = () => {
      const W = canvas.width
      const H = canvas.height
      tRef.current += 1

      // smooth lerp toward real mouse — creates fluid, laggy follow
      smoothMouse.current.x += (rawMouse.current.x - smoothMouse.current.x) * 0.04
      smoothMouse.current.y += (rawMouse.current.y - smoothMouse.current.y) * 0.04

      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = "source-over"

      BLOBS.forEach((blob) => {
        const t = tRef.current * blob.speed + blob.tOffset

        // parallax: each blob moves differently based on depth
        const pxMax = 120  // max horizontal shift in px
        const pyMax = 60   // max vertical shift in px
        const px = (smoothMouse.current.x - 0.5) * pxMax * blob.depth
        const py = (smoothMouse.current.y - 0.5) * pyMax * blob.depth

        const x = blob.xFrac * W + px
        const y = blob.yFrac * H + Math.sin(t) * blob.yAmp * H + py
        const r = blob.radiusFrac * H
        const hueShift = Math.sin(t * 0.3) * 15
        const h = blob.hue + hueShift

        let color0: string, color1: string, color2: string

        if (isDark) {
          ctx.globalCompositeOperation = "screen"
          color0 = `hsla(${h},     85%, 52%, 0.85)`
          color1 = `hsla(${h + 20},85%, 52%, 0.35)`
          color2 = `hsla(${h},     85%, 52%, 0)`
        } else {
          ctx.globalCompositeOperation = "source-over"
          color0 = `hsla(${h},     78%, 55%, 0.50)`
          color1 = `hsla(${h + 20},78%, 55%, 0.20)`
          color2 = `hsla(${h},     78%, 55%, 0)`
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
