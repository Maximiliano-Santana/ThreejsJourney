import './style.css';
import * as THREE from 'three';
import { gsap } from 'gsap';
import GUI from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

THREE.ColorManagement.enabled = false

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  aspect: window.innerWidth/window.innerHeight,
}

//Scene
const scene = new THREE.Scene();

//Camera
const camera = new THREE.PerspectiveCamera(50, sizes.aspect, 0.1, 100);

//Renderer 

const canvas = document.querySelector('.experience');
const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//Controls 

const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;
orbitControls.enabled = true;

//Objects 
const sphereGeometry = new THREE.SphereGeometry(1);
const basicMaterial = new THREE.MeshBasicMaterial({color: 'red'});

const boxMesh = new THREE.Mesh(sphereGeometry, basicMaterial);

scene.add(boxMesh);

camera.position.z = 5;

//Animate 

const clock = new THREE.Clock();

const tick = () => {
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}

tick();