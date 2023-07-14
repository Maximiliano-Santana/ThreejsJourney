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
    width: 800,
    height: 600
}

//Camera

const camera = new THREE.PerspectiveCamera(50, sizes.width/sizes.height); 
camera.position.z = 3;


//Renderer

const canvas = document.querySelector('.experience');

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,

}) 
renderer.setSize(sizes.width, sizes.height) 


//Animation

const clock = new THREE.Clock();

const tick = ()=>{
  renderer.render(scene, camera); 
  const elapsed = clock.getElapsedTime();
  cube.rotation.y = Math.sin(elapsed)*Math.PI;


  window.requestAnimationFrame(tick);
}
tick();





