import './App.css'

import {Canvas} from '@react-three/fiber'
import Experience from './components/Experience'

function App() {

  return (
    <>
      <Canvas 
        flat
        gl={{
          antialias: false
        }}
      >
        <Experience/>
      </Canvas>
    </>
  )
}

export default App
