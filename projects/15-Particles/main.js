import './style.css';

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

import gsap from 'gsap';
import GUI from 'lil-gui';

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


//----------------------------------------------------------------Particles---------------------------------------------------------------------
//Can be created to do rain, dust, fire, etc.
//You can have thousands of them whit reasonable frame rate 
//Each particles is composed of a plane (two triangles) always faceing the camera
//Creating particles is like creating a Mesh, we need a geometry (BufferGeometry), Material (PointsMaterial), A Points instance (instead of a Mesh)

//Instanciate any BufferGeometry, each vertex of the geometry will become a particle 

//Geometry
const particlesGeometry = new THREE.SphereGeometry(1, 32, 32);

//---------------------------------------------Challenge, make a random particles generator------------------------------------------

//First of all we need to get the FloatArray32 who contains all the particles positions, and fill it with random values

var particlesNumber = {
    number: 1000,
}

function generateRandomPositionsBufferAtribute(length){
    const ArrayPosition = new Float32Array(length*3); //Multiply the number of particles per 3 cause each particle need 3 vertex
    
    for (let i = 0; i < ArrayPosition.length; i++){ //Function for that fill the array with random numbers
        ArrayPosition[i] = (Math.random()-0.5)*10;
    }
    
    //Once we have the Array Positions we need to instanciate a Atribute Buffer, so then we can add the Atribute Buffer to the position attribute of the Buffer Geometry
    const positionsBufferAttribute = new THREE.BufferAttribute(ArrayPosition, 3);//Pass the Array positions and number of of vertex of each particle will need to create the Buffer Atribute
    return positionsBufferAttribute;
}

const randomParticlesGeometry = new THREE.BufferGeometry() //Create the buffer geometry will contain the attributeBuffer  

randomParticlesGeometry.setAttribute('position', generateRandomPositionsBufferAtribute(particlesNumber.number)); // Now set to the randomParticlesGeometry the position atribute with the function set atribute
//------------------------------------------------------------------------------------------------------------------------




//Material
const whiteParticlesMaterial = new THREE.PointsMaterial({
    color:'white', 
    size:0.02, 
    sizeAttenuation: true, //with this option the particles will have perspective if particle is far, the particle will display smaller. False is better for performance 
});

const sphereParticlesMaterial = new THREE.PointsMaterial({
    size:0.02,
    sizeAttenuation: true,
})

// Mesh of Points - Particles 
const sphereParticles = new THREE.Points(particlesGeometry, sphereParticlesMaterial);
scene.add(sphereParticles)

const randomParticles = new THREE.Points(randomParticlesGeometry, whiteParticlesMaterial);
scene.add(randomParticles);



// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1,1,1),
//     new THREE.MeshBasicMaterial({color:'white'})
// );

// console.log(cube.geometry.attributes)

camera.position.set(0, 0, 5)

//Gui

const gui = new GUI;

//Sphere particles
const sphereParticlesGui = gui.addFolder('Shere Particles').close();

sphereParticlesGui.add(sphereParticles, 'visible');
sphereParticlesGui.add(sphereParticles.scale, 'x', 0.1, 3).name('Sphere size').onChange((size)=>{
    sphereParticles.scale.x = size;
    sphereParticles.scale.y = size;
    sphereParticles.scale.z = size;
});
sphereParticlesGui.add(sphereParticlesMaterial, 'size', 0.01, 0.5).name('Particles size');



//Random particles generator folder
const randomParticlesGui = gui.addFolder('Random Particles').close();

randomParticlesGui.add(randomParticles, 'visible');
randomParticlesGui.add(particlesNumber, 'number').onChange(()=>{
    randomParticlesGeometry.setAttribute('position', generateRandomPositionsBufferAtribute(particlesNumber.number));
});
randomParticlesGui.add(randomParticles.scale, 'x', 0.005, 2).name('size').onChange((size)=>{
    randomParticles.scale.x = size;
    randomParticles.scale.y = size;
    randomParticles.scale.z = size;
})


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