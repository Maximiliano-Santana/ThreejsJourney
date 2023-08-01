import './style.css';

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

import gsap from 'gsap';
import GUI from 'lil-gui';

console.time('Threejs')

//---------------------------------------- Import 3D models -------------------------------
//To create complez shapes, we better use a dedicated 3D software in the lesson.

//First we neet to talk about the 3D model formats , each one respondng to a problem
//There is a lot of formats 
//What data
//Weight
//Compression
//Compability
//Copyrights
//Etc

//Different criteria on depens your needs
//Dedicated to one software
//Almos all data but are heavy
//Very light but migh lack specific data
//Open source 
//Not open source 
//Binary
//Ascii

//You can even create your own format.

//The most popular formats are
//OBJ
//FBX
//STL
//PLY
//COLLADA
//3Ds
//GLTF

//-------------------------------------- GLTF --------------------------------------
//One format is becoming astandar and should cover the most of our needs
//GL Transmission Format 
//Made by the Khronos Group (OpenGL, WebGL, Vulkan, Collada)
//Very popular since few years

//Supports differente sets of data like geometries, materials, cameras, lights, scene graph, animations, skeletons, morphing, etc.
//Various formats like json, binary, embed textures
//Becoming the standard when it comes to real-time and most 3D softwares game engines, and libraries support it.

//To choose one format question the data you need, the weight of the file, how much time to decompress it, etc.

//GLTF file can have different formats
//Choose one of them on depend your needs, each one have features that can be a adventage from othes

//---------------------glTF
//this is kinda the default format
//Have multiple files 
    //Duck.gltf is a JSON that contains cameras, lights, scenes, materials, objects transformations, but no geometries or textures
    //Duck0.bin is a binary file that usually contains data like the geometries (vertices position, uv coordinates, colors, normals, colors, etc)
    //DuckCM.png is the texture
//We load the Duck.gltf file and the other files should load automatically

//---------------------glTF-Binary
//Only one file
//Contains all the data we talked about on binary
//Usually lighter
//Easir to load because only file
//Hard to alter its data

//---------------------glTF-Draco
// Like the glTF default format, but the buffer data is compressed using the Draco algorithm
//Is much lighter

//---------------------glTF-Embedded
//One file
//Json format
//Heavier

//------------------------------------------- How do we load the Model --------------------------
//Firs we need to use GLTFLoader and we need to import it from the examples and we can use the loading Manager to manage de loading


import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

//Then instanciate it 
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => {
    console.log('onstart')
}

loadingManager.onLoad = () =>{
    console.log('assets loaded')
}

loadingManager.onProgress = (asset) => {
  console.log('asset loaded: ' + asset)
}
loadingManager.onError = () => {
  console.log('on error')
}
  
const gltfLoader = new GLTFLoader(loadingManager)

//Use the loader like all the other loaders 

const duckGLTF = gltfLoader.load('/models/Duck/glTF/Duck.gltf', (gltf)=>{  
    // console.log(gltf)
    //scene.add(gltf.scene.children[0]) 
    //scene.add(gltf.scene.children[0].children[0]) 
    // console.log(gltf.scene) 
})

//Once is loaded we have a object with
//animations
//asset
//cameras
//parser
//scene - scene property contains everything we need
//scenes - you can expor an gltf file that contains multiple scenes 

//What we need is inside the scene, then in the children who contains an object3D and this object 3D will contain the Mesh and Perspective Camera

//The object3D have scale, rotation, position
//Important this object3D has a scale set to a small value
//Whis mean if we only add the mesh, wi will get a bigger object.

//----------------------Adding imported object in the scene -------------------------
//There are multiplle ways to get the duck on the scene.
//We can add the hole scene in ouw scene, because the holse scene is a Group of three.js.
//Add the children of the scene and ignore the perspective camera.
//Filter the children before adding to the scene.
//Add only the Mesh and end up with a duck with a wrong scale, position, and rotation
//Open the file in a 3D software, clean it and export it again.

//Add the Object3D to our scene and ignore the unused PerspectiveCamera

//scene.add(gltf.scene.children[0]) 

//----------------------------------- Binary gltf and Embedded load------------------------
//It works the same with the GLTFLoader
//To load all the stuff inside the object 3D we can use a for to loop the object
//But is not adding all stuff. this is because when you have two scenes, one the scene of your project and other just is imported. When you take one of the imported scene and put it into your scene, when you did thad the children addes got removed from the imported scene

// gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf)=>{
//     for(const child of gltf.scene.children){
//         scene.add(child)
//     }
// });

//We have two solution, the first is to take the first children of the loaded scene and add it to our scene until there is none left


// gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf)=>{
//     while(gltf.scene.children.length){
//         scene.add(gltf.scene.children[0]);
//     }
// });

//The other solution is to duplicate the children array an in order to have an unaltered independent array
//Use the spread operator ... and put the result in a brand new array [].
//this array will not remove the child when we take it to the other scene.

// gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf)=>{
//     const children = [...gltf.scene.children]
//     for(const child of children){
//         scene.add(child);
//     }
// });

//------------------------------------- Draco GLTF load --------------------------------
//Draco compression.
//When to use Draco compression? is not a win-win situation, the geometries are lighter but the user has to load the DRACOLoader class and the decoder 
//It also take time and resources for your computer to decode a compressed file, you'll have to adapt accordingly to the project.
//so DracoLoader is usefull to load much really bigg assets, but if is a small geometry, dont use it.

//The Draco version can be much lighter than the default version in this example, the draco version is 55% much lighter than the default
//Compression is applied to the buffer data (typically the geometry)
//Draco is not aexclusive to glTF but htey got popular as the same time and implementation went faster with glTF exporters.
//Google develops the algorithm under the opne-source Apache License

//If we try to add a model that uses draco compression will throw an erro (No DRACOLoader instance provided)

//So to add a Draco compressed model, we need to provide a DRACOLoader instance to ur GLTFLoader,
//First need to import the DRACOLoader
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

//Then we have to instanciate it is better if we do that before instanciate the gltf loader

const dracoLoader = new DRACOLoader(loadingManager);

//---------------------------Worker
//The decoder is also avlible in web assembly, and it can run in a worker to improve performance significatly (The worker is to manage the decoder in different threats of the cpu)

//To do that go to /node_modules/three/examples/jsm/libs/draco then copy the folder into your project

//To use workers is really easy, we just have to pass the path to the draco folder we copied to the function setDecoderPath();
dracoLoader.setDecoderPath('/draco/');

//Now provide the DRACOLoader instance to the GLTFLoader instance with setDRACOLoader(...)
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load('/models/Duck/glTF-Draco/Duck.gltf', (gltf)=>{  
    // console.log(gltf)
    //scene.add(gltf.scene)
})
//And here it is, we can still load not compressed glTF file with the GLTFLoader and the draco decoder is only loaded when needed

//------------------------------------------ Animations -----------------------------------------
//With GLT we can load animations, first load a model with animation like the fox example 

// gltfLoader.load('/models/Fox/glTF/Fox.gltf', (gltf)=>{
//     console.log(gltf)
//     gltf.scene.scale.set(0.025, 0.025, 0.025);
//     scene.add(gltf.scene)
// })

//Now how we handle the animation, its hard 
//The loaded gltf object contains a animations property composed of multiple AnimationClips
//We need to create an AnimationMixer. An AnimationMixer is like a player associated with an object that can contain one or many AnimationClips.
//Is like animation keyframes to use them and the AnimationMixer is like a player, to create a mixer we have to instanciate it inside de succes gltf loader function
let mixer = null;

gltfLoader.load('/models/Fox/glTF/Fox.gltf', (gltf)=>{
    //Create the mixer with AnimtionMixer, then provide the object where the animation will be applied 
    mixer = new THREE.AnimationMixer(gltf.scene)

    //Then you can take the animation clip and add it to the mixer, when you do it it returns what we call action inside this action you have acces to dhe play() method
    const action = mixer.clipAction(gltf.animations[2]);

    action.play()

    //Now we have to tell the Mixer to opdate utself on each frame, to do it go to the tick function, and move the mixer declaration outside of the function with a null value and update ir when te model is loaded.

    console.log(action)
    
    gltf.scene.scale.set(0.025, 0.025, 0.025);
    scene.add(gltf.scene)

})

//------------------------------------------ Three.js Editor -----------------------------------------
//Is lika a tiny online 3D software 
//Good way to test models 
//Only woeks with models composed of one file.

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('.experience')

// Scene
const scene = new THREE.Scene()

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
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
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    //Update Mixer 
    //We need to provide it the delta time
    if(mixer !== null){
        mixer.update(deltaTime)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()