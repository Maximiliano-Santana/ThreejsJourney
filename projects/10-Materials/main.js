import './style.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap';
import GUI from 'lil-gui';

// Start of the code
THREE.ColorManagement.enabled = false

//Load Manager 

const loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = () =>{
  console.log('Textures loaded')
}

//Load textures
const cubeTextureLoader = new THREE.CubeTextureLoader();


const textureLoader = new THREE.TextureLoader(loadingManager);

const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAmbientOcclustionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const doorHeightTexture = textureLoader.load('/textures/door/height.png');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalic.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

const matcapTexture = textureLoader.load('/textures/matcaps/10.png');
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg');
gradientTexture.generateMipmaps = false;
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;

//The cube loader used to make enviroment map and we have to provide it with 6 textures
const enviromentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/1/px.jpg',
  '/textures/environmentMaps/1/nx.jpg',
  '/textures/environmentMaps/1/py.jpg',
  '/textures/environmentMaps/1/ny.jpg',
  '/textures/environmentMaps/1/pz.jpg',
  '/textures/environmentMaps/1/nz.jpg',
])


//Scene
const scene = new THREE.Scene();

//Sizes

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    aspect: window.innerWidth/window.innerHeight,
}

window.addEventListener('resize', ()=>{
  //Update Sizes (first update all the sizes)
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  //Update Camera 
  camera.aspect = window.innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height) 
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
});

//Full Screen

window.addEventListener('dblclick', ()=>{

  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement){
    if (canvas.requestFullscreen){
      canvas.requestFullscreen();
    } else if (canvas.webkitFullscreenElement){
      canvas.webkitFullscreenElement();
    }
  } else {
    if (document.exitFullscreen){
      document.exitFullscreen();
    } else if (document.webkitFullscreenElement){
      document.webkitFullscreenElement();
    }
  }
})

//Camera

const camera = new THREE.PerspectiveCamera(50, sizes.aspect, 1, 100); 

//Renderer

const canvas = document.querySelector('.experience');

const renderer = new THREE.WebGLRenderer({canvas: canvas,}); 
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

renderer.setSize(sizes.width, sizes.height) 
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 

//Controls 

const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;
//orbitControls.enabled = false;


//---------------------------------------------Materials----------------------------------------
//Materials are used to put a color on each visible pixel of the geometry.   
//The algorithms are written in programs called shaders, to decide what color is going to be each pixel.

//There are many materials:
//--------------------------Mesh Basic Material 
//Have properties can be set in two ways, at instanciating or after it. 

//The color is a class, with methods, to change color exist the method .set
const basicMaterial = new THREE.MeshBasicMaterial();

//Color 
//also we can combine map and color 
// basicMaterial.color.set(new THREE.Color('green'));
basicMaterial.map = doorColorTexture;

//Wireframe
//basicMaterial.wireframe = true;

//Opacity|Alpha
//To use opacity we have to especify the material is transparent.
//basicMaterial.opacity = 0.5;
basicMaterial.transparent = true;

//AlphaMap
//We can combine the alphamap with color texture
basicMaterial.alphaMap = doorAlphaTexture;

//Side 
//lets you decide wich side of a face is visible
//Backside, Frontside, DoubleSide
basicMaterial.side = THREE.DoubleSide;

//This propiertoes it will be able for the next materials.

//----------------------------Mesh Normal Material
//Normals are information that contains the direction of the outside of the face, this material will show the normals information.
//Normals can be used for lighting, reflection, refraction, etc.
const normalMaterial = new THREE.MeshNormalMaterial();

//normalMaterial.wireframe = true

//Also have flat shading
normalMaterial.flatShading = true;

//---------------------------Mesh Matcap Material
//Will display a color by using the normals as a reference to ppick the right color on a texture that look like a sphere.
const meshMatcapMaterial = new THREE.MeshMatcapMaterial();
meshMatcapMaterial.matcap = matcapTexture;
//This material can simulate to have shadows 

//--------------------------Mesh Depth Material
//will simply color the geometry in white if its close to the near and in black if its close to the far value of the camera, it depends of the near and far of the camera. 
//This is util to simulate fogs, preprocesing
const meshDepthMaterial = new THREE.MeshDepthMaterial();

//--------------------------Mesh Lambert Material
//This is the first material who have new propierties related to lights.
//its performant but we can see strange patterns on the geometry 
const meshLambertMaterial = new THREE.MeshLambertMaterial();

//meshLambertMaterial.flatShading = true;

//--------------------------Mesh Phong Material
//This material looks the same as lamber material, but the pattern strange is gone and we can see some light reflection.
//Is less performance than the lambert.

const meshPhongMaterial = new THREE.MeshPhongMaterial();

//we can control the reflections and color of it
meshPhongMaterial.shininess = 100;
meshPhongMaterial.specular = new THREE.Color(0x00ff00);

//--------------------------Mesh Toon Material
//Toon is similar to MeshLambert but cartoonish
const meshToonMaterial = new THREE.MeshToonMaterial();

//We have the control of it providing gradients.
//The magFilter and mipmaps avoid the material look with our specified gradient cause its too small. Using the neares filter and desactivting de mipmapping to better performaces, this code is at textures loading
// gradientTexture.generateMipmaps = false;
// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.magFilter = THREE.NearestFilter;

meshToonMaterial.gradientMap = gradientTexture;

//--------------------------Mesh Standard Material
//This is better, uses physically based rendering principles (PBR), support lights with more realistic algorithms like rougness and metalness
const meshStandardMaterial = new THREE.MeshStandardMaterial()

// meshStandardMaterial.metalness  = 0.1;
// meshStandardMaterial.roughness  = 0;
//meshStandardMaterial.side = THREE.DoubleSide
//Allows to aply a texture
meshStandardMaterial.map = doorColorTexture;

//Ao map
//Ambient oclussion map, will add shadows where the texture is dark, we musdt add asecond set of uv names uv2 ans can change the intensity
meshStandardMaterial.aoMap = doorAmbientOcclustionTexture;
meshStandardMaterial.aoMapIntensity = 2;

//Height texture 
//We need to have enough vertices in oue geometry and can control of the intensity 
meshStandardMaterial.displacementMap = doorHeightTexture;
//meshStandardMaterial.displacementScale = 0.5;

//Metalness and roughness map
meshStandardMaterial.metalnessMap = doorMetalnessTexture;
meshStandardMaterial.roughnessMap = doorRoughnessTexture;

//normal map
meshStandardMaterial.normalMap = doorNormalTexture;
//can control the strong with, it is a vertex 3 so we can use the method .set();
//meshStandardMaterial.normalScale.set()
//

//alpha map 
//To use alpha map you need to activate transparency 
//meshStandardMaterial.normalMap = doorAlphaTexture;
//meshStandardMaterial.transparent = true;



//--------------------------------MeshPhysicalMateril 
//Is the same as mesh Standar material but with support of a clearcoat effect.
const meshPhysicalMateril = new THREE.MeshPhysicalMaterial();

//--------------------------------Points Material
//Can be used to create particles. 
//--------------------------------ShaderMaterial and RawShaderMaterial 
//can both be used to create your own material

//--------------------------------Enviroment Map
//This will maje the objects reflects the sourounds of the scene, used to do the lighting and reflections on the objects
//Is hard to load, we need to use CubeTextureLoader 
meshStandardMaterial.envMap = enviromentMapTexture;

var material = meshStandardMaterial;
//--------------------------------------------------------------------------------------------------------
//Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.set(10, 8, 5);

scene.add(pointLight, ambientLight);


//Objects 

const sphereMesh = new THREE.Mesh(
  new THREE.SphereGeometry(3, 62, 62),
  material
);
const planeMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(6,6, 100, 100),
  material
);
const torusMesh = new THREE.Mesh(
  new THREE.TorusGeometry(2.5, 1, 64, 128),
  material
)

scene.add(planeMesh, sphereMesh, torusMesh);

sphereMesh.position.x = -7;
torusMesh.position.x = 7;
camera.position.z = 22;

//Debug UI 

const gui = new GUI();

gui.add(material, 'metalness', 0, 1, 0.001)
gui.add(material, 'roughness', 0, 1, 0.001)
gui.add(material, 'aoMapIntensity', 0, 3, 0.01)
gui.add(material, 'displacementScale', -1, 1, 0.001)
gui.add(material.normalScale, 'x', -1, 1, 0.001)

//Animation
const clock = new THREE.Clock();

const tick = () => {
  
  //Clock

  const time = clock.getElapsedTime();
  
  //update controls 
  orbitControls.update(); //to damping work correctly 

  //update Meshes
  // torusMesh.rotation.y = (time*0.25)
  // planeMesh .rotation.y = (time*0.25)
  // sphereMesh.rotation.y = (time*0.25)
  // torusMesh.rotation.x = (time*0.25)
  // planeMesh .rotation.x = (time*0.25)
  // sphereMesh.rotation.x = (time*0.25)

  renderer.render(scene,camera);
  window.requestAnimationFrame(tick);
}
tick();



