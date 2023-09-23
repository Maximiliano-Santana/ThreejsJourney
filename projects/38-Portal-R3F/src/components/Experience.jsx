import { BakeShadows, Center, OrbitControls, Sparkles, shaderMaterial, useTexture, useGLTF, MeshReflectorMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import * as THREE from 'three'

import portalVS from '/src/assets/shaders/portalShader/vertex.glsl'
import portalFS from '/src/assets/shaders/portalShader/fragment.glsl'
import { useRef } from "react";

const PortalMaterial = shaderMaterial(
    {
        uTime: 0,
    },
    portalVS,
    portalFS
);

extend({PortalMaterial: PortalMaterial})

export default function Experience(){
    const {nodes, scene} = useGLTF('./models/portalModel/minecraftPortalModel.glb');

    //The model is composed by multiple parts with different materials and backed textures
    //Because of that, we are not going to add the whole model at once to the scene
    //Indead we are going to add each element separately in order to have more control of them
    //Those lements are already avalible in the nodes property of the useGLTF

    //Now we add it into a mesh and we are going to add our own material, but first we need to load the texture, we can use the useTexture helper from drei

    const backedObsidian = useTexture('./textures/backedTextures/backedObsidian.jpg');
    backedObsidian.flipY = false;    
    backedObsidian.magFilter = THREE.NearestFilter;
    backedObsidian.minFilter = THREE.NearestFilter;
    backedObsidian.generateMipmaps = false;    


    const backedGroundArch = useTexture('./textures/backedTextures/backedGroundArch.jpg');
    backedGroundArch.flipY = false;
    backedGroundArch.magFilter = THREE.NearestFilter;
    backedGroundArch.minFilter = THREE.NearestFilter;
    backedGroundArch.generateMipmaps = false;


    const backedBaseStone = useTexture('./textures/backedTextures/backedBaseStone.jpg');
    backedBaseStone.flipY = false;
    backedBaseStone.magFilter = THREE.NearestFilter;
    backedBaseStone.minFilter = THREE.NearestFilter;
    backedBaseStone.generateMipmaps = false;

    
    const backedPlants = useTexture('./textures/backedTextures/backedPlants.png');
    backedPlants.flipY = false;
    backedPlants.magFilter = THREE.NearestFilter;
    backedPlants.minFilter = THREE.NearestFilter;
    backedPlants.generateMipmaps = false;

    const lavaStillTexture = useTexture('/textures/lavaTexture/lava_still.png');
    lavaStillTexture.flipY = false;
    lavaStillTexture.minFilter = THREE.NearestFilter;
    lavaStillTexture.magFilter = THREE.NearestFilter;
    lavaStillTexture.generateMipmaps = false;
    lavaStillTexture.wrapS = THREE.RepeatWrapping;
    lavaStillTexture.wrapT = THREE.RepeatWrapping;
    lavaStillTexture.repeat.x = 1
    lavaStillTexture.repeat.y = 0.05
    lavaStillTexture.colorSpace = THREE.SRGBColorSpace;

    const lavaFlowTexture = useTexture('/textures/lavaTexture/lava_flow.png');
    lavaFlowTexture.flipY = false;
    lavaFlowTexture.minFilter = THREE.NearestFilter;
    lavaFlowTexture.magFilter = THREE.NearestFilter;
    lavaFlowTexture.generateMipmaps = false;
    lavaFlowTexture.wrapS = THREE.RepeatWrapping;
    lavaFlowTexture.wrapT = THREE.RepeatWrapping;
    lavaFlowTexture.repeat.x = 0.5
    lavaFlowTexture.repeat.y = 0.03125
    lavaFlowTexture.colorSpace = THREE.SRGBColorSpace;

    let lavaUp = true
    function animateLava() {  
        if(lavaUp){
          lavaStillTexture.offset.y+= 0.05
          lavaFlowTexture.offset.y+= 0.03125
          if(lavaStillTexture.offset.y > 0.94){
            lavaUp = false;
          }
        }else{
          lavaStillTexture.offset.y-= 0.05        
          lavaFlowTexture.offset.y+= 0.03125      
          if(lavaStillTexture.offset.y <= 0.05){
            lavaUp = true;
          }
        }
    }
    const intervalID = setInterval(animateLava,  60 * 1000 / 550);

    //--------------- Particles
    //Whis time we are going to use dre helper called Sparkles
    
    //--------------- Portal shader
    //Now we need to import the shader
    //We need to import the glsl plugin and set it in the vite config 

    //To implement it we can now use our shader on the shaderMaterial
    //Now we need to provide the uniforms 
    //To add the uniforms we  need ro ptovide it by usind the uniform prop
    //Sending an object as an usual unifroms 

    //But also we have the shaderMaterial helper

    //This creates a Shader material, that will make avalible in jsx
    //Outside of the experience function we are going to create the material and use the shaderMaterial
    //Then provide 3 parameters 
    //first the uniforms wich is a bit different, then the vertex and fragment shaders.
    //And now we have a class of the material, but we wan to use it like a tag on jsx, to conver it we are going tu use extend like we did when we implement the OrbitControls ourselves

    //And we will be able to use it
    //Whis make animating the uniforms easyli
    //First we need areference to that material
    const portalMaterial = useRef();

    //And then to animate it we are going to use useFrame
    useFrame((state, delta)=>{
        portalMaterial.current.uTime += delta
    })
    

    return <>
        <OrbitControls/>
    
        <color args={['#060c0f']} attach="background"/>
        <ambientLight/>
    
        <Center>
            <mesh geometry={nodes.Obsidian.geometry} rotation-x={Math.PI*0.5}>
                <meshBasicMaterial map={backedObsidian}/>
            </mesh>
            <mesh geometry={nodes.GroundArch.geometry} rotation-x={Math.PI*0.5}>
                <meshBasicMaterial map={backedGroundArch}/>
            </mesh>
            <mesh geometry={nodes.Plants.geometry} rotation-x={Math.PI*0.5}>
                <meshBasicMaterial map={backedPlants} side={THREE.DoubleSide} alphaTest={0.6}/>
            </mesh>
            <mesh geometry={nodes.BaseStone.geometry} rotation-x={Math.PI*0.5}>
                <meshBasicMaterial map={backedBaseStone}/>
            </mesh>
            <mesh geometry={nodes.LavaStill.geometry} rotation-x={Math.PI*0.5}>
                <meshBasicMaterial map={lavaStillTexture}/>
            </mesh>
            <mesh geometry={nodes.LavaFlow.geometry} rotation-x={Math.PI*0.5}>
                <meshBasicMaterial map={lavaFlowTexture}/>
            </mesh>
            <mesh position={[0, 7.5, 2.5]}>
                <planeGeometry args={[3, 3]}/>
                <portalMaterial ref={portalMaterial} side={THREE.DoubleSide} transparent={true}/>
            </mesh>

            <Sparkles
                size={6}
                scale={[21, 10, 21]}
                position-y={10}
                count={20}
                color={'lightgreen'}
                speed={0.75}
            />
        </Center>

    </>
}