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

//Textures

const loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = ()=>{
  console.log('Assets loaded');
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
  console.log(gltf.scene)
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
//First we need to load the nevMapTexture, it is a cubeTexture
//Once we have the texture loaded, we can use it on diferent ways.

//We can create a big cube al arround the scene and put the texture, but this is a old and bad solution
//We can assing the environmentMap to the scene's background (after creating the environmentMap ahd the scene)

scene.background = envMapTexture;

//Now it looks all black
//To solution this problem we can add the envMapTexture on the envMap of the materials

//knotTorus.material.envMap = envMapTexture;

//The problem is if we have a lo of objects in the scene it will be complicated to add envMap to each object
//So to apply the environment map as lighting to the whole scene, assign it to the environment property of the scene

scene.environment = envMapTexture;

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
      roughness: 0.3,
      metalness: 1,
      color: '0xaaaaaa'
    })
);

knotTorus.scale.set(0.2, 0.2, 0.2)
knotTorus.position.set(-0.5, 0.30 ,0)
scene.add(knotTorus);

//Scene Configuration

camera.position.set(0, 0, 5)

//Gui

//Animate
const clock = new THREE.Clock();

const tick = ()=>{

    //Controls
    orbitControls.update();
    //Render
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

console.timeEnd('Threejs')
tick();