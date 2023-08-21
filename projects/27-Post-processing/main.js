import './style.css'


import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'lil-gui'




/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('.experience')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const textureLoader = new THREE.TextureLoader()

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            child.material.envMapIntensity = 2.5
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    'static/textures/environmentMaps/0/px.jpg',
    'static/textures/environmentMaps/0/nx.jpg',
    'static/textures/environmentMaps/0/py.jpg',
    'static/textures/environmentMaps/0/ny.jpg',
    'static/textures/environmentMaps/0/pz.jpg',
    'static/textures/environmentMaps/0/nz.jpg'
])

scene.background = environmentMap
scene.environment = environmentMap

/**
 * Models
 */
gltfLoader.load(
    'static/models/DamagedHelmet/glTF/DamagedHelmet.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(2, 2, 2)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)

        updateAllMaterials()
    }
)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, - 2.25)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Update Effect Composser 
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    effectComposer.setSize(sizes.width, sizes.height)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.useLegacyLights = false
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 1.5
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Creating a render target for fixing antialiasing first create a own render target and re activate the antialias by seting a 3 parametter an provide the property samples more samples mean less performances 
const renderTarget = new THREE.WebGLRenderTarget(
    800, 
    600, 
    {
        samples: renderer.getPixelRatio() === 1 ? 2 : 0,
    }
);

//----------------------------------------- Post processing --------------------------------------------
//Is about adding effects on the final image and we usually use it fo filmmaking, but we can do it in WebGL too
//It can be subtle to improve hte image slightly or to create huge effects
//Can be used for made
//Depth of field
//Bloom
//God Ray
//Motion blur 
//Glitched effect
//Outlines
//Color variations
//Antialiasing 
//Reflections and refractions 
//Etc.

// ----------------- Doing post processing 
//Is hard, first we ned a render target
//Instead of rendering in the canvas, we do it in a render target (or 'buffer') it's like rendering in a texture to be used later called render target, and we will draw the same thing of the scene inside the render target, and then you create a new scene with a camera and a plane, the camera is facing that plane perfectly and this plane will take this texture of the render target texture and put it ond that plane, this is not an ordinary material, this will be a shader material, and we are going to add effect in the fragment shader. Then the camera with the new camer we will render that plane with the shader effect added and put it on the screen, also you can add multiple steps. In thee.js those effects are called 'passes'

//Ping pong buffering
//We can do multiple passes, so we can add more passes, 
//the problem is when you want to add pultiple passes we need an other render target and once we do the first passes we are going to use the same camera and plane and add the texture buffer or render target with the new passes. At the last one passes we can draw it in the screen

//Fortunateley we don't have to do it on our own, we are going to use the EffectComposer class
//For performances is better to add all on one pass

//--------------------------- Effect composer
//To use effect composer class we need to import it
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'

//As the first pass, we usually start from a render of the scene Import the renderPass
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'

//Now we need to instantiate 
//The Effect composer need a renderer and a render target, the render target will be created automatically
//And provide a size and a pixel ratio
const effectComposer = new EffectComposer(renderer, renderTarget);
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
effectComposer.setSize(sizes.width, sizes.height)

//then we need to instantiate it the render pass and provide the scene and the camera
const renderPass = new RenderPass(scene, camera); 

//To add a pass to the effectComposer is easy, we need to do 
effectComposer.addPass(renderPass);
//We still using the clasic renderer is because in the tick function we need to remove it and do 
//effectComposer.render();
//And now is working, its time to add passes we can use passe that already created 
//https://threejs.org/docs/index.html?q=effect#examples/en/postprocessing/EffectComposer
//Also we can create a own 
//------------------------------------------------------------ Adding Passes -------------------------------------------------------------------

//---------------- Dot screen pass
//First we need to import the pass
import {DotScreenPass} from 'three/examples/jsm/postprocessing/DotScreenPass.js'

const dotScreenPass = new DotScreenPass();

effectComposer.addPass(dotScreenPass)

//You can deactivate a pass with enabled = false

dotScreenPass.enabled = false;

//------------------ Glitch pass
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js'

const glitchPass = new GlitchPass();
effectComposer.addPass(glitchPass)
//glitchPass.enabled = false;

//Some passes have editable properties 
//Change the goWild property to true 
glitchPass.goWild = false
glitchPass.enabled = false

//-------------------- RGBShift pass 
//This will be offset the rgb, this will be only avalible as a shader so you find it in 
//To use it we need to use a ShaderPass is pass that you have to provide it a shader

import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'

//And then you can use it with instantiate it and provide the shader imported
const rgbShiftPass = new ShaderPass(RGBShiftShader);
effectComposer.addPass(rgbShiftPass);
rgbShiftPass.enabled = false;

//-------------------- Unreal bloom pass
//This have parametters
//Strength: How strong is the glow
//radius: How fat that bightness can spread
//Threshold: At what luminosity limit things start to glow

import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

const unrealBloomPass = new UnrealBloomPass();
unrealBloomPass.strength = 0.3
unrealBloomPass.radius = 1
unrealBloomPass.threshold = 0.6

gui.add(unrealBloomPass, 'enabled');
gui.add(unrealBloomPass, 'strength', 0, 2, 0.01);
gui.add(unrealBloomPass, 'radius', 0, 2, 0.01);
gui.add(unrealBloomPass, 'threshold', 0, 2, 0.01);

effectComposer.addPass(unrealBloomPass);

//------------------------------------------------------------ Creating our own passes -------------------------------------------------------------------
//Creating a pass it's like creating our own shader. We have to provide a vertex shader, a fragment shader and some uniforms 

//Create a shader wich is an object with properties 
//Uniforms, vertexShader, fragmentShader.

//Is like a shader not a rawShader

//We are just adding a plane in front of the cammera and adding a color
//What we whant is to get the texture from the previous pass
//The Pass will bee automatically added by affectComposer as the tDiffuse uniform

//We are going to send a uTint uniform to control the tint

//--------------------- Tint shader

const tintShader = {
    uniforms: {
        tDiffuse: { value: null },
        uTint: { value: null }
    },
    vertexShader: `
        varying vec2 vUv;
        uniform vec3 uTint;

        void main (){
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        
            vUv = uv;
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec3 uTint;

        varying vec2 vUv;


        void main (){
            vec4 color = texture2D(tDiffuse, vUv);
            color.rgb += uTint;
            gl_FragColor = color;
        }
    `,
}
const tintPass = new ShaderPass(tintShader)
tintPass.material.uniforms.uTint.value = new THREE.Vector3(0, 0, 0);
effectComposer.addPass(tintPass);

gui.add(tintPass.material.uniforms.uTint.value, 'x', 0, 2).name('red tint')
gui.add(tintPass.material.uniforms.uTint.value, 'y', 0, 2).name('green tint')
gui.add(tintPass.material.uniforms.uTint.value, 'z', 0, 2).name('blue tint')


//------------------------- Displacement pass
const displacementShader = {
    uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 }
    },
    vertexShader:`
        uniform float uTime;
    
        varying vec2 vUv;



        void main (){
            

            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        
            vUv = uv;
        }    
    `,
    fragmentShader:`
        uniform sampler2D tDiffuse;
        uniform float uTime;

        varying vec2 vUv;
        

        void main (){
            vec2 newUv = vec2(
                vUv.x,
                vUv.y + sin(vUv.x * 10.0 + uTime) * 0.1
            );

            vec4 color = texture2D(tDiffuse, newUv);
            gl_FragColor = color;
        }
    `
}
const displacementPass = new ShaderPass(displacementShader);
effectComposer.addPass(displacementPass);

// ----------------------------------------- Displacement with normal texture


const bumpShader = {
    uniforms: {
        tDiffuse: { value: null },
        uNormalMap: { value: null },
    },
    vertexShader: `
        varying vec2 vUv;

        void main (){
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        
            vUv = uv;
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform sampler2D uNormalMap;

        varying vec2 vUv;

        void main () {
            vec3 normalColor = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;

            vec2 newUv = vUv + normalColor.xy * 0.2;

            vec3 lightDirection = normalize(vec3(-1.0, 1.0, 0.0));
            float lightness = clamp(dot(normalColor, lightDirection), 0.0, 1.0);

            vec4 color = texture2D(tDiffuse, newUv);

            color.rgb += lightness * 1.0;

            gl_FragColor = color;
        } 
    `
}

const bumpPass = new ShaderPass(bumpShader);
bumpPass.material.uniforms.uNormalMap.value = textureLoader.load('/static/textures/interfaceNormalMap.png');
effectComposer.addPass(bumpPass);

//-------------------------------------------------------- Fixing anti aliasing --------------------------------------------------------------
//The antialising isn't working to see it, maje sure to have one more pass than the render pass
//Effect composer is uding a render target without the antialiad
//We have many solutions
//Say goodbye to antialias 
//Provide our own render target on wich we add the antialias, but that won't work on all the modern browsers
//Use a pass to do the antialias but with lesse performances and a slightly different result
//A combination of the two previous of the two previous options where we test if the browser supports the antialias on the render target, and if not, we use an antialias pass

//----------------------------- Adding the antialias to the render target 
//By default Effect Composser is using a WebGLRenderTarget without the antialias 
//Fortunately we can provide our own WebGLRenderTarget
//At first, we are goint to provide the same one and then add the antialias and provide our own render target
//Use

// //Creating a render target for fixing antialiasing first create a own render target and re activate the antialias by seting a 3 parametter an provide the property samples more samples mean less performances 
// const renderTarget = new THREE.WebGLRenderTarget(
//     800, 
//     600, 
//     {
//         samples: 2,
//     }
// );

// If the user has a pixel ratio above 1, the pixel density is gigh enough to not be able to distinguish th ealising
//We don't really need an antialias and we should let the samples property to there is a easy solution by using

//samples: renderer.getPixelRatio() === 1 ? 2 : 0

//But this won't work on all modern browsers

//--------------------------------Using an antialiass pass

//We have acces to many different anti alias 
//FXAA: Performant, but the result is just "ok" and can be blurry
//SMAA: Usually better than FXAA but less performant -not to be confused with MSAA (Set pixel morefological antialias)
//SSAA: (super sampling antialias) Bewst quality but the worst performance (the render is twice big)
//TAA: Performant but limited result (Temper anti alias)

//So how do we use that

//First import the SMAAPass, instantiate it and add it to effectComposer 

//This pass should be after the gamma correction pass SMAA needs the final colors to work

// import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';

// const smaaPass = new SMAAPass();
// effectComposer.addPass(smaaPass);

//----------------------------------- Using both solutions
//The anti alias pass is not the better solution and have performances issues but we can combine the two solutions, so we can use adding the antialias to the render target and if the samples property isn't supported (The brower is using WebGL 1), it'll be ignores
//We need to test if the user has a pixel ratio to 1 and if he doesn't support WebGL 2
//If so, we add the SMAAPass
//To tes if the browser supports WebGL 2 we can use the capabilities property of the renderer
//console.log(renderer.capabilities)
// if(renderer.getPixelRatio()=== 1 && !renderer.capabilities.isWebGL2){
    // import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
    
    // const smaaPass = new SMAAPass();
    // effectComposer.addPass(smaaPass);
// }


//------------------------------------------------------ Gamma Correction Shader Pass ----------------------------------------------------------
//since we are using EffectComposer, the colors are darker
//The renderer.outputEncoding = THREE.sRGBEEncoding doesn't woek anymore becase we are rendering inside render target and those render  targets doesn't support encoding
//Since other version, the outputEncoding has been replaces by outputColorSpace = THREE.SRGBColorSpace
//The EffectComposer doesn't support the encoding but we can add a pass that will dix the color
//This pass is namd GammaCorrectionShader and it will converter the linear ecoding to a sRGB encoding

import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'

const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
effectComposer.addPass(gammaCorrectionPass);
gammaCorrectionPass.enabled = true;

//-------------------------------------------------------- Handle the resizeing -----------------------------------------------------------------
//We have to add the resize to the effectComposser, cause we already handling the resize of the renderer but not of the effectComposser
//We can do easyli update the effect composer inside the resize function

//--------------------- Antialias pass

import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';

if(renderer.getPixelRatio()=== 1 && !renderer.capabilities.isWebGL2){
    const smaaPass = new SMAAPass();
    effectComposer.addPass(smaaPass);
    //console.log('using smaa');
}
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Update postprocessing
    displacementPass.material.uniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update()

    // Render
    effectComposer.render();

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()