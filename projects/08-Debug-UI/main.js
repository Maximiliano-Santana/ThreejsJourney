import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';

//Import LilGUI
import GUI from 'lil-gui';

//Have manual control of of the experience is very util, cause you or the customer have capability to change and select the perfect configurations
//There are diferent types of elemnts that you can add to the panel
//Range Numbers with minimum and maximum
//Color for colors with various formats
//Text For simple text
//Checkbox For booleans
//Select To have a choice from a lis of values 
//Button to trigger functions 
//F older to organize your panel if you have too many elements



//Scene
const scene = new THREE.Scene();

//Cube 
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({color: 'red'})

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

//Sizes utility to make project work and change easyer
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
camera.position.z = 3;

//Update camera

//Renderer

const canvas = document.querySelector('.experience');

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
}) 
renderer.setSize(sizes.width, sizes.height) 
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
//Controls 

const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;
//orbitControls.enabled = false;

//---------------------------------------------Debug UI-----------------------------------------------------
//git.add to add a new control, first add the object3D, the second parammeter it will be the name of the propierty, third set the minimum valiue, then maximum value and the steps 

const gui = new GUI();


gui.add(cube.position, 'x', -2, 2, 0.01)
gui.add(cube.position, 'y', -2, 2, 0.01)
gui.add(cube.position, 'z', -2, 2, 0.01)

//You can use methods to change the min, max and steps 

gui.add(cube.position, 'y')
.min(-2)
.max(2)
.step(0.01)

//you can change the name of to have more clearly the control
.name('elevation')

//LilGUI will understand the tipe of control depends of type of data
gui.add(cube, 'visible')
gui.add(material, 'wireframe');

//To change colors we need addColor(), also we can hear changes with method .inChange and make a callback of a function 
gui.addColor(material, 'color').onChange(()=>{
  console.log('Color changed')
})
console.log(material.color)
//---------------functions
const spin ={
  360: ()=>{
    gsap.to(cube.rotation, {duration: 2, y:cube.rotation.y + Math.PI*2}); 
  }
} 

gui.add(spin, '360') //It created a botton who calls the function


//Animation
const clock = new THREE.Clock();

const tick = ()=>{
  const elapsed = clock.getElapsedTime();
  //cube.rotation.y = Math.sin(elapsed)*Math.PI;
  
  orbitControls.update();
  
  renderer.render(scene, camera); 
  window.requestAnimationFrame(tick);
}
tick();





