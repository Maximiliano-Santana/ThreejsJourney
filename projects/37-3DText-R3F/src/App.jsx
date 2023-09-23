import './App.css'

import { Canvas } from '@react-three/fiber'
import Experience from './components/Experience'

function App() {

  return (
    <>
      <Canvas
        flat
        shadows
        camera={{
          position: [0, 7, 30]
        }}
      >
        <Experience/>
      </Canvas>  
    </>
  )
}

export default App
