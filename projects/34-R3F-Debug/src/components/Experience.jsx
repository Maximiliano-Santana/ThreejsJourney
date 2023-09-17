import { useRef } from 'react'
import { useFrame} from "@react-three/fiber"
import { OrbitControls, MeshReflectorMaterial } from '@react-three/drei'
import { useControls, button } from 'leva'
import { Perf } from 'r3f-perf'
import Cube from './Cube.jsx'


export default function Experience (){
    const { perfVisible } = useControls({
        perfVisible: true
    })

    const sphereRef = useRef();
    const {position, color, visible } = useControls('sphere' ,{
        position: {
            value: {x: -1, y: 0, z: 0},
            min: -4,
            max: 4,
            step: 0.01,
        },
        color: '#c671ff',
        visible: true,
        clickMe: button(()=>{console.log('hello')}),
        choice: { options:['a', 'b', 'c'] }
        
    });

    const { scale } = useControls('cube', {
        scale:{
            value: 1,
        },
    })
    
    useFrame((state, delta)=>{

    })

    return <>

        {perfVisible ? <Perf position="top-left"/> : false }

        <OrbitControls makeDefault/>

        <directionalLight position={[1, 2, 3]}/>
        <ambientLight intensity={0.25}/>

        
        <mesh ref={sphereRef} position={[position.x, position.y, position.z]} scale={1} visible={visible}>
            <sphereGeometry args={[0.5, 32, 32]}/>
            <meshStandardMaterial args={[{wireframe: false, color: color}]} />
        </mesh>
        
        <Cube scale={scale}></Cube>

        <mesh rotation-x={-Math.PI/2} position={[0, -1, 0]} scale={10}>
            <planeGeometry />
            <MeshReflectorMaterial resolution={ 1080 } blur={ [1000, 1000] } mixBlur={0.5} mirror={0.5} color="#94b8f6"/>
        </mesh>        
        
    </>
}