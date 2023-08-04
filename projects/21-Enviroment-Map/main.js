import './style.css';

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


import gsap from 'gsap';
import GUI from 'lil-gui';

console.time('Threejs')

THREE.ColorManagement.enabled = false;

//Sizes 
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

//Resize

window.addEventListener('resize', ()=>{
  //Update Sizes 
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  //Update camera
  camera.aspect = sizes.width/sizes.height;
  camera.updateProjectionMatrix();
  //Update Renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//Variables

const global = {
  envMapIntensity: 1,
}



//Textures

const loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = ()=>{
  console.log('Assets loaded');
  //updateAllMaterials();
};
loadingManager.onProgress = (progress)=>{
  console.log(progress);
}

const textureLoader = new THREE.TextureLoader(loadingManager);
const gltfLoader = new GLTFLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

//Load models
let flightHelmet = null;
gltfLoader.load('/models/FlightHelmet/FlightHelmet.gltf',(gltf)=>{
  flightHelmet = gltf.scene
  flightHelmet.position.set(0.5, 0, 0)
  scene.add(flightHelmet);
});

//Load EnvMaps
let envMapTexture = cubeTextureLoader.load([
  '/textures/envMap/px.png',
  '/textures/envMap/nx.png',
  '/textures/envMap/py.png',
  '/textures/envMap/ny.png',
  '/textures/envMap/pz.png',
  '/textures/envMap/nz.png',
]);

//Scene 
const scene = new THREE.Scene();

//Camera 
const camera = new THREE.PerspectiveCamera(50, sizes.width/sizes.height, 0.1, 1000);

//Renderer
const canvas = document.querySelector('.experience')
const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.width, sizes.height);

//Controls 
const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;
orbitControls.enabled = true;

//----------------------------------- Enviroment maps --------------------------------------------------
// //First we need to load the nevMapTexture, it is a cubeTexture
// //Once we have the texture loaded, we can use it on diferent ways.

// //We can create a big cube al arround the scene and put the texture, but this is a old and bad solution
// //We can assing the environmentMap to the scene's background (after creating the environmentMap ahd the scene)

// scene.background = envMapTexture;

// //Now it looks all black
// //To solution this problem we can add the envMapTexture on the envMap of the materials

// //knotTorus.material.envMap = envMapTexture;

// //The problem is if we have a lo of objects in the scene it will be complicated to add envMap to each object
// //So to apply the environment map as lighting to the whole scene, assign it to the environment property of the scene

// scene.environment = envMapTexture;

// //We hould like to control the environment maps intensity
// //It has to be done on each material
// //To do it we are going to go though the whole scene using traverse() and apply the intensity whenever it is suitable

// //The traverse() methos is avalible on every Object3D and classes that inherit from it like Group, Mesh or even Scene.
// //We will fo it in a separated function named updateAllMaterials and call it once the model is loaded.

// //Update all materials fucntion in this function we are going to use the traverse() method
// const updateAllMaterials = ()=>{
//   scene.traverse((child)=>{
//     //We only wan to apply the environment map to the Meshes that taht have a MeshStandarMaterial
//     //To solve this we test if the material is an instance of mesh and can use the properti of the child calles isMesh 
//     if (child.isMesh && child.material instanceof THREE.MeshStandardMaterial){
//       child.material.envMapIntensity = global.envMapIntensity;
//     }
//   })
// }

const gui = new GUI()
// gui.add(global, 'envMapIntensity', 0, 5).name('EnvMap Intensity').onChange(updateAllMaterials);

// //Also we can make the background gets blurry tith the backgroundBlurriness propertie and background intensisty
// scene.backgroundBlurriness = 0.07;
// scene.backgroundIntensity = 1.5
// gui.add(scene, 'backgroundBlurriness', 0, 0.25)
// gui.add(scene, 'backgroundIntensity', 0, 3)

//--------------------------------------------- HDRI Equicrangular environment map --------------------------------
//HDR files .hdr means "High Dynamic Range" (we often say HDRI, where the i stands for image)
//Color values stored have a much higher range than a traditional image.

//Equirectangular format, that means is only one file image that contains a 360 information. 
//How do we load this hdri file, to do it, we need to use a special loader named RGBELoader
//Red Green Blue Exponent where exponent stores the brightness
//Its is the encoding for the HDR format

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

//Then we have to instanciate the rgbe Loader 

const rgbeLoader = new RGBELoader(loadingManager);

// //And now we can use it to load the hdr
// rgbeLoader.load('/textures/envMap/hdri.hdr', (envMap)=>{
//   console.log(envMap)
//   //Once we have the envMap loaded we need to tell to Three.js that it is an equirectangular pojection
//   envMap.mapping = THREE.EquirectangularReflectionMapping

//   //Finally we can add it to the scene 
//   scene.background = envMap;
//   scene.environment = envMap;
// })

//Have in mind that  the hdri is much heavier to load and render you can mitigate with a lower resolution adn blurred background.
//Thre recomendation is to use hdri only for the lightin with small resolution

//---------------------------------------------------- Ground projected environment map --------------------------------------------
// //When using an environment map as the background, the objects look like they are flying, we could create a plane bellow and try to make it look and fell like it's part of the environment map, but htere is an even beter solution, groun projected skybox.

// //this trick will not work in every env map

// //Now wee ned to import the GroundProjectedSkybox class
// import { GroundProjectedSkybox } from 'three/examples/jsm/objects/GroundProjectedSkybox.js'
// //We need to load an hdri
// rgbeLoader.load('/textures/envMap/hdri.hdr', (envMap)=>{
//   envMap.mapping = THREE.EquirectangularReflectionMapping
//   scene.environment = envMap;
//   //Instanciate the GroundProjectedSkybox
//   //The floor have to be in 0 y axes
//   const skybox = new GroundProjectedSkybox(envMap);
//   skybox.scale.setScalar(50)
//   scene.add(skybox)

//   //Also we can change the radius and height
//   gui.add(skybox, 'radius', 1, 100, 0.1).name('skybox Radius')
//   gui.add(skybox, 'height', 1, 100, 0.1).name('skybox Height')

// })

//------------------------------------------------- Real time environment map --------------------------------------------------
//How to create a dynamic environment.
//Insert the LD wood cabin environment map but only as a background
rgbeLoader.load('/textures/envMap/hdri.hdr', (envMap)=>{
  console.log(envMap)
  //Once we have the envMap loaded we need to tell to Three.js that it is an equirectangular pojection
  envMap.mapping = THREE.EquirectangularReflectionMapping

  //Then we add only as a background
  scene.background = envMap;


})

//Now we are going to create a torus that add light to the objects 

const lightDonut = new THREE.Mesh(
  new THREE.TorusGeometry(1.2, 0.05),
  new THREE.MeshBasicMaterial({color: new THREE.Color(10, 10, 10)})
)
scene.add(lightDonut)

//Now how do we add this donut to create light on the model 
//We need to use cube render target
//We are going to render the scene inside our own environment map texture and its going to be cube texture and render it on eahc fram
//We need to use a WebGLCubeRenderTarget.

//Cube render target
//It secieves the resolution for each side and object with the options
////The only property that matter here is type in wich we can choose the type of value that will be stored
//Since we want the same behavior as an HDR with a hihg range of data, we should use THREE.HalfFloatType or THREE.FloatType
//The diferent 
//float uses 32 bits to store a wide range of values 
//halfFloate wich uses 16 bits and its looks like the same 
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(
  256, 
  {
    type: THREE.HalfFloatType
  }
)

//Now we need to assign it to the environment of the scene 
scene.environment = cubeRenderTarget.texture;

//It still black cause is not render
//We need to render 6 squares textures (one texture of each face of a cube)
//To do this wee need use a the CubeCamera and then provide it near, far and the cubeRenderer instance.
const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget)
//Now we can render the texture, so go to the animation funciton and update the cube camera
//    cubeCamera.update(renderer, scene)

//Since we are using a high range texture on the render target we can make the cube color go beyond 0 to 1 rrange
//To make it brighter we can change the color go up from 1.
//{color: new THREE.Color(10, 10, 10)} 

//Now we have a bug, cause we are rendering the hole scene inside the cubreRenderTarget and we can see the knot and helmet inside the texture 
//To fix it we can use layers
//------------------------ Layers --------------------------------
//Layers work like categories and can be set on any object inheriting from Object3D (Like mesh)

//By setting layers on a camera, this camera will only see objects matching the same layers, by default every meshes of the scene have layer 0
//If a camera has its layers set to 1 and 2, it'll only see objects that have layers set to 1 or 2
//To change the layers of an object or a camera, we can use 3 methods .enable(), disable(), set(). To have objects in different layers we can use enable
//We want the cube camerato only see the donut, so lets set its layer to 1
cubeCamera.layers.set(1);
lightDonut.layers.enable(1)


//--------------------------------------------- HDRI in Blender ----------------------------------------------------
//Also we can create an envmap using blender with a camera type panoramic and panorama type Equirectangular
//Once we have rendered the scene we can save it using Alt+s, and changing thte format in Radiance HDR.

////--------------------------------------------- Using AI ----------------------------------------------------
//We can create hdri using IA, cause in blender could be harder and it might takes a lot of time 

//Lights
// const ambientLight = new THREE.AmbientLight('#ffffff', 1);
// scene.add(ambientLight)

// const sunLight = new THREE.DirectionalLight('#ffffff', 1);
// sunLight.position.set(5, 5, 1);
// scene.add(sunLight)

//Objects

const knotTorus = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 120, 20),
  new THREE.MeshStandardMaterial({
    color:'white',
    roughness: 0,
    metalness: 1,
    color: '0xaaaaaa'
  })
  );
  
  knotTorus.scale.set(0.2, 0.2, 0.2)
  knotTorus.position.set(-0.5, 0.30 ,0)
  scene.add(knotTorus);
  
  //Scene Configuration
  lightDonut.position.y = knotTorus.position.y

camera.position.set(0, 0, 5)


//Animate
const clock = new THREE.Clock();

const tick = ()=>{
  const time = clock.getElapsedTime();
  
  //Real time environment map 
  if (lightDonut){
    lightDonut.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), time*0.5);

    //Update the cube camera and send it the renderer and the scene
    cubeCamera.update(renderer, scene)

  }  


  //Controls
  orbitControls.update();
  //Render
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}

console.timeEnd('Threejs')
tick();