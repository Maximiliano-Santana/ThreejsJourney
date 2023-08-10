import './style.css';

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import GUI from 'lil-gui';

console.time('Threejs')

//Code structuring for bigger projects.
//Sometimes when we are working on bigger projects, have all the code inside one file could be hard cause 
//Hard to find what you want
//Hard to re-use sepecific parts 
//conlfict with variables
//conflicts with other developers
//cramps in your fingers because you have to scroll

//--------------------------- Javascript Classes and modules ----------------------------------------------
//We are going to use concepts like classes and module
//This is a personal, so take think what is good or wrong

//-------------------- Modules
//The idea of the modules is to separate the code into multiple files and import them when we need it.
//We are using modules when we import dependencies.

//We aren't going to use the native support
//Not all browsers are compatible with it 
//Vite support modules

//


//--------------------------------------- three.js code -----------------------------------------------------


// THREE.ColorManagement.enabled = false;

// //Sizes 
// const sizes = {
//     width: window.innerWidth,
//     height: window.innerHeight
// }

// //Resize

// window.addEventListener('resize', ()=>{
//     //Update Sizes 
//     sizes.width = window.innerWidth;
//     sizes.height = window.innerHeight;

//     //Update camera
//     camera.aspect = sizes.width/sizes.height;
//     camera.updateProjectionMatrix();

//     //Update Renderer
//     renderer.setSize(sizes.width, sizes.height)
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// });

// //Textures

// const loadingManager = new THREE.LoadingManager();
// const textureLoader = new THREE.TextureLoader();

// //Scene 
// const scene = new THREE.Scene();

// //Camera 
// const camera = new THREE.PerspectiveCamera(50, sizes.width/sizes.height, 0.1, 100);

// //Renderer
// const canvas = document.querySelector('.experience')
// const renderer = new THREE.WebGLRenderer({canvas: canvas});
// renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.setSize(sizes.width, sizes.height);

// //Controls 
// const orbitControls = new OrbitControls(camera, canvas);
// orbitControls.enableDamping = true;
// orbitControls.enabled = true;

// //Lights


// //Objects

// const proton = new THREE.Mesh(
//     new THREE.SphereGeometry(1),
//     new THREE.MeshBasicMaterial({color:'red'})
// );

// scene.add(proton);

// //Scene Configuration

// camera.position.set(0, 0, 5)

// //Gui

// //Animate
// const clock = new THREE.Clock();

// const tick = ()=>{

//     //Controls
//     orbitControls.update();
//     //Render
//     renderer.render(scene, camera);
//     window.requestAnimationFrame(tick);
// }

// console.timeEnd('Threejs')
// tick();