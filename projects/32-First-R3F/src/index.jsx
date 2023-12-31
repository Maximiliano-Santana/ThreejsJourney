import './style.css'
import ReactDOM from 'react-dom/client'

import { Canvas } from '@react-three/fiber'
import { MeshNormalMaterial } from 'three'
import * as THREE from 'three'
import Experience from './Experience.jsx'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <Canvas 
    dpr={ 1 }
        orthographic
        gl={{
            antialias: false,            
            toneMapping: THREE.CineonToneMapping,
            
        }}
        camera={ {
            fov: 45,
            zoom: 140,
            near: 0.1, 
            far: 100,
            position: [3, 2, 1]
        } }
    >
        <Experience />
    </Canvas>
) 
