import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

//----------------------------------------------------------------------------------------------------------------
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
  height: window.innerHeight
}

//----------------------------------------------------Cameras  introduction---------------------------------------------------
//There are many cameras
//Camera Class
//Is the base class for cameras and there are a lot of cameras:

//ArrayCamera
//Is to render the scene from multiple cameras of specific areas 

//StereoCamera
//You can use this one to render two cameras who mimic the eyes, it can be used to create vr, red and blue glasses.

//CubeCamera
//This Camera is going to do 6 renders for each face of a cube, to create a render of the enviroment

//Orthographic Camera
//Used to create a render of the scene but without perspective

//-----------------------------------------------Perspective Camera
//The camera we use thera are 4 parametters  
//Field of view
//Aspect ratio is the width/height this is for the image in camera do not squeez and it will be same ass the renderer
//Near & Far All the objects between this numbers is going to be rendered. Do not use extreme values of that numbers cause you can fall in z-fighting, it is a bug. It means if u use extreme values, the gpu will have troubles to gues wich object is in front of other. This values depend on your scene

const perspectivCamera = new THREE.PerspectiveCamera(50, sizes.width/sizes.height, 0.1, 100); 

perspectivCamera.position.set(2, 1, 3);
perspectivCamera.lookAt(new THREE.Vector3(0,0,0))

//-----------------------------------------------Orthographic Camera
//A camera without perspective
//There are parameter left, right, top and a botom there are the sizes of the camera we want to render
//near and far
//There is a problem and if the render change the sizes, then the image squeez, thats why we need the aspect ratio

const aspectRatio= sizes.width/sizes.height;
const orthographicCamera = new THREE.OrthographicCamera(-1*aspectRatio, 1*aspectRatio, 1, -1, 0.1, 100); //we multiply the aspect ratio, witch mean the size of the camera and aspect radio adjust automaticly to the renderer sizes.


orthographicCamera.position.set(2, 1, 3);
orthographicCamera.lookAt(new THREE.Vector3(0,0,0))

//Renderer

const canvas = document.querySelector('.experience');

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,

}) 
renderer.setSize(sizes.width, sizes.height) 

//---------------------------------------------------------Camera Controls---------------------------------------------------

//Cursor
const cursor = {
  x:0,
  y:0,
}

window.addEventListener('mousemove', (event)=>{ //Here we listen the position of the cursor to make this responsive we will make this values go from 0 to 1 to do this, we can divide it to the total viewport sizes
  cursor.x = (event.clientX/sizes.width)-0.5;
  cursor.y = (event.clientY/sizes.height)-0.5;
})

function cameraControl(){
  //This will create a imaginary plane where the camera can move arround , but it can move on z axies.
  // perspectivCamera.position.x = (cursor.x)*-10;
  // perspectivCamera.position.y = (cursor.y)*10;
  
  //This will create a imaginary flat circle that can rotate the camera arround the cube with sin() and cos()
  perspectivCamera.position.x = Math.sin(-cursor.x*Math.PI*2)*3;
  perspectivCamera.position.z = Math.cos(-cursor.x*Math.PI*2)*3;
  //perspectivCamera.position.y = cursor.y *5;
   perspectivCamera.lookAt(cube.position);
}

//Creating controls is hard and sometimes not intuitive, thats why we have integrated controls in three js, there are many controls integrated
//------Device Orientation Control
//Used to link the device orentation control with the experience, you can see the things moving while youre moving your device.
//------Fly Controls 
//Controls made to emulate the camera movements while flying and can rotate on de z axies
//------First Person control
//Is like fly control, but you can not change the z axies
//------Pointer Lock Controls
//The most inmersive, you can use it tu emulate a first person game. 
//Orbit Controls
//Controls to emulate the controls of a 3D software
//Thrackback control
//is like orbit controls but without limit, you can loop in every direction
//Transform controls 
//It can be used to muve on sppace with the mouse
//Drag Controls
//There are to move objects by using controls

//To use orbit control we have to instansiatie the control first of all we have to import it

//Controls
const controls = new OrbitControls(perspectivCamera, canvas);
//Orbit controls have some options 
controls.enableDamping = true;

//Animation

const clock = new THREE.Clock();

const tick = ()=>{
  //Clock
  const elapsed = clock.getElapsedTime();
  
  //Update Objects
  
  //cameraControl();
  
  //Update Controls
  controls.update(); //To make the damping works correctli we need to update the controls even when they are not on use

  renderer.render(scene, perspectivCamera); 
  window.requestAnimationFrame(tick);
}
tick();





