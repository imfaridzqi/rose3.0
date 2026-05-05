import { UsersPage } from "@/pages/UsersPage"
import { Scene } from "@/components/three/Scene"

function App() {
  return (
    <div className="min-h-screen">
      <div className="h-64 bg-gray-950">
        <Scene />
      </div>
      <UsersPage />
    </div>
  )
}

export default App
