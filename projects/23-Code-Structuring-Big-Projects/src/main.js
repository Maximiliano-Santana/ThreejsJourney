import './style.css';

//So a good practice is to put the whole experience inside a main class that will then create everything else

//We are going to name it Experience, but it can be whatever name.

//We are going to create every thing related to the experience in a specific folder called 'Experience' Inside we are going to create the file wich contains that and all the classes related to the folder will be in that folder.
//In that file we are going to export that class, import it in the main js and then instanciate it.

//This is an interesting part cause if you are working with a team, will work in this part and other developers will instanciate your class by importing this.

//Import the expreience class and instanciate it then provide the canvas, this way, you can send more parameters
import Experience from './Experience/Experience.js';

const experience = new Experience(document.querySelector('.canvas__experience'));



//First we ar


// import * as THREE from 'three';
// import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

// import GUI from 'lil-gui';

// console.time('Threejs')

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