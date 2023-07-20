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
    count: 5000,
    particleSize: 0.02,
    radius: 5,
    branches: 4,
    spin: 1,
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

    const positionArray = new Float32Array(galaxyParameters.count*3);

    for (let i = 0 ; i < galaxyParameters.count*3; i++){
        
        const radius = Math.random()* galaxyParameters.radius;
        const spinAngle = radius * galaxyParameters.spin;
        const branchAngle = (i % galaxyParameters.branches)/galaxyParameters.branches * Math.PI * 2//(Math.PI/galaxyParameters.branches);

        if(i < 10 ){
            console.log(i, branchAngle)
        }


        const i3 = i * 3;

        positionArray[i3 + 0] = Math.cos(branchAngle + spinAngle)*radius;
        positionArray[i3 + 1] = (Math.random()-0.5)*0;
        positionArray[i3 + 2] = Math.sin(branchAngle + spinAngle)*radius;
    }
    
    const galaxyPositionBufferAttribute = new THREE.BufferAttribute(positionArray, 3);
    
    galaxyGeometry = new THREE.BufferGeometry();
    
    galaxyGeometry.setAttribute('position', galaxyPositionBufferAttribute);
    
    
    galaxyMaterial = new THREE.PointsMaterial({
        size: galaxyParameters.particleSize,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
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


galaxyGui.add(galaxyParameters, 'count', 100, 10000, 100).name('Stars Count').onFinishChange(generateGalaxy);
galaxyGui.add(galaxyParameters, 'particleSize', 0.001, 0.05, 0.001).name('Stars Size').onFinishChange(generateGalaxy);


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