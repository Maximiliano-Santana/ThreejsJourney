import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'

import './App.css'
import Experience from './components/Experience'

function App() {

  return (
    <>
      <Leva  collapsed />
      <Canvas >
        <Experience></Experience>
      </Canvas>
    </>
  )
}

export default App
