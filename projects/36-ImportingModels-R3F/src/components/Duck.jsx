import { useGLTF, Clone } from "@react-three/drei"

export default function Duck(props){
    const model = useGLTF('./models/Duck/glTF-Binary/Duck.glb');

    return <>
        <group {...props}>
            <Clone object={model.scene} position-z={-2} castShadow/>
            <Clone object={model.scene} position-z={0}  castShadow/>
            <Clone object={model.scene} position-z={2}  castShadow/>
        </group>
    </>
}


useGLTF.preload('./models/Duck/glTF-Binary/Duck.glb')