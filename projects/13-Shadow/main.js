import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'
import GUI from 'lil-gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';



console.time('Threejs');
THREE.ColorManagement.enabled = false

//-----------Sizes 
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

//-----------Resize

window.addEventListener('resize', ()=>{
  //update sizes 
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  //update camera
  camera.aspect = sizes.width/sizes.height
  camera.updateProjectionMatrix();
  //update rendere
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

//-----------Textures
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader();

//Fullscreen
// window.addEventListener('dblclick', ()=>{

//   const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;

//   if (!fullscreenElement){
//     if (canvas.requestFullscreen){
//       canvas.requestFullscreen();
//     } else if (canvas.webkitFullscreenElement){
//       canvas.webkitFullscreenElement();
//     }
//   } else {
//     if (document.exitFullscreen){
//       document.exitFullscreen();
//     } else if (document.webkitFullscreenElement){
//       document.webkitFullscreenElement();
//     }
//   }
// })

//-----------Scene 
const scene = new THREE.Scene();

//-----------Camera 
const camera = new THREE.PerspectiveCamera(50, sizes.width/sizes.height, 0.1, 100);
camera.position.set(-3, 2, 9);

//-----------Renderer
const canvas = document.querySelector('.experience');
const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

renderer.shadowMap.enabled = true;
renderer.shadowMap.needsUpdate = true;


//renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//-----------controls 
const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;
orbitControls.enabled = true;

//-----------Lights
const ambientLight = new THREE.AmbientLight('0xffffff', 0.5);
ambientLight.visible = false;

const hemisphereLight = new THREE.HemisphereLight('0xffffff', '0xffffff', 1);
hemisphereLight.visible = false;

const rectAreaLight = new THREE.RectAreaLight('0xffffff', 10, 2, 2);
rectAreaLight.position.z = 5;
rectAreaLight.visible = false;

const directionalLight = new THREE.DirectionalLight('0xffffff', 1);
directionalLight.position.set(0, 2, 0);
directionalLight.castShadow = true;
directionalLight.visible = false;

const pointLight = new THREE.PointLight('0xffffff', 1);
pointLight.castShadow = true;
pointLight.visible = false;


const spotLight = new THREE.SpotLight('0xffffff', 1, 10, Math.PI/5, 0.25, 1);
spotLight.position.set(0, 4, 0)
spotLight.target.position.x = 0;
spotLight.target.position.y = -1;
spotLight.visible = false;
spotLight.castShadow = true;
scene.add(spotLight.target);

scene.add(ambientLight, directionalLight, hemisphereLight, pointLight, rectAreaLight, spotLight);

//Light helpers
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2);
hemisphereLightHelper.visible = false;

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
directionalLightHelper.visible = false;

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
pointLightHelper.visible = false;

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
spotLightHelper.visible = false;

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
rectAreaLightHelper.visible = false;

scene.add(hemisphereLightHelper, directionalLightHelper, pointLightHelper, spotLightHelper, rectAreaLightHelper);

//-------------------------------------------Shadow map optimization-------------------------------------------------------
//We can acces to the shadow property of each light, there we can find shadow map sizes (resolution), 

//While changing shadow map size we want to use power of 2 (a number that can be divided by two like mipmaping optimization)
//console.log(spotLight.shadow)

//Directional Light
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;

function updateDirecionalLightShadowMapSize (size){
  directionalLight.shadow.mapSize.width = size;
  directionalLight.shadow.mapSize.height = size;
}

//Point Light
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;

function updatePointLightShadowMapSize (size){
  pointLight.shadow.mapSize.width = size;
  pointLight.shadow.mapSize.height = size;
}

//Spot Light
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;

function updateSpotLightShadowMapSize (size){
  spotLight.shadow.mapSize.width = size;
  spotLight.shadow.mapSize.height = size;
}




//Because shadow map is a render, we have control to the Near and Far and we can have acces to the camera of that render with (light).shadow.camera
//We can use the near and the far only to the necesary,
// console.log(spotLight.shadow.camera);
// console.log(pointLight.shadow.camera);

//Near and Far Shadow Camera

//Directional light near and far
directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 15;

//point light near and far
//pointLight.shadow.camera.far = 10;

//Spot light near and far
spotLight.shadow.camera.far = 10;

//Aplitude 

//Also we can reduce the aplitude of the shadows camera 
//The smaller the values, the more precise the shadows will be more details. 
//It its to small, the shadows will be cropped
//Directional light amplitude
directionalLight.shadow.camera.top = 5
directionalLight.shadow.camera.right = 5
directionalLight.shadow.camera.bottom = -5
directionalLight.shadow.camera.left = -5

function updateDirectionalLightCameraAmplitude (amplitude){
  directionalLight.shadow.camera.top = amplitude
  directionalLight.shadow.camera.right = ambientLight
  directionalLight.shadow.camera.bottom = -amplitude
  directionalLight.shadow.camera.left = -amplitude
}

//Point light amplitude
//Point light amplitude can't be modified cause it works different with 6 renders

//Spot light amplitude

spotLight.shadow.radius = 5;


//Blur 
directionalLight.shadow.radius = 5;

//to help us debug, we can use a CameraHelper with the camera used for the shadow map located in the ligh source
//to implement we neet to use 

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
directionalLightCameraHelper.visible = false;

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
spotLightCameraHelper.visible = false;

//The camera helper seems to be a perspective camera facing down, three js uses a pesprective camera but in all 6 direction and finishes downward
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
pointLightCameraHelper.visible = false;

scene.add(pointLightCameraHelper, spotLightCameraHelper, directionalLightCameraHelper);



//-----------Objects
//Geometries
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const planeGeometry = new THREE.PlaneGeometry(10,10);
const sphereGeometry = new THREE.SphereGeometry(1)
const torusGeometry = new THREE.TorusGeometry(0.75, 0.25);

//Materials
const whiteMaterial = new THREE.MeshStandardMaterial({roughness:0});

//Meshes
const cubeMesh = new THREE.Mesh(cubeGeometry, whiteMaterial);
const planeMesh = new THREE.Mesh(planeGeometry, whiteMaterial);
const sphereMesh = new THREE.Mesh(sphereGeometry, whiteMaterial);
const torusMesh = new THREE.Mesh(torusGeometry, whiteMaterial);



planeMesh.rotation.x = -Math.PI/2;
planeMesh.position.y = -2

sphereMesh.position.x = -2.5;
torusMesh.position.x = 2.5;

pointLight.position.set(5, 5, 5)

scene.add(cubeMesh, planeMesh, sphereMesh, torusMesh);

//----------------------------------------------Add shadows to objects-------------------------------------------------
//The dark shadow in the back of the objects are called core shadows, what we are missing are the drip shadows 
//Shadows have been always a challenge on real time 3D rendering, and developers must fins tricks to display realistic shadows at a reasonable framerate, three js has a solution. 
//How it works, when you do one render, three js will do a render for each light supporting shadows
//Those render wil simulate what the light sees as if it was a camera 
//During these lights renders a MeshDepthMaterial replacs all meshes
//Thre lights render are stored as textures and we call thos shadow maps 
//Thre are then used on every material supposed to recive shadow and project on the geometry

//To activate shadows you have to check your renderer and enable the shadow maps 
//renderer.shadowMap.enabled = true;

//Then you go through each object (Meshes) and decide if it can cast a shadow with castShadow and if it can recieve shadow with reciveShadow properties
planeMesh.receiveShadow = true;

cubeMesh.castShadow = true;
cubeMesh.receiveShadow = true;

sphereMesh.castShadow = true;
sphereMesh.receiveShadow = true;

torusMesh.castShadow = true;
torusMesh.receiveShadow = true;

//Once the shadows on the meshes are activated we have to activate shadows on the lights with castShadow (make the shadow maps for each resource of light)
//Only 3 types of lights support shadows.
//PointLight, DirectionalLight and SpotLight.

// directionalLight.castShadow = true;
// pointLight.castShadow = true;
// spotLight.castShadow = true;

//-----------GUI

const gui = new GUI();

const lightsGui = gui.addFolder('Lights');
//lightsGui.close();


//Ambient Light Folder
const ambientLightGui = lightsGui.addFolder('Ambient Light').close();

ambientLightGui.add (ambientLight, 'visible')
ambientLightGui.add(ambientLight, 'intensity', 0, 2, 0.1)
ambientLightGui .addColor(ambientLight, 'color')

//Hemisphere Light Folder

const hemisphereLightGui = lightsGui.addFolder('Hemisphere Light').close().onChange(()=>{
  hemisphereLightHelper.update();
});

hemisphereLightGui.add(hemisphereLight, 'visible');
hemisphereLightGui.add(hemisphereLight, 'intensity', 0, 3)
hemisphereLightGui.addColor(hemisphereLight, 'color').name('Sky color');
hemisphereLightGui.addColor(hemisphereLight, 'groundColor').name('Ground color')
hemisphereLightGui.add(hemisphereLightHelper, 'visible').name('helper');

//Rect Area Light Folder
const rectAreaLightGui = lightsGui.addFolder('Rect Area Light').close().onChange(()=>{
  rectAreaLight.lookAt(cubeMesh.position);
});
rectAreaLightGui.add(rectAreaLight, 'visible');
rectAreaLightGui.add(rectAreaLight, 'intensity', 0, 10);
rectAreaLightGui.addColor(rectAreaLight, 'color');
rectAreaLightGui.add(rectAreaLightHelper, 'visible').name('helper');


//Rect Area Light Position Folder
const rectAreaLightPositionGui = rectAreaLightGui.addFolder('Position').close();

rectAreaLightPositionGui.add(rectAreaLight.position, 'x', - 5, 5).name('Position X');
rectAreaLightPositionGui.add(rectAreaLight.position, 'y', -1, 5).name('Position Y');
rectAreaLightPositionGui.add(rectAreaLight.position, 'z', - 5, 5).name('Position Z');

//Rect Area Light Size Folder

const rectAreaLightSizeGui = rectAreaLightGui.addFolder('Size').close();

rectAreaLightSizeGui.add(rectAreaLight, 'width', 0, 10);
rectAreaLightSizeGui.add(rectAreaLight, 'height', 0, 10);


//Directional Light Folder
const directionalLightGui = lightsGui.addFolder('Directional Light').close();

directionalLightGui.add(directionalLight, 'visible');
directionalLightGui.add(directionalLight, 'intensity', 0, 4);
directionalLightGui.addColor(directionalLight, 'color');
directionalLightGui.add(directionalLightHelper, 'visible').name('helper');

//Directional Light Position Folder
const directionalLightPositionGui = directionalLightGui.addFolder('Position').close().onChange(()=>{
  directionalLightHelper.update();
})

directionalLightPositionGui.add(directionalLight.position, 'x', -7, 7, 0.01).name('position X');
directionalLightPositionGui.add(directionalLight.position, 'y', -1.5, 8, 0.01).name('position Y');
directionalLightPositionGui.add(directionalLight.position, 'z', -7, 7, 0.01).name('position Z');

//Directional Light Shadow Folder

//Debug for work resize shadows ------------------------------------------------------------------------------
// directionalLight.visible = true;

// console.log(renderer.render)

// var newCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(newCameraHelper);

// const createCameraHelper = {
//   cameraHelper:()=>{
//     console.log(directionalLight.shadow.camera)
//     var newCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
//     scene.add(newCameraHelper);
//   }
// }
//directionalLightShadowGui.add(createCameraHelper, 'cameraHelper');

//--------------------------------------------------------------------------------------------------------------
const directionalLightShadowGui = directionalLightGui.addFolder('Shadows').close();

directionalLightShadowGui.add(directionalLight, 'castShadow').name('Cast Shadow');
directionalLightShadowGui.add(directionalLight.shadow, 'radius', 1, 20, 0.1);
directionalLightShadowGui.add(directionalLight.shadow.mapSize, 'x',  120, 1024, 2).name('ShadowMap Size').onChange((size)=>{
  updateDirecionalLightShadowMapSize(size);
});
directionalLightShadowGui.add(directionalLightCameraHelper, 'visible').name('Shadow Camera Helper');
// directionalLightShadowGui.add(directionalLight.shadow.camera,  'top', 0.1, 5, 0.01).name('Shadow Camera Amplitude').onChange((amplitude)=>{
//   updateDirectionalLightCameraAmplitude(amplitude);
//   renderer.shadowMap.needsUpdate = true;
//   renderer.shadowMap.autoUpdate = true;
//   console.log(directionalLight.shadow.camera.left);
// });


//Point Light Folder

const pointLightGui = lightsGui.addFolder('Point Light').close();

pointLightGui.add(pointLight, 'visible');
pointLightGui.add(pointLight, 'intensity', 0, 3, 0.1);
pointLightGui.add(pointLight, 'distance', 0, 100);
pointLightGui.add(pointLight, 'decay', 0, 10);
pointLightGui.addColor(pointLight, 'color');
pointLightGui.add(pointLightHelper, 'visible').name('helper');


//Point Light Position Folder
const pointLightPositionGui = pointLightGui.addFolder('Position').close();

pointLightPositionGui.add(pointLight.position, 'x', -7, 7, 0.01).name('position X');
pointLightPositionGui.add(pointLight.position, 'y', -1.5, 10, 0.01).name('position Y');
pointLightPositionGui.add(pointLight.position, 'z', -7, 7, 0.01).name('position Z');

//Point Light Shadow Folder
const pointLightShadowGui = pointLightGui.addFolder('Shadow').close();

pointLightShadowGui.add(pointLight, 'castShadow');
pointLightShadowGui.add(pointLight.shadow, 'radius', 0, 10);
pointLightShadowGui.add(pointLightCameraHelper, 'visible').name('Shadow Camera Helper');


//Spot Light Folder
const spotLightGui = lightsGui.addFolder('Spot Light').close().onChange(()=>{
  spotLightHelper.update();
});

spotLightGui.add(spotLight, 'visible');
spotLightGui.add(spotLight, 'intensity', 0, 5);
spotLightGui.add(spotLight, 'distance', 0, 20);
spotLightGui.add(spotLight, 'angle', 0, Math.PI);
spotLightGui.add(spotLight, 'penumbra', 0, 1);
spotLightGui.add(spotLight, 'decay', 0, 5);
spotLightGui.addColor(spotLight, 'color');
spotLightGui.add(spotLightHelper, 'visible').name('helper');


//Spot Light Position Folder

const spotLightPositionGui = spotLightGui.addFolder('Position').close();
spotLightPositionGui.add(spotLight.position, 'x', -5, 5).name('Position X');
spotLightPositionGui.add(spotLight.position, 'y', -1, 8).name('Position Y');
spotLightPositionGui.add(spotLight.position, 'z', -5, 5).name('Position Z');

//Spot Light Target Position Folder

const spotLightTargetGui = spotLightGui.addFolder('Target Position').close();

spotLightTargetGui.add(spotLight.target.position, 'x', -5, 5).name('Position X');
spotLightTargetGui.add(spotLight.target.position, 'y', -1, 5).name('Position Y');
spotLightTargetGui.add(spotLight.target.position, 'z', -5, 5).name('Position Z');

//Spot Light Shadow Folder 

const spotLightShadowGui = spotLightGui.addFolder('Shadow').close();

spotLightShadowGui.add(spotLight, 'castShadow');
spotLightShadowGui.add(spotLight.shadow, 'radius', 1, 20, 0.1);
spotLightShadowGui.add(spotLight.shadow.mapSize, 'x',  120, 1024, 2).name('ShadowMap Size').onChange((size)=>{
  updateSpotLightShadowMapSize(size);
});
spotLightShadowGui.add(spotLightCameraHelper, 'visible').name('Shadow Camera Helper');

//-----------Animate

const clock = new THREE.Clock();

const tick = ()=>{
  //Update Controls
  orbitControls.update();

  //Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
}

console.timeEnd('Threejs');
tick();
