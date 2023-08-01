import './style.css';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import GUI from 'lil-gui';
import { gsap } from 'gsap';

//Size 
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

//Loaders 

const loadingManager = new THREE.LoadingManager();
loadingManager.onProgress = (progress) =>{
  console.log(progress);
}
loadingManager.onLoad = ()=>{
  console.log('assets loaded');
}

const textureLoader = new THREE.TextureLoader(loadingManager)

//Resize 

window.addEventListener('resize', ()=>{
  //Update Sizes 
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //Update camera 
  camera.aspect = sizes.width/sizes.height;
  camera.updateProjectionMatrix();

  //Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


//Scene
const scene = new THREE.Scene();

//Camera
const camera = new THREE.PerspectiveCamera(50, sizes.width/sizes.height, 0.01, 100);
camera.position.set(0, 3, 5);
camera.lookAt(new THREE.Vector3(0, 0, 0));

//Renderer
const canvas = document.querySelector('.experience');
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

//Controls 
const orbitControls = new OrbitControls(camera, canvas)
orbitControls.enableDamping = true;





//Material 
const basicMaterial = new THREE.MeshBasicMaterial()

//Objects
const cube1Mesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.5), 
  new THREE.MeshBasicMaterial()
);
const cube2Mesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.5), 
  new THREE.MeshBasicMaterial()
);
const cube3Mesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.5), 
  new THREE.MeshBasicMaterial()
);

cube1Mesh.position.x = -2
cube3Mesh.position.x = 2

scene.add(cube1Mesh, cube2Mesh, cube3Mesh);


//------------------------------------------ Ray Caster -----------------------------------------
//The idea is to cast a ray in a direction and test what object intersect with that ray.
//It could be used to detect if there is a wall in front of the playes
//Test if a gun bullet hit something
//Test if something is currently under the mouse to simulate events

//In this example we are going to cast a ray trought this boxes

//First we need to instance a Raycaster
const raycaster = new THREE.Raycaster();
//If we are shooting a ray we need to tell the raycaster the origin and the direction, we can use the .set(origin, direction)
const rayOrigin = new THREE.Vector3(-3, 0, 0);
const rayDirection = new THREE.Vector3(10, 0, 0);
//Raycaster will need a unit vector thats why we need to normalize the direction
rayDirection.normalize() //This method will reduce the vector3 length equals to 1 but still the same direction.

//Then we can provide the raycaster with the origin and the direction
raycaster.set(rayOrigin, rayDirection);

//Now we can cast a ray and get information.
//We have two options to cast a ray 
//.intersectObject() - to test one object
//.intersectObjects() - to test an array of objects

cube1Mesh.updateMatrixWorld();
cube2Mesh.updateMatrixWorld();
cube3Mesh.updateMatrixWorld();

const intersectObject = raycaster.intersectObject(cube1Mesh)
const intersectObjects = raycaster.intersectObjects([cube1Mesh, cube2Mesh, cube3Mesh]);

//The result is always an array even if we cast one object, this is beacaus we can go throught one object multiple times.
//Each items containts useful information
//Distance - The distance between the origin of the ray and the collision point
//Face - What face of the geometry was hit by the ray
//faceIndex - The index of the face
//Object - what object is concerned by the collision
//point - a vector3 of the exact position of the collision
//uv - the uv coordinates in that geometry
// console.log(intersectObject);
// console.log(intersectObjects);

//Values should be 0.5, 2.5, 4.5, but Three.js updates the objects’ coordinates (called matrices) right before rendering them. Since we do the ray casting immediately, none of the objects have been rendered. You can fix that by updating the matrices manually before ray casting:
// object1.updateMatrixWorld()
// object2.updateMatrixWorld()
// object3.updateMatrixWorld()

//----------------- Test on each Frame
//If we want to test thinghs while they are moving, we have to do the test on each frame
//We are going to animate the spheres and turn them blue when the ray intersects with them
const objectsToTest = [cube1Mesh, cube2Mesh, cube3Mesh];

//--------------------------------------- Use raycaster with the mouse ----------------------------------------
//Usefull to test if we are hovering some objects

//First we need the coordinates of the mouse but not in pixels, we need a value that goes from -1 to +1 in horizontal an vertical axes
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (event)=>{
  mouse.x = event.clientX/sizes.width*2-1
  mouse.y = -(event.clientY/sizes.height)*2+1
})

//Thwe we will cast on the tick function



//Tick function
const clock = new THREE.Clock();


const tick = ()=>{
  const time = clock.getElapsedTime();

  //Animate objects
  cube1Mesh.position.y = Math.sin(time)*2
  cube2Mesh.position.y = Math.cos(time)*2
  cube3Mesh.position.y = Math.tan(time)

  // for (const object of objectsToTest){
  //   object.material.color.set('#ffffff');
  // }

  // const intersects = raycaster.intersectObjects(objectsToTest);

  // for (const intersect of intersects){
  //   intersect.object.material.color.set('#00ff00');
  // }

  //------------------------------------ Mouse event--------------------------------------------
  //use the setFromCamera() Method to orient the ray in the right direction, the rest is the same
  raycaster.setFromCamera(mouse, camera);

  const mouseIntesrsects = raycaster.intersectObjects(objectsToTest);

  for (const object of objectsToTest){
    object.scale.set(1, 1, 1)
  }
  for (const intersect of mouseIntesrsects){
    intersect.object.scale.set(1.5, 1.5, 1.5)
  }

  //Update controls
  orbitControls.update()

  //Render
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}

tick();

