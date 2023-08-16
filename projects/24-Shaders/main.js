import './style.css';

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import GUI from 'lil-gui';

//------------------------------------- Shader patterns ---------------------------------------------------------




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
    sizes.height = window.innerHeight;

    //Update camera
    camera.aspect = sizes.width/sizes.height;
    camera.updateProjectionMatrix();

    //Update Renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//Textures

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

const flagTexture = textureLoader.load('/textures/flag.jpg');

//Scene 
const scene = new THREE.Scene();

//Camera 
const camera = new THREE.PerspectiveCamera(50, sizes.width/sizes.height, 0.1, 100);
camera.position.set(5, 4, 5);

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
  //We provide it of data, Uniforms (like color) and use those data to colorize each pixel. We can't send Attributes, but we can send a value from the vertex of the fragment those are called 'Varyings' and the value get interpolated between the vertices, this Varyings come from the vertex shader, so if we put a vertex with color red and other with green, the color values between the vertices will be interplated and create a gradient.
  //The GPU follows the instructions and color the fragments


//-----------Why showld we write our own shaders
//We have multiple reasons.
//Three.js materials are limited.
//Our shaders can be very simpler and performant 
//We can add custom post-processing

//--------------------------------------- Create our first shaders with RawShader Material -------------------------
//We can use a ShaderMaterial or a RawShaderMaterial
//The ShaderMaterial will have some code automatically added to the shader code
//The RawShaderMaterial will have nothing

//First we create the RawShaderMaterial
//Now we need to provide the shaders programs provideing an object with the vertexShader and the fragmentShader
//We can provide it with backticks, but we miss syntax coloration wich may cause problems at developing. To fix that we can separate those programs in different files on a file named shaders/test/vertex.glsd & fragment.glsl in VSCode go to plugins, search for shader install the Shader languages support for VS code plugin. 
//Before you import those files first we are going to use a linter to validate the code and find poetntial errors
//This is a VSCode extension
//---------Now we need to import  shaders
//If we try to import this files like all other import we get an error cause it tries to import it like it was JavaScript
//There are two solutions to add support to shaders in Vite
//vite-plugin-glsl
//vite-plugin-glslify
//We just want to be able to import .glsl files and both do that perfectly
//The difference is with more specific features like including shaders files into others shaders files
//Handy in 3 situations 
//We want to split big shaders
//We want to re-use shaders chunks
//We want to use external shader chunks made by other developers

//Both vite plugins can do that but with a different syntax

//GLSLIFY is kind of the standar but vite-blugin-glsl is easier to use and well mantained
//If you neeed to implement vite-plugin-glslify the process is almost exatly the same

//Open terminal
//Run npm install-plugin-glsl

//in vite.confi.js, import glsl from vite-plugin-glsl
//And in add an object named plugins wich contains an array with in glsl() function
//then import it and we can log it and usse those variables

import testVertexShader from '/shaders/test/vertex.glsl';
import testFragmentShader from '/shaders/test/fragment.glsl';


//You can still add other common properties like wireframe, side, transparent or flatShading still work
//But some properties like map, alphaMap, opacity, color, etc. Won't work and we need to write these features ourselves and it can be really hard
const material = new THREE.RawShaderMaterial({
  vertexShader: testVertexShader,
  fragmentShader: testFragmentShader,
  side: THREE.DoubleSide,
  transparent: true,
  uniforms: { 
    uFrequency: {value: new THREE.Vector2(7, 1.8)},
    uTime: {value: 0},
    uColor: {value: new THREE.Color('#ff2318')},
    uTexture: { value: flagTexture },
  }
});

// const gui = new GUI();
// gui.add(material.uniforms.uFrequency.value, 'x', 0, 20, 0.01).name('frequency X')
// gui.add(material.uniforms.uFrequency.value, 'y', 0, 20, 0.01).name('frequency Y')

//--------------------------------------------------------- Shaders patterns ---------------------------------------------------------
import gradientColorsVertexShader from '/shaders/gradientColors/vertex.glsl';
import gradientColorsFragmentShader from '/shaders/gradientColors/fragment.glsl';

import gradientGOVertexShader from '/shaders/gradientGreenOrange/vertex.glsl';
import gradientGOFragmentShader from '/shaders/gradientGreenOrange/fragment.glsl';

import gradientBWVertexShader from '/shaders/gradientBW/vertex.glsl';
import gradientBWFragmentShader from '/shaders/gradientBW/fragment.glsl';

import ragingSeaVertexShader from '/shaders/RagingSea/vertex.glsl';
import ragingSeaFragmentShader from '/shaders/RagingSea/fragment.glsl';

//Beacause we are going to draw we need to send the uv coordinates

const gradientColorsMaterial = new THREE.ShaderMaterial({
  vertexShader: gradientColorsVertexShader,
  fragmentShader: gradientColorsFragmentShader,
  side: THREE.DoubleSide,
})

const gradientGOMaterial = new THREE.ShaderMaterial({
  vertexShader: gradientGOVertexShader,
  fragmentShader: gradientGOFragmentShader,
  side: THREE.DoubleSide,
})

const gradientBWMaterial = new THREE.ShaderMaterial({
  vertexShader: gradientBWVertexShader,
  fragmentShader: gradientBWFragmentShader,
  side: THREE.DoubleSide,
})

//---------------------------------- Raging sea shader ------------------------------------------
const debugObject = {};
debugObject.dephtColor = '#186691'; 
debugObject.surfaceColor = '#a1f1fc';

const ragingSeaMaterial = new THREE.RawShaderMaterial({
  vertexShader: ragingSeaVertexShader,
  fragmentShader: ragingSeaFragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    
    uTime: {value: 0}, 
    
    uWavesElevation: { value: 0.08 }, 
    uWavesFrequency: { value: new THREE.Vector2(2.54, 2.54) },
    uSpeedAnimation: {value: 0.5}, 

    uWavesSharpnesElevation: { value: 0.2 },
    uWavesSharpnesFrequency: { value:  1.0 },
    uWavesSharpnesSpeed: { value: 0.2 },
    uWavesSharpnesDetail: { value: 4 },

    uDepthColor: {value: new THREE.Color(debugObject.dephtColor)},
    uSurfaceColor: {value: new THREE.Color(debugObject.surfaceColor)},

    uColorOffset: { value: 0.11 },
    uColorMultiplier: { value: 3.89 },
  }
});

const gui = new GUI();


gui.add(ragingSeaMaterial.uniforms.uWavesElevation, 'value', 0, 2, 0.01).name('Waves Elevation');
gui.add(ragingSeaMaterial.uniforms.uWavesFrequency.value, 'x', 0, 5, 0.01).name('Waves Frequency X');
gui.add(ragingSeaMaterial.uniforms.uWavesFrequency.value, 'y', 0, 5, 0.01).name('Waves Frequency Z');
gui.add(ragingSeaMaterial.uniforms.uSpeedAnimation, 'value', 0, 5, 0.01).name('Waves Speed');

gui.add(ragingSeaMaterial.uniforms.uWavesSharpnesElevation, 'value', 0, 5, 0.01).name('Sharpness Elevation');
gui.add(ragingSeaMaterial.uniforms.uWavesSharpnesDetail, 'value', 0, 5, 1.0).name('Sharpness details');
gui.add(ragingSeaMaterial.uniforms.uWavesSharpnesFrequency, 'value', 0, 5, 0.01).name('Sharpness frequency');
gui.add(ragingSeaMaterial.uniforms.uWavesSharpnesSpeed, 'value', 0, 5, 0.01).name('Sharpness Speed');

gui.addColor(debugObject, 'dephtColor').onChange(()=>{
  ragingSeaMaterial.uniforms.uDepthColor.value.set(debugObject.dephtColor);
  ragingSeaMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
});
gui.addColor(debugObject, 'surfaceColor').onChange(()=>{
  ragingSeaMaterial.uniforms.uDepthColor.value.set(debugObject.dephtColor);
  ragingSeaMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
});



gui.add(ragingSeaMaterial.uniforms.uColorOffset, 'value', 0, 1.2, 0.01).name('Color Offset');
gui.add(ragingSeaMaterial.uniforms.uColorMultiplier, 'value', 0, 5, 0.01).name('Color Multiplier');





//-------------------------Objects

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2, 50, 50),
  gradientBWMaterial,
);
  //plane.scale.y = 2/3;
  //scene.add(plane);

const  seaMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5, 200, 200),
  ragingSeaMaterial,
);

seaMesh.rotation.x = -Math.PI*0.5
scene.add(seaMesh);

//----------------------------------------- Creating a attribute 'aRandom' 

//we use a cause A for attributes 
//If its a uniform use u
//if its varing  use v
  
  const count = plane.geometry.attributes.position.count //We can use the propertie .count that return the count of vertices

  const randomArray = new Float32Array(count);
  
  for (let i = 0; i < count ; i++){
    randomArray[i] = Math.random();
  }

  plane.geometry.setAttribute('aRandom', new THREE.BufferAttribute(randomArray, 1));
  
//Scene Configuration

//Gui

//Animate
const clock = new THREE.Clock();

const tick = ()=>{
  //Clock
  const elapsedTime = clock.getElapsedTime();
  
  //Update material
  //material.uniforms.uTime.value = elapsedTime;
  ragingSeaMaterial.uniforms.uTime.value = elapsedTime;

    //Controls
    orbitControls.update();
    //Render
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

console.timeEnd('Threejs')
tick();