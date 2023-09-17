import { OrbitControls, useHelper, BakeShadows, SoftShadows, AccumulativeShadows, RandomizedLight, ContactShadows, Sky, Environment, Lightformer, Stage } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { Perf } from "r3f-perf"
import * as THREE from 'three'
import { useControls } from "leva"

export default function Experience (){

    const cube = useRef();
    const directionalLight = useRef();

    useFrame((state, delta)=>{
        cube.current.rotation.y += delta*0.1
    })

    //-----------------------------------------------Background color -----------------------------------
    //There are multiple ways to change the background color.
    //There are multiple ways to change it, any of those are viable solutions ins some very specific cases, the technique can hava a different result

    //We can set it in css.

    //By using setClearColor on renderer, to do it go to the App.jsx and create a function named created
    //Inside the attributes Canvas pass the function on the attribute namded onCreated= { created } 
    //This function will be called once the canvas is ready, to acces the renderer, inside created put the argument state and you will still have acces to it on the state.gl

    //With the scene baackground also go to canvas in the state use state, property scene.background 

    //With R3F color
    //Is a different way using 3RF, we can create the color directly in the jsx.
    //Before the Experience wi will create a color with <color args={["red"] attach="background"}/> pasing the color in the arguments and using attach so the color will add to the property we want to tach the color
    //Also we can add it inside the experience

    //--------------------------------------------- Light helpers --------------------------------------
    //We can still use helpers from drei with useHelper
    //First we need a reference to the directional light
    //When we want to use the reference to the light source and the second parameter is the helper class we want to use from three.js
    // useHelper(directionalLight, THREE.DirectionalLightHelper, 0.5);

    //-------------------------------------------- Shadows -------------------------------------------
    //We are going to start with the default shadows and then use the shadows that we have acces from r3f

    //-------------Defaut shadows
    //First we need to activate shadows on the renderer (go to cnavas) and add the attribute shadows
    //Now we need to add the castShadow and reciveShadow on objects 

    //------------ Baking
    //This is a real time backing which calculates the shadows only in the first frame and then use the same shadow maps
    //To make this we can use the helper BakeShadows from drei 

    //------------ Configurating shadows
    //We can acces on the reference or play with the attributes.
    //Is like native but instead of using "." we acces with "-"
    //shadow.mapSize
    //shadow-mapSize

    //-------------- Soft shadows
    //To get soft shwadows are many techniques, we are going to use PCSS
    //Make it is hard but fortunately we have it in drei
    //<SoftShadows/>
    //This helper will modify three.js shaders directly and each change applied o its attributes will re-compile all the shaders supporting shadows 
    //That means if we change the properties on running will be bad for performances

    //------------- AcumulativeShadows
    //Will accumulate multiple shadow renders, and we are going to move the light randomly before each render, the shadows will be composed of multiple rendersfrom various angles making it look very realistic
    //This shadows cam berendered on a plane only
    //Remove the recieveShadow on the floor
    //Now put the <AccumulativeShadows/> after the light and dont auto close
    //Are going to be on the origin, Now we need to put ir above the floor and change the scene
    //Then we need to provide lights inside it 
    //Now is making the acumulation but the light is not moving randomly for that we have the helrper names
    //RandomizedLight
    //And put it inside the accumulativeShadows
    //RandomizedLight have multiple attributes to control the behaviour of the lgiht
    //Amount: how many lights
    //radius: The aplitude of the jiggle
    //intensity: Intensity
    //Ambient: Act like if a global light was illuminating the chole scne making only tight spaces and crevices receiing shadows 
    //castShadows: if we cast shadows 
    //bias:the bias offset like for directional light shadows
    //mapSize: mapSize
    //size: the amplitude of the shadow (top, right, bottom, and left all at once)
    //near and far: how clode and ho far the shadow map camera will render
    //Also we have acces to some values on the accumulative shados like shadow colors and opacity
    //frames: how many shadows renders to do
    //temporal: spread the renders across multiple frames
    //Also have the temporal attribute wich will avoid the freeze at loading and made the accumulative dhadows spread in time 

    //---------------------- Contact shadows
    //Contact Shadows doesn't realy on the default shadows system of three.js desctive shadows on the canvas

    //Will render the whole scene, a bit like how the direcional light does, but with camera taking place of the floor onstead of the light
    //it will then blur the shadow map to make it look better
    //First import ContactShadow 
    //We can change the scale
    //Resolution
    //far

    //------------------------------------------------- Sky ------------------------
    //R3F and drei make the task very easy with the sky helper
    //Import Sky and add it

    //This class is physics-based and tries to reprouce a realistic sky according to various parameters like 
    //mieCoefficient,
    //mieDirectoinalG
    //ralleigh
    //turbidity

    //We are going only play with the position of the sun 

    //Call useConntrols 
    const { sunPosition } = useControls('sky', {
        sunPosition: {value : [1, 2, 3]}
    })

    //But this isn't the correct way, is better to use spherical coordinates
    //Create a Spherical
    //Create a Vector3
    //Use its setFromSpherical method

    //------------------------ Environment map
    //drei made the process much easier with Environment helper
    //import and we can use a traditional cube textures.
    const textureLoader = new THREE.TextureLoader();

    const { envMapIntensity } = useControls('environment map', {
        envMapIntensity: { value: 1, min: 0, max:12 }
    })

    //Drei created presets 
    //And we can tweak it by adding meshes inside the environment map and use lightformer

    //We can use the Stage helper
    //Will set an environment map, shadows, two directional lights and center the scene

    return <>
        {/* <BakeShadows/> */}
        <SoftShadows 
            frustum = {3.75}
            size={50}
            near={9.5}
            samples={17}
            rings={11}
        />
        {/* <Perf position = "top-left"/> */}

        {/* <Environment 
            // background
            ground={{
                height: 20,
                radius: 28,
                scale:50
            }}
            // preset="night"
            // files="environmentMap/hdri.hdr"
            // resolution={32}
            // files={[
            //     'environmentMap/px.png',
            //     'environmentMap/nx.png',
            //     'environmentMap/py.png',
            //     'environmentMap/ny.png',
            //     'environmentMap/pz.png',
            //     'environmentMap/nz.png',
            // ]}
        > */}
            {/* <color args={['black']} attach="background"/> */}
            {/* <mesh position-z={-5} scale={10}>
                <planeGeometry />
                <meshBasicMaterial color={[1, 0, 0]}/>
            </mesh> */}
            {/* <Lightformer 
                position-z={-5} 
                scale={10}
                color="white"    
                intensity={0.5}
                form="ring"
            /> */}
        {/* </Environment> */}

        {/* <Sky sunPosition={ sunPosition }/>

        <ambientLight intensity={0.5}/>
        <directionalLight 
            ref={directionalLight} 
            position={sunPosition} 
            castShadow 
            shadow-mapSize={[1024, 1024]}
            shadow-camera-near={1}
            shadow-camera-far={8}
            shadow-camera-top={2}
            shadow-camera-right={2}
            shadow-camera-bottom={ -2 }
            shadow-camera-left={ -2}
        /> */}

        {/* <AccumulativeShadows position={[0,-0.999, 0]} scale={10} opacity={1} frames={100} >
            <RandomizedLight
                position={[1,2,3]}
                amount={8}
                radius={1}
                ambient={0.5}
            />
        </AccumulativeShadows> */}

        {/* <ContactShadows 
            position={[0, -0.99, 0]}
            resolution={1024}
        >

        </ContactShadows> */}

        {/* <color args={['#1c1c1c']} attach="background"/> */}

        <Stage
            shadows={{
                type: 'contact',
                opacity: 1,
                blur: 1,
            }}
        >


            <OrbitControls/>
            <mesh ref={ cube } position={[-1, 1, 0]} castShadow>
                <boxGeometry/>
                <meshStandardMaterial color="darkred" envMapIntensity={envMapIntensity} roughness={0.5}/>
            </mesh>

            <mesh position={[1, 1, 0]} castShadow>
                <sphereGeometry args={[0.5, 40, 20]}/>
                <meshStandardMaterial color="mediumpurple" envMapIntensity={envMapIntensity} roughness={0}/>
            </mesh>
        </Stage>

        <mesh position={[0, 0, 0]} rotation={[ -Math.PI*0.5, 0, 0]} receiveShadow visible={false}>
            <planeGeometry args={[10, 10]}/>
            <meshStandardMaterial color="cyan" envMapIntensity={envMapIntensity}/>
        </mesh>
    </>
}