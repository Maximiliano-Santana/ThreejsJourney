import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('.experience')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
const textureLoader = new THREE.TextureLoader()
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()




/**
 * Update all materials
 */
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial)
        {
            child.material.envMapIntensity = 1
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
    '/static/textures/environmentMaps/0/px.jpg',
    '/static/textures/environmentMaps/0/nx.jpg',
    '/static/textures/environmentMaps/0/py.jpg',
    '/static/textures/environmentMaps/0/ny.jpg',
    '/static/textures/environmentMaps/0/pz.jpg',
    '/static/textures/environmentMaps/0/nz.jpg'
])

scene.background = environmentMap
scene.environment = environmentMap

/**
 * Material
 */

// Textures
const mapTexture = textureLoader.load('/static/models/LeePerrySmith/color.jpg')
mapTexture.colorSpace = THREE.SRGBColorSpace
const normalTexture = textureLoader.load('/static/models/LeePerrySmith/normal.jpg')

// Material
const material = new THREE.MeshStandardMaterial( {
    map: mapTexture,
    normalMap: normalTexture
})


//
const depthMaterial = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking //This will encode the depth in different chanels made the depth material have more presition 

})

// ------------------------------------------ Modified materials ---------------------------------
//Sometimes we need just to modify a material to get somewhere
//There are two way of doing it

//With three.js hooks that let us play with the shaders and indject our code 

//By recreating the material, but following what is done in three.js code. This options is acceptable but the material can be really complex with includes, extensions, defines, uniform, etc.

//--------------------------------- Hooks 
//We can hook the material compilation with the onBeforeCompile property, we have to send a function that will be called automatically before the material get compiled and we have acces to it with a parammeter.

//How do we add content, we will use the #include to inject our code with a native javaScript replace(...)
//We need to understand the code inside the shaders of each materioal 
//For the mesh standard material we use three/src/renderers/shaders/ShaderLib/meshphysical.glsl inside it we have chunks of shaders and is named #inlcude <begin_vertex> the chunk of the material where the vertex are positioned so we can play with it and replace the code.

//To inject our code we  need to acces the shader and replace this bys using JavaScript

//------------ custom uniforms
const customUniforms = {
    uTime: {value: 0},
}


material.onBeforeCompile = (material)=>{

    //In the onBeforeCompile we also have acces to uniforms Add uTime uniform
    //material.uniforms.uTime = { value: 0 }
    //How do we change the u time, we cannot update the uniform in the tick because we can't acces it outside of onBeforeCompile

    //To fix it are multiple ways
    //We are going to create a customUniforms object outside of onBeforeCOmpile
    //And we can retrieve this to the uniforms of the material

    material.uniforms.uTime = customUniforms.uTime;

    //And now we can go to tick function and change it and its working

    //But now the shadows are not working thats why three.js do renders from the lights point of view called shadow maps, when those renders occur all the materials are replaces by another set of materials, that kind of material doesn't twist
    //We need to twist the depth material too 
    //We cannot acces it easily, but we can override it with the poperti custoDepthMaterial and provide it to de mesh and say use that material instead the default.

    //First creathe the depthMaterial is in the materials zone

    //Now we have our depth material we can tell our mesh to use that material where we loaded and then do exaclty what we did here
    //And now we fix the drop shadow (the shadow on other objects)
    //But the core shadow still on the model seems wrong
    //Thats a normals problem
    //Whe we used the roation we rotated the vertex, but the normals keep the same
    
    //The chunk handling the normals first is called beginnormal_vertex

    

    material.vertexShader = material.vertexShader.replace(
        '#include <common>', 
        `
            #include <common>

            uniform float uTime;

            //We can use matrix to made the rotations
            //The rotation will only occur on x and z wich is why we need a 2D rotation matrix
            //But because is a function we need to put it outside the main function
            //thats why we use common cause is in every materials and then we can use that function inside the begin_vertex

            mat2 get2dRotateMatrix(float _angle){
                return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
            }

        `
    );

    //When we add this we have an error cause we declared the same variables so we just need to use it and no declared twice
    material.vertexShader = material.vertexShader.replace(
        '#include <beginnormal_vertex>',
        `
            #include <beginnormal_vertex>

            float angle = sin(position.y + uTime) *0.2;

            mat2 rotateMatrix = get2dRotateMatrix(angle);

            objectNormal.xz = rotateMatrix * objectNormal.xz; 

        `    
    );

    material.vertexShader = material.vertexShader.replace(
        '#include <begin_vertex>', 
        `
            #include <begin_vertex>

            //Then we can use the matrix wit passing an angle
        
            angle = sin(position.y + uTime) *0.2;

            rotateMatrix = get2dRotateMatrix(angle);

            transformed.xz = rotateMatrix * transformed.xz; 

            //Its working but now let animate it 

        `
    );
}

depthMaterial.onBeforeCompile = (material)=>{
    material.uniforms.uTime = customUniforms.uTime;
    material.vertexShader = material.vertexShader.replace(
        '#include <common>', 
        `
            #include <common>

            uniform float uTime;

            //We can use matrix to made the rotations
            //The rotation will only occur on x and z wich is why we need a 2D rotation matrix
            //But because is a function we need to put it outside the main function
            //thats why we use common cause is in every materials and then we can use that function inside the begin_vertex

            mat2 get2dRotateMatrix(float _angle){
                return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
            }

        `
    );
    material.vertexShader = material.vertexShader.replace(
        '#include <begin_vertex>', 
        `
            #include <begin_vertex>

            //Then we can use the matrix wit passing an angle
        

            float angle = sin(position.y + uTime) *0.2;

            mat2 rotateMatrix = get2dRotateMatrix(angle);

            transformed.xz = rotateMatrix * transformed.xz; 

            //Its working but now let animate it 

        `
    );
}


/**
 * Models
 */
gltfLoader.load(
    '/static/models/LeePerrySmith/LeePerrySmith.glb',
    (gltf) =>
    {
        // Model
        const mesh = gltf.scene.children[0]
        mesh.rotation.y = Math.PI * 0.5
        mesh.material = material
        mesh.customDepthMaterial = depthMaterial
        scene.add(mesh)

        // Update materials
        updateAllMaterials()
    }
)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 2, - 2.25)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap
renderer.useLegacyLights = false
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Update material 
    customUniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()