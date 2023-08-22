import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { gsap } from 'gsap'

const loadingBarElement = document.querySelector('.loadingBar');
/**
 * Loaders
 */

const loadingManager = new THREE.LoadingManager()
loadingManager.onLoad = ()=>{
    window.setTimeout(()=>{
        gsap.to(overlayMaterial.uniforms.uAlpha, {duration: 3, value: 0})
        loadingBarElement.style.transform = '';
        loadingBarElement.classList.add('ended');
    }, 500)
}

//---------------------------------------- Progress callback 
//The progress callback returns 3 arguments
//URL of the assets
//How many items has been loades
//How many items have to be loaded

loadingManager.onProgress = (assetUrl, itemsLoaded, itemsTotal)=>{     
    const progressRatio = itemsLoaded/itemsTotal;
    loadingBarElement.style.transform = `scaleX(${progressRatio})`;
}

const gltfLoader = new GLTFLoader(loadingManager)
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)

/**
 * Base
 */
// Debug
const debugObject = {
    envMapIntensity: 1,
}

// Canvas
const canvas = document.querySelector('.experience')

// Scene
const scene = new THREE.Scene()

//Overlay

const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
const overlayMaterial = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    uniforms:{
        uAlpha: { value: 1 },
    },
    vertexShader: `
        void main(){
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uAlpha;
        
        void main(){
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `
});

//Now we have the overlay we need to know when every thing is loaded
//To know that we can use a LoadingManager as a parameter in all loaders

//Now create a loading bar 
//We are in local and its to fast to load but we cam simulate a normal Bandwidth 
//To do it go to devtools and activate Disable cache 

//Then click on the dropdown menu with the Online value 

//--------------------------- Now lets create de loading bar
//We should create it with a new plane and fill it with shaders but this time we are going to create it on html just to practice the mix bewtween html and three.js

//At the end of the load the animation is jumpy, thats because two reasons
//When we add meshes to the scene, materials, etc, those things get compiled and loaded to the GPU and it can take a few milisecons
//The bas didn't finished its animation because there is a 0.5s transition on it

//To fix this problems we just can wait a little

//---------------------------- Mixing HTML and WebGL
//Is ussually bad for performances, just because add gtml above the WebGL
//Keep an eye on the framerate


const overlayMesh = new THREE.Mesh(overlayGeometry, overlayMaterial);
scene.add(overlayMesh);

/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            // child.material.envMap = environmentMap
            
            child.material.envMapIntensity = debugObject.envMapIntensity
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    'static/textures/environmentMaps/0/px.jpg',
    'static/textures/environmentMaps/0/nx.jpg',
    'static/textures/environmentMaps/0/py.jpg',
    'static/textures/environmentMaps/0/ny.jpg',
    'static/textures/environmentMaps/0/pz.jpg',
    'static/textures/environmentMaps/0/nz.jpg'
])

environmentMap.colorSpace = THREE.SRGBColorSpace

scene.background = environmentMap
scene.environment = environmentMap


/**
 * Models
 */
gltfLoader.load(
    'static/models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(10, 10, 10)
        gltf.scene.position.set(0, - 4, 0)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)

        updateAllMaterials()
    }
)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, - 2.25)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 1
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()