import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'



//------------Scene
const scene = new THREE.Scene();

//------------Geometries--------------------------------------------------------------------
//A geometry is composed of vertices (points in space) this vertices are  linked to create faces
//This points can be used to create particles
//Vertex have Position, Uv, Normal, etc.

//Building geometries
// All geometries ar inherit from BufferGeometry class, this class have many propierties ad methods, all of this methods is going to transform the vertices.

//There are various geometries all of this geometries have controls
//BoxGeometry
//PlaneGeometry
//CircleGeometry
//ConeGeometry
//CylinderGeometry
//CylinderGeometry
//RingGeometry
//TorusGeometry
//TorusKnotGeometry
//DodecahedronGeometry
//TetrahedroGeometry
//IcosahedronGeometry
//IsphereGeometry
//SphereGeometry
//ShapeGoemetry (based on curves)
//TubeGeometry
//ExtrudeGeometry
//LatheGeometry
//TextGeometry

//----------Box Example


//Box geometry have 6 parameters
//sizes (width height, depth)
//Segments (widthSegments, heightSegments & depthSegments)
//The segments dictaiminate how many subdivisions are in each face

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1)

const material = new THREE.MeshBasicMaterial({color: 'red'})
material.wireframe = true;

const cube = new THREE.Mesh(cubeGeometry, material);


//----------Crating own buffer geometry
//Buffer Geometry have data, to store this geometry data we are going to create a Float32Array (native js)
//-Typed array
//-Can only store 1 type of values
//-Fixed length
//-Easier to handle for the computer

//Buffer Geometry contains 3 atributes, this 3 objects are instances of BufferAtribute, this buffer atribute contains the Float32Array who contains all the vertices positons in one linear array, and other information
//Position: Instance of FLoat32BufferAtributes
//Normal: Instance of FLoat32BufferAtributes
//Uv: Instance of FLoat32BufferAtributes



//Two way to create and filling a Float32Array, the first one

const positionArray1 = new Float32Array(9) //This will have the data of each vertices position in x, y & z.

//Vertex 1
positionArray1[0]= -0.5;  //x
positionArray1[1]= 0;     //y
positionArray1[2]= 0;     //z

//Vertex 2
positionArray1[3]= 0.5;
positionArray1[4]= 0;
positionArray1[5]= 0;

//Vertex 3
positionArray1[6]= 0;
positionArray1[7]= 1;
positionArray1[8]= 0;

//The secondway to fo it is passing an array in the function

const positionArray = new Float32Array([
  0.5,    0,  0,
  -0.5,   0,  0,
  0,      1,  0,
])

//Now we have the Float32Array with the positions set, we can convert put it into a BufferAttribute

//Buffer Attribute recive the position array and the number of vertex
const positionsBufferAtribute = new THREE.BufferAttribute(positionArray, 3); 

//Create a BufferGreomety
const createdGeometry = new THREE.BufferGeometry();

//Push the Buffer Atribute into the BufferGeometry
createdGeometry.setAttribute('position', positionsBufferAtribute); //This BufferAtribute is send into the atribute position. instead uv or normal.

//Then Crate the mesh with the geometry we created
const createdObject = new THREE.Mesh(createdGeometry, material)

//Now add the created object in the scene
scene.add(createdObject)

createdObject.position.set(0,-0.5,0)
// createdObject.rotation.x = Math.PI;
// createdObject.rotation.z = Math.PI/2;
// createdObject.rotation.y = Math.PI/2;

scene.add(cube)

//------------------------------creating bunch of triangles
const count = 10;
const randomPositions = new Float32Array(count * 3 * 3 );
for ( let i=0; i < count * 3 * 3 ; i++){
  randomPositions[i] = Math.random();
}

const randomPositionAtriubutes = new THREE.BufferAttribute(randomPositions, count * 3 * 3 );

const randomGeometry = new THREE.BufferGeometry();

randomGeometry.setAttribute('position', randomPositionAtriubutes);

const randomMesh = new THREE.Mesh(randomGeometry, material)

scene.add(randomMesh);

console.log(randomMesh)
console.log(createdObject)



//-----------Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspect: window.innerWidth/window.innerHeight,
}

//Resize

window.addEventListener('resize', ()=>{
  //Update Sizes (first update all the sizes)
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = window.innerWidth/innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); //Update the pixel ratio in resize, if the user changes the window to another screen, the pixel ratio will update
})

//----------Full Screen

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

//-----------Camera

const camera = new THREE.PerspectiveCamera(50, sizes.aspect);
camera.position.z = 3;

//-----------Renderer

const canvas = document.querySelector('.experience');

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); //Heres where we equals the pixel ratio of the device with the renderer pixel ratio and with the function math.min avoid it goes above 2.

//----------Controls

const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;
//orbitControls.enabled = false;
//Animation

const clock = new THREE.Clock();

const tick = ()=>{
  const elapsed = clock.getElapsedTime();
  //cube.rotation.y = Math.sin(elapsed)*Math.PI;
  createdObject.rotation.y = Math.sin(elapsed)*Math.PI;

  orbitControls.update();

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}
tick();





