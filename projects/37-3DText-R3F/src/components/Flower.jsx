import { Center, useGLTF } from "@react-three/drei"
import { Children, useEffect } from "react";

export default function Flower({visible= false}){
    const model = useGLTF('./models/Flower2.glb');
    
    model.scene.traverse((child)=>{
        child.castShadow = true;
        child.receiveShadow = true;
    })

    return <>
        <Center scale={10} visible={visible}>
            <primitive object={model.scene}/>
        </Center>
    </>
}