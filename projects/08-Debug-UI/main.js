import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'



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
//------------------------------Pizel ratio-----------------------------------------------
//Pixel ratio correspond to how many physical pixels you have for one pixel unit of the software part 
//A pixel radio of 2 means you have 4 times more pixels to render

//You can get the pixel ratio of your screen and you can get the canvas pixel ratio with renderer.getPixelRatio() by default it is set to 1 but can be changed with renderer.setPizelRatio, if you equals de device pixel ratio and the renderer pixel ratio you will get the better quality of image that the client screen can get.
//The problem of that is a pixel ratio of 2 is enough, more brings stress and perfomance issues to the device and is not necesari so we have to put the limit in 2
//console.log(window.devicePixelRatio) 



window.addEventListener('resize', ()=>{
  //Update Sizes (first update all the sizes)
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  //Update Camera (update the camera aspect, then the projection matrix, when the canvas is created a matrix is created with it and is the same forever, thats cuase if the size change, the cube is going to squeez, so we have to update that matrix of pixels to avoid the proble, finaly we have to update the renderer sizes)
  camera.aspect = window.innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height) 
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); //Update the pixel ratio in resize, if the user changes the window to another screen, the pixel ratio will update 
})

//-------------------------------Full Screen--------------------------------------------------
//To maje an experience inmersive and have a full screen experience we can use this.
//First we need a function able to go on fullscren and leave it
//To go to fullscreen mode, we have to use a requestFullScreen() on the concerned element to be fullscreen
//And to leave ite document.exitFullscreen. 
 
// window.addEventListener('dblclick', ()=>{
//   if(!document.fullscreenElement){
//     canvas.requestFullscreen();
//   } else {
//     document.exitFullscreen();
//   }
// })

//On Safari it dosent work, to fix it we need to do is this and then it works for all the browsers

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
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); //Heres where we equals the pixel ratio of the device with the renderer pixel ratio and with the function math.min avoid it goes above 2.

//Controls 

const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;
//orbitControls.enabled = false;
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





