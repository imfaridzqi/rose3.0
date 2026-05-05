import { useEffect, useRef } from "react"
import * as THREE from "three"

export function Scene() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    renderer.setSize(mount.clientWidth, mount.clientHeight)
    mount.appendChild(renderer.domElement)

    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16)
    const material = new THREE.MeshStandardMaterial({ color: 0x7c3aed, wireframe: false })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(5, 5, 5)
    scene.add(light)
    scene.add(new THREE.AmbientLight(0xffffff, 0.3))

    camera.position.z = 4

    let animId: number
    const animate = () => {
      animId = requestAnimationFrame(animate)
      mesh.rotation.x += 0.005
      mesh.rotation.y += 0.008
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="w-full h-full" />
}
