import './style.css';

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import gsap from 'gsap';
import GUI from 'lil-gui';
import { arraySlice } from 'three/src/animation/AnimationUtils';

console.time('Threejs')

THREE.ColorManagement.enabled = false;

//Sizes 
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
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

const particlesTexture = textureLoader.load('/resources/particles/9.png');


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


//----------------------------------------------------------------Particles---------------------------------------------------------------------
//Can be created to do rain, dust, fire, etc.
//You can have thousands of them whit reasonable frame rate 
//Each particles is composed of a plane (two triangles) always faceing the camera
//Creating particles is like creating a Mesh, we need a geometry (BufferGeometry), Material (PointsMaterial), A Points instance (instead of a Mesh)

//Instanciate any BufferGeometry, each vertex of the geometry will become a particle 


//---------------------------------------------Challenge, make a random particles generator------------------------------------------

var particlesNumber = {//Made particlesNumber an objet to add it to Gui;
    number: 5000,
    isAnimated: false,
}



function generateRandomPositionsBufferAtribute(length){


    //First of all we need to get the FloatArray32 who contains all the particles positions, and fill it with random values
    const ArrayPosition = new Float32Array(length*3); //Multiply the number of particles per 3 cause each particle need 3 vertex
    
    for (let i = 0; i < length*3; i++){ //Function for that fill the array with random numbers
        ArrayPosition[i] = (Math.random()-0.5)*10;
    }
    
    //Once we have the Array Positions we need to instanciate a Atribute Buffer, so then we can add the Atribute Buffer to the position attribute of the Buffer Geometry
    const positionsBufferAttribute = new THREE.BufferAttribute(ArrayPosition, 3);//Pass the Array positions and number of of vertex of each particle will need to create the Buffer Atribute
    return positionsBufferAttribute;
}

const randomParticlesGeometry = new THREE.BufferGeometry() //Create the buffer geometry will contain the attributeBuffer  

randomParticlesGeometry.setAttribute('position', generateRandomPositionsBufferAtribute(particlesNumber.number)); // Now set to the randomParticlesGeometry the position atribute with the function set atribute

randomParticlesGeometry.setAttribute('color', generateRandomColorBufferAtribute(particlesNumber.number));

//------------------------------------------------------------------------------------------------------------------------

//Geometry
const particlesGeometry = new THREE.SphereGeometry(1, 32, 32);

//---------------------------------------Points Material-----------------------------------------------------------------
//This is the material of particles it recieves size of particles, if this particles have perspective, the color, map (for textures)

const sphereParticlesMaterial = new THREE.PointsMaterial({
    color: 'red',
    size:0.02,
    sizeAttenuation: true,
})

//We can add textures to the particles also can use the alphaMap
const starsParticlesMaterial = new THREE.PointsMaterial({
    //color: 'cyan', 
    transparent: true,
    alphaMap: particlesTexture, 
    size:0.1, 
    sizeAttenuation: true, //with this option the particles will have perspective if particle is far, the particle will display smaller. False is better for performance 
});
//We used alphaMap but we can still see the edges of the particles, this is because the particles are drawn in the same order as they are created, and webGL doesent really know wich one is in fornt of the other, there are multiple solutions. 

//-----------Use the alpha test
//Is a value between 0 and 1 that enables the webGL, to know when not to render the pixel according to the pixel transparency. 
//By default the value is 0 meaning that the pixel will be rendered even when the pixwel value is 0, so we can fix it using 0.001

//starsParticlesMaterial.alphaTest = 0.001;

//This is a good solution, but the edge of the particle still not working perfext
//-----------Use depthTest
//When drawing the WebGL tests if thats being drawn is closer than what's already drawn
//That is called depth testing and can be deactivates with alphaTest, that whill make the gpu doesn't test 

//starsParticlesMaterial.depthTest = false 

//Deactivating the depth testing might create buggs if you have other objects in your scene or particles with different colors
//This can make a cool effect but no to the result that we are searching, 
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1, 4, 4 ,4),
    new THREE.MeshBasicMaterial({color:'red', wireframe:true})
)
//scene.add(cube)

//------------Use depthWrite 
//The thepth of whats being drawn is stored in what we call a depth buffer, instead of not testing if the particle is closer than whats in this depth buffer, we can tell the WebGL not to write particles in that depth buffer with depthWrite = false

starsParticlesMaterial.depthWrite = false;

//It might have bugs, but many times this is the right solution, but it depends on the project

//----------Use Blending
//The Web GL currently draws pizels one on top of the other, with the blending property we can tell teh WebGL to add the color of the pizel to the color of the pizel already drawn
//change the blending property to THREE.AdditiveBlending, this effect will impact the performances

starsParticlesMaterial.blending = THREE.AdditiveBlending

//When we have a lot of particles , it get really bright cause the pixel drawn will be added to other pixels dad had been drawned

//--------------------------------Different color for each particle-----------------------------------------------------
//We can have a different color for each particle
//First we need to create a Buffer Atribute named colors  
function generateRandomColorBufferAtribute(length){
   //Add a color attribute with 3 values (rgb)
   const colorsArray = new Float32Array(length*3)
   for (let i = 0; i < length*3 ; i++){
       colorsArray[i] = Math.random()
   }

   const colorsAttributeBuffer = new THREE.BufferAttribute(colorsArray, 3);
   return colorsAttributeBuffer;
}
//Once we have our Attribute colors have to notify to the material that we going to use Vertex colors with Material.vertexColor
//If we are using a color property in the material, this color can impact our vertex colors, so we need to deactivate
//starsParticlesMaterial.vertexColors = true;

//----------------------------------------------Animate Particles------------------------------------------------------------
//There is a multiple way of animating particles, because the object Points have inherit from Object3D. We can animate it on the animation section just using the propierties rotation, scale or position in objet 3D

//Other way we can animate each particle.
//We can update each vertex separatly in the particles attributes position array.

//And we can animate each particle 

//To continue go to the animate function



// Mesh of Points - Particles 
const sphereParticles = new THREE.Points(particlesGeometry, sphereParticlesMaterial);
scene.add(sphereParticles)

const randomParticles = new THREE.Points(randomParticlesGeometry, starsParticlesMaterial);
scene.add(randomParticles);

//Scene configuration

camera.position.set(0, 0, 5)

//Gui

const gui = new GUI;

//Sphere particles
const sphereParticlesGui = gui.addFolder('Shere Particles');

sphereParticlesGui.add(sphereParticles, 'visible');
sphereParticlesGui.add(sphereParticles.scale, 'x', 0.1, 3).name('Sphere size').onChange((size)=>{
    sphereParticles.scale.x = size;
    sphereParticles.scale.y = size;
    sphereParticles.scale.z = size;
});
sphereParticlesGui.add(sphereParticlesMaterial, 'size', 0.01, 0.5).name('Particles size');



//Random particles generator folder
const randomParticlesGui = gui.addFolder('Random Particles');

randomParticlesGui.add(randomParticles, 'visible');
randomParticlesGui.add(particlesNumber, 'number').onChange(()=>{
    randomParticlesGeometry.setAttribute('position', generateRandomPositionsBufferAtribute(particlesNumber.number));
});
randomParticlesGui.add(randomParticles.scale, 'x', 0.005, 2).name('size').onChange((size)=>{
    randomParticles.scale.x = size;
    randomParticles.scale.y = size;
    randomParticles.scale.z = size;
})
randomParticlesGui.add(particlesNumber, 'isAnimated', 0, 50000, 20).name('Waves Animation').onChange((value)=>{
    if (!value){
        randomParticlesGeometry.setAttribute('position', generateRandomPositionsBufferAtribute(particlesNumber.number));
    }
});

//Animate
const clock = new THREE.Clock();

const tick = ()=>{
    const time = clock.getElapsedTime();

    //--------------------------------Animate each particle---------------------------------------------------
    //Because this array contains the particles positions we have to go 3 by 3
    if(particlesNumber.isAnimated){
        for (let i = 0 ;i < particlesNumber.number; i++){
            const i3 = i * 3 //We can use this number tu acces different axes we use i3, if we add to it 0 we acces to all the x axes, add 1 acces to all the y axes and if we add 2 acces to z axes
            
            //To make this animate like waves, we need to aply an offset to the sinius so that we get that wave shape, we can use the x coordinate
            const x = randomParticlesGeometry.attributes.position.array[i3 + 0];
            
            randomParticlesGeometry.attributes.position.array[i3+1] = Math.sin(time + x);
            //this isnt working cause wee three.js needs to be norigied when a geometry aattribute changes
            //Set the needsUpdate to true on the position attribute
            randomParticlesGeometry.attributes.position.needsUpdate = true;
    
            //You should avoid this animations, have a big performance cost because is a lot of work for the computer, so this is a  bad idea.
            //If you whant to do this kind of animation is by using your own shader
        }
    }

    //--------------------------------------------------------------------------------------------------------

    //Sphere Particles
    sphereParticles.rotation.y = time*Math.PI/10
    

    // randomParticles.rotation.y = -time*Math.PI/8

    //Controls
    orbitControls.update();
    //Render
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

console.timeEnd('Threejs')
tick();