import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";

import Placeholder from "./Placeholder";
import FlightHelmet from "./FlightHelmet";
import Duck from "./Duck";
import DuckToComponent from "./DuckToComponent";
import Fox from "./Fox";



export default function Experience (){
    //-----------------------------------Load models ------------------------
    //Firs import the r3f hook named useLoader that abstract loading
    //Then we need to send it the three.js loader class we want to use and the path to the file
    //In the expereince call useLoader and save it in a variable
    // const model = useLoader(GLTFLoader, './models/Duck/glTF-Binary/Duck.glb');
    
    //How we can add the model on the scene
    //We need to use primitive

    //Primitive is a holder for whatever we want to put in it, it's not a ral object but it's a container supported by R3F what will handle and siplay whatever we put in its object attribute

    //--------------- Draco loader compersion
    //If we try to load the DRACO compressed model we get an error
    //We need to instantiate a DracoLoader class and add it to the GLTFLoader instance with setDRACOLoades()

    //To do it we can use the useLoader, in the third parametter, wich is a function, and in that function we can get acces of to the instance of the loader

    // const model = useLoader(
    //     GLTFLoader, 
    //     './models/Duck/glTF-Draco/Duck.gltf',
    //     (loader)=>{
    //         const dracoLoader = new DRACOLoader();
    //         dracoLoader.setDecoderPath('./draco/');
    //         loader.setDRACOLoader(dracoLoader);
    //     }
    // );

    //--------------- Lazy loading
    //Currently R3Fis holding the rendering of the Experience as long as everything isn't ready in our scene. This includes the loading of the model.

    //To improve someone is waiting looking a white web application since the model is loading, becaus anithing is created on the scene once all the assets are loaded

    //There is a solution, we can have the scene and the model will appear once is loaded

    //To implement the lazy loading we are going to use the Suspense.
    //Is a React component that will wait for the process to be done before rendering the component

    //We have only one component in our application and it's Experience
    //Waiting for  the model to load before rendering Experience wouuld produce the same result
    //We need to put our model in a separated component (FlightHelmet component) 
    //Next import Suspence on the Experience.js 
    //And we put ir arround the model

    //-------------- Fallback
    //One coo fature wiht the Suspense is that we can set a fallback
    //The fallbakck is what the user will se if the component is not resady
    //To define the fallback, we can use the fallback attribute
    //We can put something that user will se while it's loading
    //set a mesh also we can use a personaliced material
    //Also we can send component into attributes

    //---------------------- GLTF loading with drei
    //We can use useGLTF hook from drei
    // const model = useGLTF('./models/Duck/glTF/Duck.gltf')
    //This laso supports draco loader

    //---------------------- Preloading
    //Our model will start loading only when the component is instantiated.
    //If we had conditions to display the component and that condition suddenly id true, the user would see the placeholder
    //Maybe we want to load the model as soon as possible.

    //To do it we can use the preload method on useGLTF 
    //Even if useGLTF is a functio, it can have rpoperties and methods

    //------------------------- GLTF to Component
    //If we want to manipulate the different parts of a ahamburguer, we need to traverse the loaded model, seacrh for the right child, save it in some way adn apply whatever we need to it.

    //We can have our model on component, we can do that thanks to GTLF to React Three Fiber on the next website
    //https://gltf.pmnd.rs

    //To import it we have multiple solutions.
    //By copying to clipboard and use the code
    //Thren create a new component

    //------------------------ Animations 
    //Ho to the Fox component to learn


    return <>
        <Perf position = "top-left"/>
        <OrbitControls/>
            
        <directionalLight position={[1, 2, 3]} castShadow     mapSize={{ width: 10, height: 10 }}/>
        <hemisphereLight args={['#ffffff', 'lightgreen', 1]}/>

        {/* <Suspense fallback={ <Placeholder position={[0, 1.5, 0]} scale={[2, 3, 2]}/> }>
            <FlightHelmet/>
        </Suspense> */}
        

        <Suspense fallback={ <Placeholder position={[0, 1.5, 0]} scale={[2, 3, 2]}/> }>
            <Duck position={[-4, -0.1, 0]}/>
        </Suspense>
        
        <Suspense fallback={ <Placeholder position={[0, 1.5, 0]} scale={[2, 3, 2]}/> }>
            <Fox/>
        </Suspense>



        <mesh rotation-x={-Math.PI*0.5} position-y={0} receiveShadow>
            <planeGeometry args={[10,10]}/>
            <meshStandardMaterial color="lightgreen" />
        </mesh>
    </>
}