import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { gsap } from 'gsap'


let sceneReady = false;
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
    window.setTimeout(()=>{
      sceneReady = true;
    }, 2000);
}

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

//----------------------------------------- Mixing HTML
//We are going to create one HTML pont and add the other ones at the end and stylize it with css and animate it

//We are going to use an array of objects with each object correwsponding to one point

//Each point object will have two properties
const points = [
  {
    position: new THREE.Vector3(1.55, 0.3, -0.6),
    element: document.querySelector('.point-0'),
  },
  {
    position: new THREE.Vector3(-1.4, -1, -0.5),
    element: document.querySelector('.point-1'),
  },
  {
    position: new THREE.Vector3(-1.4, 2.5, 0.5),
    element: document.querySelector('.point-2'),
  },

]
//Ray caster
const rayCaster = new THREE.Raycaster();

//We are going to update position on depends the webGL, and to do it we need to update it on each frame

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

    if(sceneReady){
      //Go through each point
      for (const point of points){
        //We need to get the 2D screen position of the 3D scene position of the poing
        //To convert it we are going to use the position of the point and use the method .project();
        const screenPosition = point.position.clone();
        screenPosition.project(camera);
        //Now we just need to multiply by half the size of the render
        const translateX = screenPosition.x * sizes.width * 0.5;
        const translateY = - screenPosition.y * sizes.height * 0.5;
        point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
        
        //Now the element is like is inside the webgl but still we can see it even if the vector isn't visible
    
        //To do it we are going to use the RayCaster
        //We are going to test each point, will shoot a ray from the camera and if it not intersecting with something, the point would show
        //If something intersect then we will test with the distance if the point is in front of the mesh.
        rayCaster.setFromCamera(screenPosition, camera);
        const intersects = rayCaster.intersectObjects(scene.children, true);
        console.log(intersects)
        if(intersects.length === 0){
          point.element.classList.add('visible')
        } else {
          const intersectionDistance = intersects[0].distance;
          const pointDistance = point.position.distanceTo(camera.position);
          if (intersectionDistance > pointDistance) {
            point.element.classList.add('visible')
          }else{
            point.element.classList.remove('visible')
          }
        }
      }
    }


    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()