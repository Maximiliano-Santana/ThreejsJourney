
import './style.css';

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

import CANNON, { Vec3 } from 'cannon'
THREE.ColorManagement.enabled = false

/**
 * Debug
 */
let createSphereParameters = {
  x: 0,
  y: 4,
  z: 0,
  radius: 0.5,
  width: 1,
  height: 1,
  depth: 1,
  createSphere: ()=>{
    createSphere(createSphereParameters.radius, { x: createSphereParameters.x, y:createSphereParameters.y, z:createSphereParameters.z})
  },
  createBox: ()=>{
    createBox(createSphereParameters.width, createSphereParameters.height, createSphereParameters.depth, { x: createSphereParameters.x, y:createSphereParameters.y, z:createSphereParameters.z})
  },
  
  reset: ()=>{
    for(const object of objectsToUpdate){
      //Remove body
      object.body.removeEventListener('collide', playHitSound)
      world.removeBody(object.body)
    
      scene.remove(object.mesh)
      objectsToUpdate.splice(0, objectsToUpdate.length);
      
    }
  }

}

const gui = new dat.GUI()

gui.add(createSphereParameters, 'x', -10, 10);
gui.add(createSphereParameters, 'y', -10, 10);
gui.add(createSphereParameters, 'z', -10, 10);
gui.add(createSphereParameters, 'radius', 0.1, 2);
gui.add(createSphereParameters, 'createSphere');
gui.add(createSphereParameters, 'width', 0.1, 2);
gui.add(createSphereParameters, 'height', 0.1, 2);
gui.add(createSphereParameters, 'depth', 0.1, 2);
gui.add(createSphereParameters, 'createBox');
gui.add(createSphereParameters, 'reset');



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
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/3/px.png',
    '/textures/environmentMaps/3/nx.png',
    '/textures/environmentMaps/3/py.png',
    '/textures/environmentMaps/3/ny.png',
    '/textures/environmentMaps/3/pz.png',
    '/textures/environmentMaps/3/nz.png'
])

/**
 * Physics world
 */
//------------------------------------------------------------Create a world------------------------------------------------------------
//To create a physics worl with cannon is simmilar in other librariesl

const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
//----------------------------- Add gravity
//Now we can add gravity, (gravity is a Vec3 like a vector3 in three js)
world.gravity.set(0, -9.81, 0) //9.81 is the aceleration on earth

//----------------------------- Create objects
// //In cannon we create objects from class Body, Bodies are objects what will fall and collide with othre bodies, but firs we need to create a shape (Box, Cylinder, Plane, Sphere, etc)
// const sphereShape = new CANNON.Sphere (0.5)
// //Then we can create the body by using the shape, we have to provide it with 
// //mass, position, shape
// const sphereBody = new CANNON.Body({
//   mass: 1,
//   position: new CANNON.Vec3(0, 3, 0),
//   shape: sphereShape,
// })
// //Once you created a body, you have to add it to the world, (is like adding meshes to three.js)
// world.addBody(sphereBody);

//Nothing is happening cause we need to the cannon world to update
//To update the world we mus use the step() We are going to do it inside de tick function

//Now the sphere is going trought the flor, to fix that,  we need a new Body using a Plane shape


const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
floorBody.mass = 0; //Set the mass to 0 so that the body is static, we created a body with no parammeter and updated the properties after
floorBody.addShape(floorShape); //You can add multiple shapes to one body, so we can have complex bodies. Now we have a problem si that the plane is creatign looking at other direction than the three.js plane. 
//With cannon.js only support Quaternion and we can use the setFromAxisAngle() method
//This method recieves the rotation axis and the second parameter is the angle
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI/2); 
//If we rotate in other direction it breaks, cause when we use a plane and create an infinite plane and everything bellow is like put a sphere with physics under the ground.

//Contact material
//When our sphere bounce on the floor stop instantly. Cause Cannon don't know the material of the bodies and we can have control of parammeters like friction and bouncing behavior by settin a Material, a Matterial is just a reference and we should create one for each type of material in the scene (plastic, concrete, jelly, etc);

const concreteMaterial = new CANNON.Material('concrete'); //We need to pass it a name
const plasticMaterial = new CANNON.Material('plastic');

//We can create a ContactMaterial wich is the combination of two Materials and how they should collide 
//The first two parameter are the Materials, the third parameter is an object containing collision properties like friction (how much does it rub) and restitution (how much does it bounde) The default value for poth is 0.3

//Create a contact material
const concretePlasticContactMaterial = new CANNON.ContactMaterial(concreteMaterial, plasticMaterial, {
  friction: 0.1,
  restitution: 0.7,
})

//Now we need to add this contact material to the world and we can associate the material with the bodies
world.addContactMaterial(concretePlasticContactMaterial);

// sphereBody.material = plasticMaterial;
// floorBody.material = concreteMaterial;

//Simplify everything and replace the two materials by a default one 

const defaultMaterial = new CANNON.Material('default');
const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial,{
  friction: 1,
  restitution: 0.75
})
world.addContactMaterial(defaultContactMaterial)

// sphereBody.material = defaultContactMaterial;
// floorBody.material = defaultContactMaterial;

//We can also set our material as the default one with the defaultContactMaterial proerty on the world

world.defaultContactMaterial = defaultContactMaterial;

world.addBody(floorBody);
//------------------------------------------------- Apply Forces------------------------------------------------------------ 
//To apply forces we have 4 methods 

//.applyForce - Apply a force from a specified point in the space (not necessarlily on the Bodys surface) Like the wind, a small push on  a domino or a strong force on an angry bird

//.applyImpulse - Like applyForce but insetad of adding to the force, will add to the velocity

//.applyLocalForce - Same as applyForce but the coordinates are local to the Body (0, 0, 0 would be the center of the Body)

//.applyLocalImpulse - Same as applyImpulse but the coordinates are local to the Body


//ApplyLocalForce 
//It recibes the vector with the force applied, and the second parammeter is the vector where the force is applied
// sphereBody.applyLocalForce(new CANNON.Vec3(100, 100, 0), new CANNON.Vec3(0, 0, 0));


//Now we can create mimic the wind by using applyForce() on oposite direction on each frame before updating the world (this will make a constant force) 

//------------------------------------------------- Handling multiple objects-------------------------------------------------
//Handling one or two objects is easy, managing thousand of objecta can be a mess.
//First remove or comment the sphere, the sphereShape and the shpere Body.
//We will create a function thah crate spheres 
//I will do this before the animation function

/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 32, 32),
//     new THREE.MeshStandardMaterial({
//         metalness: 0.3,
//         roughness: 0.4,
//         envMap: environmentMapTexture,
//         envMapIntensity: 1
//     })
// )
// sphere.castShadow = true
// sphere.position.y = 0.5
// scene.add(sphere)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
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
camera.position.set(- 3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * -------------------------------------------------------- Physics -----------------------------------------------------------------
 */

//To make physics we can do it from mathematics and solutions like raycaster, but if you want realistic physics with tension, friction, bouncing, constraints, pivots, etc we need a library.

//The idea is we are going to create a physic world(invisible) and a three.js world(visible), and on each frame we tell this world to update itself, and each update we take the coordinates that the pysic world returns and put it into our three.js world.

//The hard par is organize the code 

//First we have to choose the right library, first of all we neet to chose if we need a 3D library or a 2D library
//We have many physics 3D libraries (Ammo.js) (Cannon.js) (Oimo.js)
//2D librearies (Matter.js) (P2.js) (Planck.js) (Box2D.js)

//There are solutions trying to combine three.js with pyziscs library like Physijs.

//Ammo.js might be the mos used library, but we will use Cannon.js (easier to implement and undesrand);

//----------------------------------------------------------------Events----------------------------------------------------------------
//Also we can hear events on Body like 'colide', 'sleep' or 'wakeup', we are going to play a git sound when element collide

//First we have to load a sound in javascript and create a function to play it
const hitSound = new Audio('/sound/hit.mp3');
const playHitSound = (collision)=>{
  
  const impactStrength = collision.contact.getImpactVelocityAlongNormal()
  
  if(impactStrength > 2){
    


    hitSound.volume = impactStrength*0.05
    hitSound.currentTime = 0;
    hitSound.play();

  }
}
//And now we are going to listen to hte 'collide' event on the Body in createBox
//To do that go where the body box have created

//body.addEventListener('collide', playHitSound);

//This doesent sound grat is strange 
//The first problem is that when we call hitSound.play() while the sound is playing, nothing happends because it is already playing, reset the sound to 0 with the currentTime property

//hitSound.currentTime = 0;

//Secont problem is that we hear too many hit sounds even when a cube lightly touches another
//We need to know how strong the impact was and not play anything if it wasn't strong enough

//To fix that we can get that informacion adding a parammeter on the collide callback

//const playHitSound = (collision)=>{

//Inside the contact properti of the event collision we can have acces to a function that returns the strength of the impact 

//collision.contact.getImpactVelocityAlongNormal()

//The problem is that the sound is really regular so we can add some randombes to the sound volume

//hitSound.volume = Math.random()

//----------------------------------------------------------------Remove things ----------------------------------------------------------------
//First create the reset method
//To remove all we need to loop n the objectsToUpdate


const createSphere = (radius, position) =>{
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 20, 20),
    new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      envMap: environmentMapTexture,
    })
  )
  mesh.castShadow = true;
  mesh.position.copy(position)
  scene.add(mesh);

  //now we have the mesh lets create the cannon body
  const shape = new CANNON.Sphere(radius)
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 0, 0),
    shape: shape,
  })
  body.position.copy(position);
  body.addEventListener('collide', playHitSound);
  world.addBody(body);

  //Save in objects to update
  objectsToUpdate.push({
    mesh: mesh,
    body: body
  })
}

//Create boxes 

const createBox = (width, height, depth, position) =>{
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshStandardMaterial({
      metalness: 0.3,
      roughness: 0.4,
      envMap: environmentMapTexture,
    })
  );
  mesh.castShadow = true;
  mesh.position.copy(position)
  scene.add(mesh);

  //Create box in cannon 
  const shape = new CANNON.Box(new Vec3(width/2, height/2, depth/2)) //In cannon when you want to create a box you have to start at the center of the cube to a corner, is a vector 3
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 0, 0),
    shape: shape,
  })
  body.position.copy(position);

  body.addEventListener('collide', playHitSound);
  
  world.addBody(body);

  //Save in objects update
  objectsToUpdate.push({
    mesh: mesh,
    body: body,
  })
  
}

//Nothing is moving cause we are not updating the world position

//Now we are going to create an array that will contain all the objects that will be updated
const objectsToUpdate = []

//Now in the tick function loop on that array and update the mesh.position with the body position

//----------------------------------------------------- Performances -------------------------------------------------------------
//-------------Broadphase 
//When testing the collision between objects, Cannon aproach to test every Body against every other Body this proces is called broathphase
//This is bad for performances. Is an exponencial graph o performance issues.

//By defaul Cannon uses NaiveBroadphase: tests every bodies against other bodies. But there are other broathphase
//GridBroadphase: Quadrilles the world and only tests Bodies against other Bodies in the same grid box or the neighbors' grid boxes. The only problem this broadphase have is there is a sphere travelling too fast, and it jumps to much lenght between tick, the proadphase can't calculate if the sphere collides in the space it moved between the ticks.
//SAPBroadphase (Sweep And Prune) - tests Bodies on arbitrary axes during multiples steps. //Bruno don't know why but this is better

//To change the broadphase use
//world.broadphase = new CANNON.SAPBroadphase(world)

//---------------- Sleep
//Even if we use an improves broadphase algorithm, all the bodies are tested even those not moving anymore
//When the Body speed gets really slow the Body can fall asleep and won't be a tested unlesss a sufficient force is applied
//To set the sleeper we can use 
//world.allowSleep = true;

/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;
  

    // Update physics world


    // //Mimic the wind creating a constant force recieves the force vector and the vector where the force is applied 
    // sphereBody.applyForce(new CANNON.Vec3(-0.05, 0, 0), sphereBody.position)

    // //We need to provide it (A fixed time step, how much time passed since the last step (delta time), how much iterations the world can apply to catch up wit a potential delay)

    // //For the time step we want our experience to run at 60fps we will use 1/60 we will get the same result on higher framerate screens
    world.step(1/60, deltaTime, 3)

    // sphere.position.copy(sphereBody.position)  

    //Updatinga array of objets to update
  for (const object of objectsToUpdate){
    object.mesh.position.copy(object.body.position)
    object.mesh.quaternion.copy(object.body.quaternion) //now we are updating the rotation
  }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()