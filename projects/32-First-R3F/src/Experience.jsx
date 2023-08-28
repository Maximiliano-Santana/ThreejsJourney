import { useRef } from 'react'

import { useFrame } from "@react-three/fiber"
import { Group } from 'three';

export default function Experience (){
    const cubeRef = useRef();
    const groupRef = useRef();
    
    useFrame((state, delta)=>{
        cubeRef.current.rotation.y += delta;
        groupRef.current.rotation.y += delta;
    })

    return <>
        <group ref={ groupRef }>
            <mesh position={[-1, 0, 0]} scale={1}>
                <sphereGeometry args={[1, 32, 32]}/>
                <meshBasicMaterial color='gray' />
            </mesh>
            <mesh ref={cubeRef} position={[1, 0, 0]} rotation-y={Math.PI*0.25} >
                <boxGeometry />
                <meshBasicMaterial color={'orange'} args={ [2, 2, 2, 4, 4, 4] } />
            </mesh>
        </group>

        <mesh rotation-x={-Math.PI/2} position={[0, -2, 0]} scale={5}>
            <planeGeometry />
            <meshBasicMaterial />
        </mesh>
    </>
}