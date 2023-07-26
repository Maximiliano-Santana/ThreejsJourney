import './style.css';

import * as THREE from 'three';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';

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
const textureLoader = new THREE.TextureLoader(loadingManager);

const gradient = textureLoader.load('/textures/gradientTextures/3.jpg');
gradient.magFilter = THREE.NearestFilter;

//Scene 
const scene = new THREE.Scene();

//Camera 
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

const camera = new THREE.PerspectiveCamera(50, sizes.width/sizes.height, 0.1, 100);
cameraGroup.add(camera)

//Renderer
const canvas = document.querySelector('.experience')
const renderer = new THREE.WebGLRenderer({
    canvas: canvas, 
    //here we can make the background transparent of the canvas
    alpha:true
}); 
//Also we can chanve the color of the renderer backround with 
//renderer.setClearColor(new THREE.Color('#220022'))

//And we can change the amoun of the alpha with is a value from 0 to 1 the default is 0
renderer.setClearAlpha = 0

renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.width, sizes.height);

//Controls 


//Parameters
const parameters = {
    materialColor: '#2aa0a2',
}

//Lights
const light = new THREE.DirectionalLight('ffffff', 1, 4, 1);
light.position.set(2,1, 1)
light.lookAt(new THREE.Vector3(0, 0, 0))
const lightHelper = new RectAreaLightHelper(light)

const ambientLight = new THREE.DirectionalLight('ffffff', 1)
scene.add(ambientLight);

//Objects
const toonMaterial = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradient,
}) //This mesh toon material have only two colors, but we can change it by adding a gradient texture 

const torusMesh = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.5, 20, 40),
    toonMaterial
)

const cubeMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    toonMaterial
)

const KnotMesh = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.4, 100, 16),
    toonMaterial
)

scene.add(torusMesh, cubeMesh, KnotMesh)

const sectionMeshes = [torusMesh, KnotMesh, cubeMesh]
//Scene Configuration
const objectsDistance = 5


torusMesh.position.y = -objectsDistance*0
torusMesh.position.x = -1.5


KnotMesh.position.y = -objectsDistance*1
KnotMesh.position.x = 1.5

cubeMesh.position.y = -objectsDistance*2
cubeMesh.position.x = -1.25

camera.position.set(0, 0, 5)

//Particles 
const parcilesAmount = 10000

const particlesGoemetry = new THREE.BufferGeometry()
const partilcesPosition = new Float32Array(parcilesAmount*3) 
for (let i = 0; i < partilcesPosition.length; i++){
    partilcesPosition[i] = (Math.random()-0.5)*20;
}
const positionBufferAttribute = new THREE.BufferAttribute(partilcesPosition, 3);

particlesGoemetry.setAttribute('position', positionBufferAttribute);

const particles = new THREE.Points(
    particlesGoemetry, 
    new THREE.PointsMaterial({
        size: 0.02, 
        sizeAttenuation: true, 
        color:'white'
    })    
)


particles.position.y = -5
particles.position.z = -5
scene.add(particles);

console.log(particlesGoemetry)

//Gui


const gui = new GUI();

gui.addColor(parameters, 'materialColor').onChange(()=>{
    toonMaterial.color.set(parameters.materialColor); //We can update the color materia simply with this function without updating the hole object 
});


//-----------------------------------------------Scroll based animation------------------------------
//Sometimes we want the experience to be part of a classic website, it can be in the background to add beauty, but we want it to intregrate propery with the html content

//We will learn to use three.js as a background of a classic html page
//Make the camera translate for follow the scroll 
//discover some tricks to make it more inmersive 
//Add a parallax animation based on the cursor position
//Trigger some animations when arriving at the corresponding sections

//First we could have set the background-color of the pge to the same color as the clearColor, instead, we are going to make the clearColor transparent and only set the background-color on the page
//This can be made activating the alpha on the renderer renderer.alpha = true;
//Also we can change .setClearAlpha and .setClearColor

//Now the scene is ready we can move the camera with the scroll, fist getting an updating the scroll every time scroll happens
let currentSection = 0;
let scrollY = window.scrollY

window.addEventListener('scroll', ()=>{
    scrollY = window.scrollY

    const newSection = Math.round(scrollY/sizes.height)

    if(newSection != currentSection){
        console.log('changed to: ' + newSection)
        currentSection = newSection;
        
        gsap.to(sectionMeshes[currentSection].rotation,
            {
                duration:1.5,
                ease: 'power2.inOut',
                x: '+=6',
                y: '+=3',
                z:'+=1.5'
            }
        );
    }
    
});
//In the tick function we can update the camera with the scroll variable

//--------------------------Parallax effect
//Parallax is the action of seeing one object through different points of view, this is done naturally boy our eyes and its how we feel the depth

//First we need to get the position of the cursor 

const cursor = {
    x: 0,
    y: 0,
}

window.addEventListener('mousemove', (event)=>{
    cursor.x = (event.clientX/ sizes.width)-0.5;
    cursor.y = (event.clientY/ sizes.height) -0.5;
})


//Animate
const clock = new THREE.Clock();
let previousTime = 0;

const tick = ()=>{
    const time = clock.getElapsedTime();
    const deltaTime = time - previousTime;
    previousTime = time;



    //Update objects
    sectionMeshes.forEach((object)=>{
        object.rotation.y += deltaTime*0.1; 
        object.rotation.x += deltaTime*0.15; 
    })
    camera.position.y = (-scrollY/sizes.height* objectsDistance);

    const parallaxX = -cursor.x*0.5;
    const parallaxY = cursor.y*0.5;

    //Update the position camera with the parallax effect
    //With this the parallax effect feel too mechanic an not reallistic, we can get a smooth movement using the Lerp formula
    
    //With this get a lerp effect.
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x)*2 * deltaTime;
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y)*2 * deltaTime;




    
    //-------------------------------My solution    

    // camera.position.y = (-scrollY/sizes.height* objectsDistance);

    // camera.position.x = parallaxX
    // camera.position.y += parallaxY
    // camera.lookAt(new THREE.Vector3(0, camera.position.y-parallaxY, 0))

    //Render
    
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
} 

console.timeEnd('Threejs')
tick();