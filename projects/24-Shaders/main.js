import './style.css';

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import GUI from 'lil-gui';

console.time('Threejs')

THREE.ColorManagement.enabled = false;

//Sizes 
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}

//Resize

window.addEventListener('resize', ()=>{
    //Update Sizes 
    sizes.width = window.innerWidth;
    sizes.height = window.height;

    //Update camera
    camera.aspect = sizes.width/sizes.height;
    camera.updateProjectionMatrix();

    //Update Renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//Textures

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader();

//Scene 
const scene = new THREE.Scene();

//Camera 
const camera = new THREE.PerspectiveCamera(50, sizes.width/sizes.height, 0.1, 100);

//Renderer
const canvas = document.querySelector('.experience')
const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.width, sizes.height);

//Controls 
const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;
orbitControls.enabled = true;

//Lights

//----------------------------- Shaders ----------------------------------
//Everyting showing up on the WebGL render is made possible becaus of shaders 
//Learn what is a shader
//Create our own somple shader
//Learn the syntax 
//Do same exercises

//---------------------- What is a shader
//One of the main components of WebGL //Is a program written in a new Lenguage GLSL 
//This program is sent to the GPU, and will position each vertex of a geometry, you create a geometry and the shader will position the vertex of that geometry in the render
//Colorize each visible pixel of that geometry. (Pixel isn't accurate because each point in the render doesen't necessarily math each pixel of the screen) We are going to use 'fragments'
//So fragments are light pixels for the render (not for the screen)

//We send a lot of data to the shader
//Vertices coordinates.
//Mesh transformation.
//Information about the camera.
//colors.
//Textures.
//Lights.
//Fog.
//Etc.

//The GPU processs all of this data following the shader instructions

//-------------------- There are two types of shaders
//------- Vertex Shader
  //This shader will position each vertex of the geometry
  //-We create the vertex shader
  //-We send that shader to the GPU with data like the vertices coordinates, the mesh transformations, camera information, etc.
  //-The GPU follow the instructions of the shader and position the vertices on the render.
  //-The same vertex shader will be used for every vertices 

  //---Type of data we send to the shader program
  //Some data like the vertex position will be different for each vertex (vertex position) //those type of data are called 'Attributes' 
  //Some data like the position of the mesh are the same of the vertices // When you want to render an object this object has a position, so this data that doesn't change between each one, and this data is called 'Uniforms'. //And in our code we are going to retrieve those data Uniforms and will use those data to position.

  //Once the vertices are placed by the vertex shader, the GPU knows what pixels of the geomtery are visible and can proceed to the next shader witch is the fragment shader.

//--------- Fragment Shader
  //This shader will color each visible fragment (pixel) of the geometry.
  //Thats because the gpu knows wich pixels are visible because they are placed by the vertex shader

  //The same fragment shader will be used for every visible fragment of the geometry
  //We create the fragment shader (also GLSL)
  //We provide it of data, Uniforms (like color) and use those data to colorize each pixel. We can't send Attributes, but we can send a value from the vertex of the fragment those are called 'Varyings' and the value get interpolated between the vertices, this Varyings come from the vertex shader.
  //The GPU follows the instructions and color the fragments



//Objects

const proton = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.MeshBasicMaterial({})
);

scene.add(proton);

//Scene Configuration

camera.position.set(0, 0, 5)

//Gui

//Animate
const clock = new THREE.Clock();

const tick = ()=>{

    //Controls
    orbitControls.update();
    //Render
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

console.timeEnd('Threejs')
tick();