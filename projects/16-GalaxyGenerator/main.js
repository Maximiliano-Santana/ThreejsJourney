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
camera.position.set(0, 5, 8)
camera.lookAt(new THREE.Vector3(0,0,0))


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

//Galaxy
const galaxyParameters = {
    count: 100000,
    branches: 5,
    spin: 0.9,
    randomness: 2,
    randomnessPower: 4, 
    radius: 5,
    particleSize: 0.025,
    insideColor: '#FF6600',
    outsideColor: '#9381D9',
    
}

let galaxyGeometry = null
let galaxyMaterial = null;
let galaxyPoints = null;

const generateGalaxy = ()=>{
    //Destroy Objects
    if(galaxyPoints){
        galaxyGeometry.dispose(); //This method will free the memory of the galaxy geometry
        galaxyMaterial.dispose(); //This will free the memory of the galaxy material
        scene.remove(galaxyPoints); //This method will remove things in the scene
    }
    
    //We need to mix the colors 
    const insideColor = new THREE.Color(galaxyParameters.insideColor);
    const outsideColor = new THREE.Color(galaxyParameters.outsideColor);


    
    //Position and color
    const positionArray = new Float32Array(galaxyParameters.count*3);
    const colorsArray = new Float32Array(galaxyParameters.count*3);
    
    
    for (let i = 0 ; i < galaxyParameters.count*3; i++){
        
        const radius = Math.random()* galaxyParameters.radius;
        const spinAngle = radius * galaxyParameters.spin;
        const branchAngle = (i % galaxyParameters.branches)/galaxyParameters.branches * Math.PI * 2//(Math.PI/galaxyParameters.branches);
        
        if(i < 10 ){
            console.log(i, branchAngle)
        }
        
        const i3 = i * 3;
        
        const randomX = Math.pow(Math.random(), galaxyParameters.randomnessPower) * (Math.random()< 0.5 ? 1 : -1)
        const randomY = Math.pow(Math.random(), galaxyParameters.randomnessPower) * (Math.random()< 0.5 ? 1 : -1)
        const randomZ = Math.pow(Math.random(), galaxyParameters.randomnessPower) * (Math.random()< 0.5 ? 1 : -1)
        
        positionArray[i3 + 0] = Math.cos(branchAngle + spinAngle)*radius + randomX; //Add the particles in different angles
        positionArray[i3 + 1] = randomY*0.5; 
        positionArray[i3 + 2] = Math.sin(branchAngle + spinAngle)*radius + randomZ*2;
        
        //Colors
        //To mix the colors we can create a third color by cloning the insideColor and use the lerp() method to mix it with the color outside 
        const mixedColor = insideColor.clone();
        mixedColor.lerp(outsideColor,  radius*0.3)

        colorsArray[i3 + 0] = mixedColor.r
        colorsArray[i3 + 1] = mixedColor.g
        colorsArray[i3 + 2] = mixedColor.b



        
    }
    
    //Position buffer
    const galaxyPositionBufferAttribute = new THREE.BufferAttribute(positionArray, 3);
    
    galaxyGeometry = new THREE.BufferGeometry();
    
    //Color buffer
    const galaxyColorBufferAttribute = new THREE.BufferAttribute(colorsArray, 3);
    

    galaxyGeometry.setAttribute('position', galaxyPositionBufferAttribute);
    galaxyGeometry.setAttribute('color', galaxyColorBufferAttribute)    


    
    galaxyMaterial = new THREE.PointsMaterial({
        size: galaxyParameters.particleSize,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
    })
    

    galaxyPoints = new THREE.Points(galaxyGeometry, galaxyMaterial);

    scene.add(galaxyPoints);
}

generateGalaxy();


//Objects

// const proton = new THREE.Mesh(
//     new THREE.BoxGeometry(1,1,1),
//     new THREE.MeshBasicMaterial({color:'white'})
// );

// scene.add(proton);

//Scene Configuration


//Gui

const gui = new GUI;

const galaxyGui = gui.addFolder('Galaxy');

galaxyGui.add(galaxyParameters, 'radius', 1, 10, 0.1).name('Galaxy Radius').onFinishChange(generateGalaxy);
galaxyGui.add(galaxyParameters, 'branches', 1, 10, 1).name('Galaxy Branches').onFinishChange(generateGalaxy);
galaxyGui.add(galaxyParameters, 'spin', -3, 3, 0.1).name('Galaxy Spin').onFinishChange(generateGalaxy);
galaxyGui.add(galaxyParameters, 'randomness', -2, 2, 0.01).name('Randomness').onFinishChange(generateGalaxy);
galaxyGui.add(galaxyParameters, 'randomnessPower', 1, 10, 0.01).name('Randomness Power').onFinishChange(generateGalaxy);
 

galaxyGui.add(galaxyParameters, 'count', 100, 100000, 100).name('Stars Count').onFinishChange(generateGalaxy);
galaxyGui.add(galaxyParameters, 'particleSize', 0.001, 0.05, 0.001).name('Stars Size').onFinishChange(generateGalaxy);

galaxyGui.addColor(galaxyParameters, 'insideColor').onFinishChange(generateGalaxy);
galaxyGui.addColor(galaxyParameters, 'outsideColor').onFinishChange(generateGalaxy);

//Animate
const clock = new THREE.Clock();

const tick = ()=>{

    //Update Objects
    

    //Controls
    orbitControls.update();
    //Render
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

console.timeEnd('Threejs')
tick();