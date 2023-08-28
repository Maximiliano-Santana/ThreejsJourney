import './style.css'
import ReactDOM from 'react-dom/client'

import { Canvas } from '@react-three/fiber'
import { MeshNormalMaterial } from 'three'
import Experience from './Experience.jsx'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <Canvas>
        <Experience />
    </Canvas>
) 
