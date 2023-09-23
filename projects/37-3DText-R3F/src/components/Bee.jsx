import { Center, useGLTF, Float } from "@react-three/drei"
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";

export default function Bee({visible=false}){
    const model = useGLTF('./models/Bee.glb');
    
    useEffect(()=>{
        model.scene.traverse((children)=>{
            if(children.isMesh){
                children.castShadow = true;
            }
        })

    },[])


    return <>
        <Float>
            <Center scale={5} position={[-2, 2, -2]} rotation-y={Math.PI*0.25} visible={visible}>
                <primitive object={model.scene}/>
            </Center>
        </Float>
    </>
}