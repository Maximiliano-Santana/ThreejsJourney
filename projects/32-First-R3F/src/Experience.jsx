import { useRef } from 'react'
import { useThree, useFrame, extend } from "@react-three/fiber"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import RandomMesh from './RandomMesh';

extend({OrbitControls})

export default function Experience (){
    
    // const three = useThree();
    const {camera, gl} = useThree();
    // console.log(gl.domElement)

    const cubeRef = useRef();
    const groupRef = useRef();

    
    useFrame((state, delta)=>{
        cubeRef.current.rotation.y += delta;
        const angle = state.clock.getElapsedTime();

        state.camera.position.x = Math.sin(angle)*8
        state.camera.position.z = Math.cos(angle)*8
        state.camera.lookAt(0, 0, 0);
    })

    return <>
        {/* <orbitControls args={[camera, gl.domElement]} /> */}

        <directionalLight position={[1, 2, 3]}/>
        <ambientLight intensity={0.25}/>

       

        <group ref={ groupRef }>
            <mesh position={[-1, 0, 0]} scale={1}>
                <sphereGeometry args={[0.5, 32, 32]}/>
                <meshStandardMaterial args={[{wireframe: true, color: 'red'}]} />
            </mesh>
            <mesh ref={cubeRef} position={[1, 0, 0]} rotation-y={Math.PI*0.25} >
                <boxGeometry />
                <meshStandardMaterial color={'orange'} args={ [2, 2, 2, 4, 4, 4] } />
            </mesh>
        </group>

        <mesh rotation-x={-Math.PI/2} position={[0, -2, 0]} scale={5}>
            <planeGeometry />
            <meshStandardMaterial />
        </mesh>

        <RandomMesh/> 
    </>
}