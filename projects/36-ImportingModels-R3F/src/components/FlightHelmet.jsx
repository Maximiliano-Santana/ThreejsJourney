import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function FlightHelmet (){
    const model = useLoader(
        GLTFLoader,
        './models/FlightHelmet/glTF/FlightHelmet.gltf',
    );

    return <>
        <primitive object={model.scene} scale={5}/>
    </>
}