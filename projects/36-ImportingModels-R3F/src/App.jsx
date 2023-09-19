import './App.css'
import { Canvas } from '@react-three/fiber'
import Experience from './components/Experience'

function App() {

  return (
    <>
      <Canvas
        shadows
      >
        <Experience/>
      </Canvas>
    </>
  )
}

export default App
