import { OrbitControls, Html } from '@react-three/drei'


export default function Experience()
{
    return <>

        <color args={['#1b1b1b']} attach="background"/>

        <OrbitControls makeDefault />

        <Html
            transform   
        >
            <iframe src='/Website.html'>

            </iframe>
        </Html>
        
        <mesh>
            <boxGeometry />
            <meshNormalMaterial />
        </mesh>

    </>
}