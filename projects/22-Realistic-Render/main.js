import './style.css';

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

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


//Loaders

const loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = ()=>{
  console.log('Assets loaded');
  updateAllMaterials();
};
loadingManager.onProgress = (progress)=>{
  console.log(progress);
}

const textureLoader = new THREE.TextureLoader(loadingManager);
const gltfLoader = new GLTFLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

//Textures
const bricksTextures = {
  color: textureLoader.load('/textures/bricks/color.jpg'),
  arm: textureLoader.load('textures/bricks/ARM.jpg'),
  normal: textureLoader.load('/textures/bricks/normal.png'),
  displacement: textureLoader.load('textures/bricks/displacement.png'),
}
bricksTextures.color.colorSpace = THREE.SRGBColorSpace;

const woodTexture = {
  color: textureLoader.load('/textures/wood/color.jpg'),
  arm: textureLoader.load('textures/wood/ARM.jpg'),
  normal: textureLoader.load('/textures/wood/normal.png'),
  displacement: textureLoader.load('textures/wood/displacement.png'),
}
woodTexture.color.colorSpace = THREE.SRGBColorSpace;

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
camera.position.set(1.2, 0.6, 0.6)

//Renderer
const canvas = document.querySelector('.experience')
const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.width, sizes.height);

//Controls 
const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;
orbitControls.enabled = true;
orbitControls.target = new THREE.Vector3(0, 0.25, 0)

//---------------------------------- Realistic Render --------------------------------
//Sometimes, we eant a very realistic render, many things participate in a wrong looking model
//Some of the following techniques can hava a performance impact, and some depend on what you wan to display.

//First have a good environment map 

//----------------- Tone mapping
// Intends to convert the high dinamic range (HDR) values to low dinamic range (LDR) values

//Tone mapping in three.js will actually fake the process of converting LDR to HDR even if the colors aren't HDR resulting in a very realistic render
//Update the toneMapping on the WebGLRenderer

//Three.NoToneMapping (default)
//Three.LinearToneMapping //the same as no tone mapping
//Three.ReinhardToneMapping 
//Three.CineonToneMapping 
//Three.ACESFilmicToneMapping 

renderer.toneMapping = THREE.ReinhardToneMapping

const gui = new GUI()
gui.add(renderer, 'toneMapping', {

 No:THREE.NoToneMapping,
 Linear:THREE.LinearToneMapping,
 Reinhard:THREE.ReinhardToneMapping,
 Cineon:THREE.CineonToneMapping,
 ACESFilmic:THREE.ACESFilmicToneMapping,
})

//Also we can change the tone mapping exposure with the toneMappingExposure properti in renderer
renderer.toneMappingExposure = 1
gui.add(renderer, 'toneMappingExposure', 0, 5 )

//----------------- Antialiasing
//We call aliasing an artifact that might appear in some situations where we can see a stair-like effect
//Usually on the edge of the geometries
//It depends on the pixel ratio if you have a 2 pixel ratio may not notice about the aliasing so only use it when is needed
//When the rendering of a pixel occurs, it tests what geometry is being rendered in that pixel. It calculates the color, and, in the end, that color appears on the screen

//Many ways to fixing it 

//---Super Sampling (SSAA) or fullscreen sampling (FSAA)
//The idea of this is we increase the resolution twice beyond the actual one
//When resizeed to its normal- sized, each pixel color will automatically be averaged from the 4 pixels rendered, esasy but bad for performance.
//Cause we need torender 4 time more pixels.

//---Multy Sampling (MSAA)
//Automatically performed by most recent gpus
//Will check the neighbours of the pixel being rendered, if its the edge of the geometry, will mix its color with those neighbours color, only works on geometry edges.
//We can use it by but antialias true in the renderer

//const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});

//If the screens with a pixel ratio aove 1 dont really need antialias

//----------------- Shadows 
//Environment maps can't cast shadows 
//We need to add a light that roughly matches the lighting of the environment map and use it to cast shadows


const directionalLight = new THREE.DirectionalLight('#FFD580', 4)
directionalLight.position.set(0.877, 4.168, 1.223)
scene.add(directionalLight)

gui.add(directionalLight, 'intensity', 0, 10, 0.001).name('Light intensity')
gui.add(directionalLight.position, 'x', -5, 5, 0.001).name('Light X')
gui.add(directionalLight.position, 'y', -5, 5, 0.001).name('Light Y')
gui.add(directionalLight.position, 'z', -5, 5, 0.001).name('Light Z')

//Add shadows 
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

directionalLight.castShadow = true;
directionalLight.shadow.camera.left = -1.5
directionalLight.shadow.camera.right = 1.5
directionalLight.shadow.camera.top = 1
directionalLight.shadow.camera.bottom = -1

directionalLight.shadow.camera.far = 5

directionalLight.shadow.mapSize.set(1024, 1024)

gui.add(directionalLight, 'castShadow');

//Target
//Now we want to change the target 
directionalLight.target.position.set(0.5, 0.25, 0)

//const directionalLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
//scene.add(directionalLightShadowHelper);

//But is not wrking because Three.js is using matrices to define object transforms 
//When we change rpoperties like position, rotation and scale, those will be compiled into a matrix
//This processs is done right before the object is rendered and only if it's in the scene
//But the camera target is not on the scene, thats why it doesent update 
//We have two options (add the target to the scene)
//Update the matrix manually using hte updateWorldMatrix() method
directionalLight.target.updateWorldMatrix();

//Finally we can activate the cast shadows on all the Meshes using the updateAllMaterials
const updateAllMaterials = ()=>{
  scene.traverse((child)=>{
    if(child.isMesh && child.material.isMeshStandardMaterial){
      child.castShadow = true
      child.receiveShadow = true
    }
  })
}


//----------------- Physically Accurate Lighting
//Default three.js light intensity values aren't realistic
//They are based on an armitrary scale unit and don't reflect real-world values.
//It's better to use realistic values and standar values.
//To use the sntandar we can witch useLegacyLights property of the WebGLRenderer to false

//Always start the project with useLegacyLights to false.
renderer.useLegacyLights = false;

gui.add(renderer, 'useLegacyLights')

//---------------------------------------- Textures ---------------------------
//First load the textures 
//Once the textures are added, you can notice that there is something wrong with the color, they look too white.
//Thisi is because the color space
//Color space is a way to optimise how colors are being stored according the human eye sensitivity
//Mostly concerns textures that are supposed to be seen (in our case brick color textures)

//Usually pictures that contain information with colors that we are going to be able to see, are saved in SRGB color space (No linear)

//By default in three js when you load a textures is considered like linear texture so we need to change it with 
woodTexture.color.colorSpace = THREE.SRGBColorSpace;

//Why wi didn't have to do that for the model?
//This is cause the GLTF contains those information, and three.js knew what colos space to use on the textures.

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(3, 3, 200, 200),
  new THREE.MeshStandardMaterial({
    map: woodTexture.color,
    normalMap: woodTexture.normal,
    aoMap: woodTexture.arm,
    rougnessMap: woodTexture.arm,
    metalnessMap: woodTexture.arm,
    displacementMap: woodTexture.displacement,
    displacementScale: 0.05,
  })
)
const wall = new THREE.Mesh(
  new THREE.PlaneGeometry(3, 3, 200, 200),
  new THREE.MeshStandardMaterial({
    map: bricksTextures.color,
    normalMap: bricksTextures.normal,
    aoMap: bricksTextures.arm,
    rougnessMap: bricksTextures.arm,
    metalnessMap: bricksTextures .arm,
    displacementMap: bricksTextures.displacement,
    displacementScale: 0.05,
  })
)

floor.rotation.x = -Math.PI/2
floor.position.y = -0.05
wall.position.set(0, 1.45, -1.5)

scene.add(floor, wall);

//------------------------------ Shadow Acne ---------------------------------
//Shadow acne can occur on both smooth and flat surfaces for precision reason, when calculating if the surface is in the shadow or not. The objects casts a shadow on its own surface.

//When the camera renders the shadow map will  render the depth, by mini cubes or pixels
//This is not perfect and becaus it will project shadows on its own surface caused the strips in the rendering

//To fix that we can play with the normal bias and normalBias

//This are properties that can be set on the direcitonal light and are going to move the shape of the object bigger or smaller.
//Bias usually helps for flat surfaces 
//normalBias  usually helps for rounded surfaces

gui.add(directionalLight.shadow, 'bias', -0.05, 0.05, 0.001)
gui.add(directionalLight.shadow, 'normalBias', -0.05, 0.05, 0.001)

//This will make the shadow acne desappear, but moce the shadows 

//-------------------------------- There are other techniques ----------------------
//Ambient occlusion
//Depth of field
//Motion blur
//Bloom
//Fog
//Vignette
//Bokeh
//ETC.
//Many of those techniques imply using post-processing wich you'll learn in one of the later lessons
//----------------Real time environment map

const rgbeLoader = new RGBELoader(loadingManager)

rgbeLoader.load('/textures/envMap/hdri.hdr', (envMap)=>{
  console.log(envMap)
  envMap.mapping = THREE.EquirectangularReflectionMapping
  scene.background = envMap;
})




const lightDonut = new THREE.Mesh(
  new THREE.TorusGeometry(1, 0.01),
  new THREE.MeshBasicMaterial({color: new THREE.Color(10, 10, 10)})
)
scene.add(lightDonut)
gui.add(lightDonut, 'visible').name('Light ring')

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(
  256, 
  {
    type: THREE.HalfFloatType
  }
)

scene.environment = cubeRenderTarget.texture;
// scene.backgroundBlurriness = 0.07;

const cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);
cubeCamera.position.set(0, 0.25, 0)

cubeCamera.layers.set(1);
lightDonut.layers.enable(1);
floor.layers.enable(1);
wall.layers.enable(1);

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
  
  lightDonut.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI/2);

  knotTorus.scale.set(0.2, 0.2, 0.2)
  knotTorus.position.set(-0.5, 0.35 ,0)
  scene.add(knotTorus);
  
  //Scene Configuration
  lightDonut.position.y = knotTorus.position.y

//Animate
const clock = new THREE.Clock();

const tick = ()=>{
  const time = clock.getElapsedTime();
  
  //Real time environment map 
  if (lightDonut){
    lightDonut.position.y = Math.abs(Math.sin(time*0.5))
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