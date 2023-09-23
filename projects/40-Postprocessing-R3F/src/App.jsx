import './App.css'

import { Canvas } from '@react-three/fiber'
import Experience from './component/Experience'

function App() {

  return (
    <>
      <Canvas
      
        gl={{
          antialias: false,
        }}
      >
        <Experience/>
      </Canvas>
    </>
  )
}

export default App
