import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'



/**
 * Base
 */
// Canvas
const canvas = document.querySelector('.experience')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const displacementTexture = textureLoader.load('resources/textures/displacementMap.png')

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
camera.position.set(2, 2, 6)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    powerPreference: 'high-performance',
    antialias: true
})
renderer.useLegacyLights = false
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio)

/**
 * Test meshes
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshStandardMaterial()
)
cube.castShadow = true
cube.receiveShadow = true
cube.position.set(- 5, 0, 0)
//scene.add(cube)

const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 128, 32),
    new THREE.MeshStandardMaterial()
)
torusKnot.castShadow = true
torusKnot.receiveShadow = true
//scene.add(torusKnot)

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial()
)
sphere.position.set(5, 0, 0)
sphere.castShadow = true
sphere.receiveShadow = true
//scene.add(sphere)

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial()
)
floor.position.set(0, - 2, 0)
floor.rotation.x = - Math.PI * 0.5
floor.castShadow = true
floor.receiveShadow = true
//scene.add(floor)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, 2.25)
scene.add(directionalLight)

//------------------------------------- Performances ------------------------------------------------------------------

//-------------------------------- Monitoring fps
//We should target a 60 fps
//There can be two main limitations 
//The CPU
//The GPU
//Keep an eye on the performances and testt across multiple devices, keep an eye on the weight of the website

//We need to measuer the performances, first is to know the fps is running
//We can use a library named stats.js
import Stats from 'stats.js'

//Stats instatiate it
const stats = new Stats();
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

//Disable the fps limit 
//We can init chrome framerate with the comand prompt
//start chrome --args --disable-gpu-vsync --disable-frame-rate-limit
//If you are using a good computer but while you unlock the fps and you are close to 60fps there is a problem

//------------------------------- Monitoring draw calls
//The draw calls are actions of drawing by the GPU, is WebGL stuff
//The less draw calls you have, the better
//To monitor this draw call we can use the extension Spector.js

//It record everything about 1 frame, and  stop the record. if you have many draw calls 


//------------------------------ Renderer informations
//Use and log this, this will return an object with things storing in the memory, geometries, textures.

console.log(renderer.info);

//------------------------------ Good javascript code
//Keep a performant native JavaScript code especially in the tick function 

//------------------------------ Dispose of things
//Once you are absolutely sure you don't need a resource like a geometry or a material of it you deed to dispose it to larn how to do it read the next documentation of three.js

// scene.remove(cube)
// cube.geometry.dispose()
// cube.material.dispose()

//https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects

//-------------------------------- Lights
//Avoid the lights on three.js are bad for performances
//Use baked lights
//If you don't have a choice use a sheap lights (AmbientLight, DireciontalLight, Hemisphere light)

//-------------------------------- Avoid adding or removing lights
//When adding or removing light from the scene, all the materials supporting lights will have to be recompiled

//-------------------------------- Shadows 
//Avoid to use shadows, better to use baked shadows 

//Optimizee shadow maps 
//By changing the size of the shadow camera and using camera helper, and changing the shadow.mapSize.set()

directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 6
directionalLight.shadow.camera.left = - 6
directionalLight.shadow.camera.bottom = - 2
directionalLight.shadow.camera.far = 10
directionalLight.shadow.mapSize.set(1024, 1024)

const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
//scene.add(cameraHelper)

//Use castshadow and receive shadow wisely
//If some objects do not recieve shadows deactivate and activate cast shadows or recieve shadows only when is necesarry

cube.castShadow = true
cube.receiveShadow = false

torusKnot.castShadow = true
torusKnot.receiveShadow = false

sphere.castShadow = true
sphere.receiveShadow = false

floor.castShadow = false
floor.receiveShadow = true

//Deactivate shadow auto update
//If you have a scene that the lights doesn't move, you don't need to update shadows on wach frame.
renderer.shadowMap.autoUpdate = false
renderer.shadowMap.needsUpdate = true

//------------------------------ Textures
//Textures take a lot of space in the GPU memory, especially with mipmaps
//The texture file weight has nothing to do with that, and only the resolution matters
//Try to reduce the resolution to the minimum while keeping a decent result

//Keep apower of two resolutions 
//Whe nresizing, three.js will trhy to fix it buy resizing the image to the closest power of two resolutions. Doesn't have to be a square

//Use the right formats
//You can use .jpg or .png according to the image and the compression but also the alpha channel

//Use online tools like tinypng

//You can try the basis format 
//Basis is a format just like .jpg and .png but the compression is powerfull and the format can be read by the GPU more easily
//Unfortunantely, it can be hard to generate and it`s lossy compression
//https://github.com/BinomialLLC/basis_universal

//--------------------------------- Geometries
//Do not update bertices 
//Updating hte vertices of a geometry is terrible for the performances avoid doing it in the tick function
//If you need to animate the vertices, do it with a vertex shader

//mutualize geometries
//fo not create new geometries or materials if you already have one

// const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
// const material = new THREE.MeshNormalMaterial()

// for(let i = 0; i < 50; i++)
// {
    
//     const mesh = new THREE.Mesh(geometry, material)
//     mesh.position.x = (Math.random() - 0.5) * 10
//     mesh.position.y = (Math.random() - 0.5) * 10
//     mesh.position.z = (Math.random() - 0.5) * 10
//     mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2
//     mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2

//     scene.add(mesh)
// }

//merge geometries
//We can merge the geometries into one, thats because each object causes une drawcall and is bad for performances
//If you are not supposed to move, you can merge them by using the BufferGeometryUtils

//First import it

// import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// //Create an array and push the geometries
// const geometries = [];

// const material = new THREE.MeshNormalMaterial()

// for(let i = 0; i < 50; i++)
// {
//     const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
//     geometry.rotateX((Math.random() - 0.5) * Math.PI * 2)
//     geometry.rotateZ((Math.random() - 0.5) * Math.PI * 2)


//     geometry.translate(
//         (Math.random() - 0.5) * 10,
//         (Math.random() - 0.5) * 10,
//         (Math.random() - 0.5) * 10
//     )
// |
//     geometries.push(geometry);

// }

// console.log(geometries)

// //Create a meged geometry variable and use the method megeGeometries();
// const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries);
// console.log(mergedGeometry);
// scene.add(new THREE.Mesh(mergedGeometry, material))

//-------------------------------- Materials
//The same fo not create the same materials muktiple times

//--------------------------------- Meshes
//Use instancedMesh
//If you merge everything together you can't move each cube without updating all the vertices of the geometry
//There is a solutions is instancedMesh
//It's like mesh, but you create only one instancedMesh, and provide a transformation matrix for each "inscance" of that mesh
//The matrix has to be a Matrix4 and you can apply any transformation by using the various avalible methods.


import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const geometries = [];

const box = new THREE.BoxGeometry(0.5, 0.5, 0.5);


const material = new THREE.MeshNormalMaterial()

//Create instanceMesh.
//Provide how many instances you are going to add
const instanceMesh = new THREE.InstancedMesh(box, material, 50)
//scene.add(instanceMesh)



for(let i = 0; i < 50; i++)
{
    const quaternion = new THREE.Quaternion();
    quaternion.setFromEuler(new THREE.Euler( (Math.random() - 0.5) * Math.PI * 2, (Math.random() - 0.5) * Math.PI * 2))

    const matrix = new THREE.Matrix4();
    matrix.makeRotationFromQuaternion(quaternion);

    const position = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
    )
    matrix.setPosition(position);

    //Provide this matrix tu the mesh 

    instanceMesh.setMatrixAt(i, matrix);

}

//If you intend to change these matrices in the tick function add fucntion, add to the InstancedMesh
instanceMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

//------------------------------------- Models
//Alway try to use low poly models, the fewer plygons, the better, if you need details, can use normal maps


//-------------------------------------- Draco compression
//If you have a lot of details and vertices, and a complex model use the draco compression. 

//------------------------------------ GZip
//Gzip is a compression happending on the server side, bost of the servers don't gzip files such as .glb, .gltf, .obj, etc.
//See if you can figure out how to fix that, depending on the server you are using

//----------------------------------- Cameras 
//When object are not in the field of view, they won't be rendered (frustum culling).
//That can seem like a tawdry solution, but you can just reduce the camera's field of view.
//Reduce the near and the far

//----------------------------------- Renderer
//Pixel ratio, always limit the pixel ratio of some devices that have a pixel ratio higher than 2

//Power preferences
//Some devices may be able to switch between different GPU or different GPU usage
//We can give a hint on what power is required when initialiting the WebGLRenderer by speciying a powePreference property
renderer.powerPreference = 'high-performance';

//Antialiass
//The default antialias is performant, but less performant than no antialias 
//Only add it if you have visible aliasing and no performance issue

//------------------------------------- Post processing 
//Limit passe
//Each post-processing pass will take as many pixels as the render's resolutuion including the pixel ratio to render
//If you have a 1920x1080 resolution with 4 passes and a pixel ratio of 2, that makes 1920*2*1080*2*4 = 33 177 600 pixels to render
//Try to regroup your custom passe into one.

//------------------------------------- Shaders
//Specigy the Precision
//Whe you use a shaderMaterial you can force the rpecision of the shader in the amterials by changign their precision property
//By default WebGL uses mediump but lowp is greate but sometimes it might causes issues it depend on your project

//Keep code simple, keep yous shader codes as simple as possible, avoid use of if statements 
//Make good use of swizzles and built-in functions

//Use textures
//If you create a perlin noise is bad if you calculate it 
//Sometimes you should use a texture
//Wont be eable to animate it 

//Use defines 
//Uniforms are beneficial because we can tweak them and animate the values in the JavaScript, but they have a performance cost
//If the values isn't supposed to change, you can use defines by using inside the shader
//#define uDisplacementStrength 1.0 
//Or you can send it from the material by adding a defines propertie
// defines:{
//     Name: 1.5;
// }

//Do the calculations in the vertex shader
//Try to do the calculations in the vertex shader and send the valuse to the fragment shader by using varyings

const shaderGeometry = new THREE.PlaneGeometry(10, 10, 256, 256)

const shaderMaterial = new THREE.ShaderMaterial({
    precision: 'lowp',
    uniforms:
    {
        uDisplacementTexture: { value: displacementTexture },
    },
    vertexShader: `
        uniform sampler2D uDisplacementTexture;
        #define uDisplacementStrength 1.5
        
        varying vec2 vUv;
        varying vec3 vFinalColor;

        void main()
        {

            //Position
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);

            float elevation = texture2D(uDisplacementTexture, uv).r;
            elevation = clamp(elevation, 0.5, 1.0);

            modelPosition.y += elevation * uDisplacementStrength;

            gl_Position = projectionMatrix * viewMatrix * modelPosition;

            //Calculate colors
            float colorElevation = max(elevation, 0.25);

            vec3 depthColor = vec3(1.0, 0.1, 0.1);
            vec3 surfaceColor = vec3(0.1, 0.0, 0.5);
            vec3 finalColor = mix(depthColor, surfaceColor, elevation);

            //Varyings
            vFinalColor = finalColor;
            vUv = uv;
        }
    `,
    fragmentShader: `
        uniform sampler2D uDisplacementTexture;

        varying vec2 vUv;
        varying vec3 vFinalColor;

        void main()
        {
            gl_FragColor = vec4(vFinalColor, 1.0);
        }
    `
})

const shaderMesh = new THREE.Mesh(shaderGeometry, shaderMaterial)
shaderMesh.rotation.x = - Math.PI * 0.5
scene.add(shaderMesh)


/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    //Update stats
    stats.begin()
    
    const elapsedTime = clock.getElapsedTime()

    // Update test mesh
    torusKnot.rotation.y = elapsedTime * 0.1

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
    
    stats.end();
}

tick()



/**
 * Tips
 */


//