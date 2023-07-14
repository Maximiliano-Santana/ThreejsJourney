import './style.css'
import * as THREE from 'three'

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

//Camera there ara a lot of cameras 

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

//-----------------------------------------------Perspective Camera--------------------------------------------------------
//The camera we use thera are 4 parametters  
//Field of view
//Aspect ratio is the width/height this is for the image in camera do not squeez and it will be same ass the renderer
//Near & Far All the objects between this numbers is going to be rendered. Do not use extreme values of that numbers cause you can fall in z-fighting, it is a bug. It means if u use extreme values, the gpu will have troubles to gues wich object is in front of other. This values depend on your scene

const perspectivCamera = new THREE.PerspectiveCamera(50, sizes.width/sizes.height, 0.1, 100); 

perspectivCamera.position.set(2, 1, 3);
perspectivCamera.lookAt(new THREE.Vector3(0,0,0))

//-----------------------------------------------Orthographic Camera----------------------------------------------
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


//Animation

const clock = new THREE.Clock();

const tick = ()=>{
  renderer.render(scene, perspectivCamera); 
  const elapsed = clock.getElapsedTime();
  cube.rotation.y = Math.sin(elapsed)*Math.PI;


  window.requestAnimationFrame(tick);
}
tick();





