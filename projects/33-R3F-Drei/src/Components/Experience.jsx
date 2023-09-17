import { useRef } from 'react'
import { useFrame} from "@react-three/fiber"
import { OrbitControls, TransformControls, PivotControls, Html, Text, Float, MeshReflectorMaterial } from '@react-three/drei'
import { MeshNormalMaterial } from 'three';


export default function Experience (){

    const cubeRef = useRef();
    const sphereRef = useRef();

    
    useFrame((state, delta)=>{

    })

    return <>
        <OrbitControls makeDefault/>

        <directionalLight position={[1, 2, 3]}/>
        <ambientLight intensity={0.25}/>

        <PivotControls anchor={ [0, 0, 0] } depthTest={false} lineWidth={ 2 } axisColors={['#', '#', '#']}>
            <mesh ref={sphereRef} position={[-1, 0, 0]} scale={1}>
                <sphereGeometry args={[0.5, 32, 32]}/>
                <meshStandardMaterial args={[{wireframe: false, color: 'red'}]} />
                <Html position={ [0.5, 0.5, 0.5] } wrapperClass='label' center distanceFactor={ 3 } occlude={[sphereRef]}>
                    <h1>Hellow World</h1>
                </Html>
            </mesh>
        </PivotControls>
        
        <mesh ref={cubeRef} position={[1, 0, 0]} rotation-y={Math.PI*0.25} >
            <boxGeometry />
            <meshStandardMaterial color={'orange'} args={ [2, 2, 2, 4, 4, 4] } />
        </mesh>
        <TransformControls object={ cubeRef } mode='rotate'>
        </TransformControls>

        <mesh rotation-x={-Math.PI/2} position={[0, -2, 0]} scale={10}>
            <planeGeometry />
            <MeshReflectorMaterial resolution={ 1080 } blur={ [1000, 1000] } mixBlur={0.5} mirror={0.5} color="greenyellow"/>
        </mesh>

        <Float>
            <Text color="Salmon" position-y={2} maxWidth={3} textAlign='center'>
                I love Melissa
                <meshNormalMaterial />
            </Text>
        </Float>
    </>
}