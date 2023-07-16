import './style.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap';
import GUI from 'lil-gui';

// Start of the code
THREE.ColorManagement.enabled = false

//Scene
const scene = new THREE.Scene();

//Sizes

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspect: window.innerWidth/window.innerHeight,
}

window.addEventListener('resize', ()=>{
  //Update Sizes (first update all the sizes)
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  //Update Camera 
  camera.aspect = window.innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height) 
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
});

//Full Screen

window.addEventListener('dblclick', ()=>{

  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement){
    if (canvas.requestFullscreen){
      canvas.requestFullscreen();
    } else if (canvas.webkitFullscreenElement){
      canvas.webkitFullscreenElement();
    }
  } else {
    if (document.exitFullscreen){
      document.exitFullscreen();
    } else if (document.webkitFullscreenElement){
      document.webkitFullscreenElement();
    }
  }
})

//Camera

const camera = new THREE.PerspectiveCamera(50, sizes.aspect); 

//Renderer

const canvas = document.querySelector('.experience');

const renderer = new THREE.WebGLRenderer({canvas: canvas,}); 
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

renderer.setSize(sizes.width, sizes.height) 
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 

//Controls 

const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;
//orbitControls.enabled = false;


//---------------------------------------------Materials----------------------------------------
//Materials are used to put a color on each visible pixel of the geometry.   
//The algorithms are written in programs called shaders, to decide what color is going to be each pixel.
//
const basicMaterial = new THREE.MeshBasicMaterial({color: 'green'});



//Objects 
const sphereMesh = new THREE.Mesh(
  new THREE.SphereGeometry(3, 16, 16),
  basicMaterial
);
const planeMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(6,6),
  basicMaterial
);
const torusMesh = new THREE.Mesh(
  new THREE.TorusGeometry(2.5, 1),
  basicMaterial
)

scene.add(planeMesh, sphereMesh, torusMesh);

sphereMesh.position.x = -7;
torusMesh.position.x = 7;
camera.position.z = 22;


//Animation
const clock = new THREE.Clock();

const tick = () => {
  
  //Clock
  const time = clock.getElapsedTime();
  console.log(time)
  
    //update controls 
  orbitControls.update(); //to damping work correctly 

  //update Meshes
  torusMesh.rotation.y = (time)

  renderer.render(scene,camera);
  window.requestAnimationFrame(tick);
}

tick();



