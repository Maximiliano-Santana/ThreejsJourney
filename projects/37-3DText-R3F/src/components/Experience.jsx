import { useEffect, useRef, useState } from "react";
import * as THREE from 'three'
import { useFrame } from "@react-three/fiber";
import { OrbitControls, Text3D, Center, useMatcapTexture, useHelper, Float, meshBounds } from "@react-three/drei";
import { Perf } from "r3f-perf";

import DateCounter from "./DateCounter";
import Bee from "./Bee.jsx";
import Flower from "./Flower.jsx";
import TitleText from "./TitleText.jsx";
import Floor from "./Floor";

let torusGeometry = new THREE.TorusGeometry(1, 0.6, 22, 42);
// torusGeometry = new THREE.SphereGeometry (0.5);
const torusMaterial = new THREE.MeshMatcapMaterial();

export default function Experience(){

    const [visible , setVisible] = useState()
    
    const dataTimer = (mensage) =>{
        setVisible(mensage);
    }
    const directionalLight = useRef();
    // useHelper(directionalLight, THREE.DirectionalLightHelper);

    //------------------- Text
    //We can use the TextGeometry from Text3D
    //To use Text3D we need to provide a typeface font on the props.
    //Also we can change the material by provideing other mateiral bewtween the tags
    
    //Now we need to center the text 
    //We could use the same technique we used in the 3D Text lesson to center geometry 
    //But we can also use the Center helper that we can find on drei
    //And envolve the text with it

    //All parameter that we can use to create the TextGeometry can be set as a prop
    
    //----Matcap 
    //We are going to use a drei helper named useMatcapTexture that will load matcaps automatically.
    //Import it and then we are going to load that texture 
    const [matcapTexture] = useMatcapTexture('161B1F_C7E0EC_90A5B3_7B8C9B', 1024)

    //------------------- Multiple donuts
    //We are going to use map
    // const tempArray = [...Array(100)];
    // console.log(tempArray)
    // tempArray.map(()=>{
    //     console.log('value')
    // })

    //Now we get it but we have performances issues the first onw is about the geometries
    //To fix that we are going to do a silly trick
    //Create one torusGeometry outside of the donut 
    //Store it by using useState
    //Put it back on the mesh of the donuts from the state

    // const [ torusGeometry, setTorusGeometry ] = useState();
    // const [ torusMaterial, setTorusMaterial ] = useState();

    //Then create the geometry on the jsx 
    //Send the setTorusGeometry function to the ref of the torusGeometry
    //When sending a fucntion tothe ref attribute, React will call that fucntion with the component as the parameter, and thsi will save the <torusGeometry/>  inside the torusGeometry
    //Now tha we have saved the torusGeometry we can use it back to the mesh and now we have the geometry, also we can do the same to the material

    //This is working but there is another solution
    //We are going to create the geometry and the material before the Experience function using native Three.js

    //We cant use the material 
    //Since we want to apply the texture only once we are going to use  useEffect and apply it
    //It's working , but it look brighter
    //Because when you use R3F will automatically take care of the

    //---------------- Animating donuts
    //To animate the donuts we need to have acces to the donuts 
    //We are going to animate the donuts in the useFrame but this means that we need a reference to them

    //Reffering to multiple object is a bit tricky in React 
    //We are going to test two solutions
    //Using a group as a reference and then loop on the children and animate it.

    //The other solution is more complex 
    //First we need to undesrtans what is a reference, a reference is only an object with a current property containing what we want to save and keep. 
    //We are going to create a reference with its current being an empty array and add the donuts to that array ourselves
    
    //If we provide something to useRef, this will be used as default on current
    //Now to the donut <mesh> we are going to add a ref attribute but pass it a function
    //When we add the reference will put that mesh into that reference 
    //React will call the function and send the actual component as a parameter

    //But we have a mistake 
    //Every time the Experience component is rendered, donuts are added to the reference, meaning that if the component re render will push another meshes

    //To dix that we can add elements to the array at a specific position using the index of the map

    const donuts = useRef([]);

    useFrame((state, delta)=>{
        //------------------ Animating by group--------------------
        // donuts.current.rotation.y -= delta*0.02;
        // for(let donut of donuts.current.children){
            //     donut.rotation.y += delta*0.2
            //     donut.rotation.x += delta*0.2
            // }
        //------------------ Animating by reference array--------------------
        // for(let donut of donuts.current){
        //     donut.rotation.y += delta*0.2
        //     donut.visible = false;
        //     // donut.rotation.x += delta*0.2
        // }


    })


    

    useEffect(()=>{
        matcapTexture.colorSpace = THREE.SRGBColorSpace;
        matcapTexture.needsUpdate= true;
        torusMaterial.matcap = matcapTexture;
        torusMaterial.needsUpdate = true;
    }, [])

    return <>
        {/* <Perf position="top-left"/> */}

        <OrbitControls/>

        <ambientLight/> 
        <directionalLight 
            ref={directionalLight}
            position={[5, 6, 6]} 
            intensity={0.5} 
            castShadow    
            shadow-camera-near={1}
            shadow-camera-far={40}
            shadow-camera-top={10}
            shadow-camera-right={10}
            shadow-camera-bottom={ -10 }
            shadow-camera-left={ -10}
            shadow-bias = { -0.003 }
        />

        <torusGeometry args={[1, 0.6, 16, 32]}/>
        <meshMatcapMaterial matcap={matcapTexture}/>


        <Float
            speed={0.5}
            rotationIntensity={0.5}
            floatIntensity={5}
        >
            <TitleText/>
        </Float>

        <Float
            speed={0.5}
            rotationIntensity={0.5}
            floatIntensity={10}  
        >
            <DateCounter dataTimer={dataTimer}/>
        </Float>            

        <Flower visible={visible}/>
        <Bee visible={visible}/>

        <Floor/>

        {/* ----------------------------- Animating by group ------------------------------ */}
        {/* <group ref={donuts}>
            {[...Array(100)].map((value, i)=>
                <mesh 
                    key={i}
                    position={[
                        (Math.random()-0.5)*50,                
                        (Math.random())*20,               
                        (Math.random()-0.5)*50,               
                    
                    ]}
                    scale={ 0.2+Math.random()*0.5 }
                    rotation={[
                        Math.random()*Math.PI,
                        Math.random()*Math.PI,
                        0,
                    ]}
                    geometry={torusGeometry}
                    material={torusMaterial}
                >  
                </mesh>
            )}
        </group> */}

        {/* ---------------------------- Animating by reference array --------------------- */}
            {/* {[...Array(100)].map((value, i)=>
                <mesh 
                    ref={(element)=>donuts.current[i] = element}
                    key={i}
                    position={[
                        (Math.random()-0.5)*50,                
                        (Math.random())*20,               
                        (Math.random()-0.5)*50,               
                    
                    ]}
                    scale={ 0.2+Math.random()*0.5 }
                    rotation={[
                        Math.random()*Math.PI,
                        Math.random()*Math.PI,
                        0,
                    ]}
                    geometry={torusGeometry}
                    material={torusMaterial}
                >  
                </mesh>
            )} */}


        

    </>
}