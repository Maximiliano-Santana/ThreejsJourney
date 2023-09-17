import { Canvas } from '@react-three/fiber'
import Experience from './components/Experience.jsx'
import * as THREE from 'three'

import './App.css'

function App() {

  const created = ({gl, scene})=>{
    // gl.setClearColor('#1c1c1c', 1)
    // scene.background = new THREE.Color('#1c1c1c')
  }

  return (
    <>
      <Canvas
        camera={
          {
            fov: 45,
            near: 0.1,
            far: 100,
          }
        }
        onCreated={created}
        shadows 
      >
        <Experience></Experience>
      </Canvas>
    </>
  )
}

export default App
