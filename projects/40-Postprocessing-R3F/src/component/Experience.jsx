import { OrbitControls } from "@react-three/drei"
import { EffectComposer, Vignette, Glitch, Noise, Bloom, DepthOfField, SSR } from "@react-three/postprocessing"
import { BlendFunction, GlitchMode } from 'postprocessing'
import { useControls } from "leva"
import { useRef } from "react"
import { Perf } from "r3f-perf"

import Drunk from "./Drunk"

export default function Experience(){

    //----------------- Post processing
    //Before we added passes each pass had its own code and was completing one or multiple renders, then the next pass would do the same
    //After vaious passes this will made performances issues.

    //--------------- New solution Post Processing (nothing to do with R3F)
    // This is an alternative solution to the native post processing of three.js
    //Wich will merge the various passes into the least number of passes possible
    //We talk about "effects"
    //The effect will be merged together into one or multiple passes, automatically while keeping the order in wich we added them
    //We can even choose the blending of each effect
    //R3F implement it as @react-three/postprocessing

    //To implement that we are going to need 2 dependencies
    //@react-three/postprocessing
    //posrtprocessing
    //But for now the only one we need to install is the r3f, since this dependency will also install postprocessing

    //In the experience we will import EffectComposer from r3f-posrprocessing
    //We just add the tag on the jsx
    //Might see a bug on the color because EffectComposer rendering the scene with MeshNormalMaterial for later use in the effect
    //It'll automatically disappear once you add effects and you can ignore it

    //Is better to put everythin in different component
    //Developers call it Effect

    //Adding effects is as simple as importing it and adding in to the EffectComposet
    //We don't even need to add the first render

    //-------------- Multisampling
    //Is a prop to prevent the aliasing effect
    //By default its value is at 8 and we can lower it down to 0, in order to disable it completely with the multisamppling prop

    //------------- Finding effects and how to implement them
    //Look at the documentation for more information on library postprocessing and the one for drei repository
    //https://github.com/pmndrs/postprocessing
    //https://docs.pmnd.rs/react-postprocessing/effect-composer

    //---- Vignette effect
    //Lets start add the effects
    //Import Vignatter from react-three-postrprocessing
    //Those can be controlled using props

    //---------- Blending
    //The blendFunction is a prop avalible for all effects. It's how the color of what we  are drawing merges with what's behind
    //We can controll that 
    //The default blending is normal, and it simply draws the effect on top of the previous one

    //To change it we need to get the list of blending from postprocessing
    //We can import it with BlendFunction but this is bad.
    //We need to add postprocessing by our own
    //Finding the right onw is hard but with de debug io its much easier and you can go trhough 

    //---Glitch effect
    //Glitch have a prop mode but the values are stored in the GlichMode object wich is avalible in postprocessing

    //--- Noise 

    //--- Bloom
    //ItMake objects glow only when their color channels go beyond 1
    //There aree multiple solutions, butfirst we bust fix a limitation
    //A tone mapping is applied by default and it'll clamp the colors between 0 and 1

    //We are going ro deactivate the tonemapping on the objects that are glowing with tomeMapped false as a prop on the materials
    //And go the colors go above 1
    //This is desapointing  but its working
    //Just need to activate mipmapBlur
    //Will use the same mipmapping used fortextures
    //Smaller resolution of the render will be combined into a bloom texture that is then added to the initial render it looks frat with good performance

    //We can swith to mesh basic material or standar material
    //The mesh standar material have the Emissive properties wich we can use 

    //luminanceThreshold is the color limit ofeverything start glow


    //----------------- Screen Space Reflection
    //Will try to calculate reflection in objects on depend the materials and positons
    //Improt it form react postprocessin as SSR

    const ssrProps = useControls({
        temporalResolve: true,
        STRETCH_MISSED_RAYS: true,
        USE_MRT: true,
        USE_NORMALMAP: true,
        USE_ROUGHNESSMAP: true,
        ENABLE_JITTERING: true,
        ENABLE_BLUR: true,
        temporalResolveMix: { value: 0.9, min: 0, max: 1 },
        temporalResolveCorrectionMix: { value: 0.25, min: 0, max: 1 },
        maxSamples: { value: 0, min: 0, max: 1 },
        resolutionScale: { value: 1, min: 0, max: 1 },
        blurMix: { value: 0.5, min: 0, max: 1 },
        blurKernelSize: { value: 8, min: 0, max: 8 },
        blurSharpness: { value: 0.5, min: 0, max: 1 },
        rayStep: { value: 0.3, min: 0, max: 1 },
        intensity: { value: 1, min: 0, max: 5 },
        maxRoughness: { value: 0.1, min: 0, max: 1 },
        jitter: { value: 0.7, min: 0, max: 5 },
        jitterSpread: { value: 0.45, min: 0, max: 1 },
        jitterRough: { value: 0.1, min: 0, max: 1 },
        roughnessFadeOut: { value: 1, min: 0, max: 1 },
        rayFadeOut: { value: 0, min: 0, max: 1 },
        MAX_STEPS: { value: 20, min: 0, max: 20 },
        NUM_BINARY_SEARCH_STEPS: { value: 5, min: 0, max: 10 },
        maxDepthDifference: { value: 3, min: 0, max: 10 },
        maxDepth: { value: 1, min: 0, max: 1 },
        thickness: { value: 10, min: 0, max: 10 },
        ior: { value: 1.45, min: 0, max: 2 }   
    })

    //---------------------------------------------- Custom effect
    //To do it is hard, first we need to create the effect for Post Processing and then make it avlible in R3F
    //Because Posr Processing is merging the effects into one shader,we need to follow very specific rules 

    //We are going to put the files on the src folder and write the shader inside the JavaScript
    //For a more complex project you should organise a bit more.

    //------------------------ Creating a basic effect
    // First we need tu create a js and export a class, theen we will extend the Effect class from posrprocessing in order to implement most of what the effect needs

    //Post processing will take our shader and the will merge it with other shaders 
    //Our shader can be implemented in a function that must be named mainImage, retrun void and have thw following very specific parameters
    
    //Go to Drunk effect to learn

    //----------- Implementing on Drunk.jsx
    //To implement the effect on React go to Drunk.js

    //--------------------  Reference and controls
    //At first time our component doesn't suppor references

    //To make this support it we should use forwardRef from react insiide the Drunk component
    
    const drunkRef = useRef();

    const drunkProps = useControls('Drunk Effect', {
        frequency: { value: 10, min: 2, max: 20},
        amplitude: { value: 0.1, min: 0, max: 1 }
    })

    //------------------ Blending the color with BlendFunction
    //This Effect is nos using the blending 
    //Until now we multiplied the inputColor by a green color but we can also let the developer decide on a preferred blending

    //Fot this send in the  fragmentShader, send the green color directly in the output color and keep the alpha from the input color

    //---------------- Animating
    //go to Drunk Effect to make it


    return <>
        <Perf position="top-left"/>
        <EffectComposer multisampling={4}>
            {/* <Vignette
                // ref={vignette}
                offset={0.2}
                darkness={1}
                blendFunction={ BlendFunction.NORMAL }
            />
            <Glitch
                strength={[ 0.2, 0.4 ]}
                delay={[0.1, 0.5]}
                duration={[0.2, 0.5]}
                mode={GlitchMode.CONSTANT_WILD}
            />
            <Noise 
                blendFunction={BlendFunction.SOFT_LIGHT}
                premultiply
            />
            <Bloom 
                mipmapBlur  
                intensity={0.2}
                luminanceThreshold={0}
            />
            
            <DepthOfField 
                focusDistance={0.0025}
                focalLength={0.025}
                bokehScale={10}
            /> */}
            {/* <SSR {...ssrProps}/> */}
            <Drunk
                ref={drunkRef}
                { ...drunkProps }

            />
        </EffectComposer>

        <OrbitControls makeDefault />

        <color args={['#1b1b1b']} attach="background"/>
        <directionalLight position={ [ 1, 2, 3 ] } intensity={ 1.5 } />
        <ambientLight intensity={ 1 } />



        <mesh position-x={ - 2 }>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
        </mesh>

        <mesh position-x={ 2 } scale={ 1.5 }>
            <boxGeometry />
            <meshStandardMaterial color="lightpurple" />
        </mesh>

        <mesh position-y={ - 1 } rotation-x={ - Math.PI * 0.5 } scale={ 10 }>
            <planeGeometry />
            <meshStandardMaterial color="greenyellow" metalness={0} roughness={0}/>
        </mesh>
    </>
}