import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'
import GUI from 'lil-gui'




THREE.ColorManagement.enabled = false
//Sizes 
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

//Resize

window.addEventListener('resize', ()=>{
  //update sizes 
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  //update camera
  camera.aspect = sizes.width/sizes.height
  camera.updateProjectionMatrix();
  //update rendere
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

//Textures
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader();

//Fullscreen
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

//Scene 
const scene = new THREE.Scene();

//Camera 
const camera = new THREE.PerspectiveCamera(50, sizes.width/sizes.height, 0.1, 100);
camera.position.set(-3, 2, 9);

//Renderer
const canvas = document.querySelector('.experience');
const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//controls 
const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;
orbitControls.enabled = true;

//-------------------------------------------------------Lights----------------------------------------------------
//----------Ambient light
//Applies omniditectional lighting, recives color and intensity, can bes used to simulate light bouncing
const ambientLight = new THREE.AmbientLight('0xffffff', 0.5);
ambientLight.visible = false;

//----------Directional Light
//Will have a sun effect as if the sun way wew travelling in parallel
const directionalLight = new THREE.DirectionalLight('0xffffff', 1);
//We can change the orientation by using
directionalLight.position.set(0, 2, 0);
directionalLight.visible = false;

//---------Hemisphere light
//Is similar to ambient light, have two colors of lights one from sky and one for ground
const hemisphereLight = new THREE.HemisphereLight('0xffffff', '0xffffff', 1);
hemisphereLight.visible = false;

//---------PointLight
//The poinlight is almost like a lighter, the light start at an infinitely small point spreads uniformly in every direction 
//Recive color, intensity, dinstance and the decay.
//Distance is the fade distance
//Decay is how fast the light decay
const pointLight = new THREE.PointLight('0xffffff', 1);
pointLight.visible = false;

//--------Rect Area Light
//Works like a big rectangle lights. Its a mix between a directional light and a diffuse light
//It recives color, intensity, width, height.
const rectAreaLight = new THREE.RectAreaLight('0xffffff', 10, 2, 2);
rectAreaLight.position.z = 5;
rectAreaLight.visible = false;

//--------Spot Light
//Is a light that iluminates like a flashlight just on a radius direciton like a cone
//It reciver color, intensity, distance, angles, penumbra, decay
const spotLight = new THREE.SpotLight('0xffffff', 1, 10, Math.PI/5, 0.25, 1);
spotLight.position.set(0, 4, 0)
//We cant rotate the spotlight with look at, it works different, to do that we need to add its rarget property to the scene and move itand add the taget to the scene
spotLight.target.position.x = 0;
spotLight.target.position.y = -1;
spotLight.visible = false;
scene.add(spotLight.target);


scene.add(ambientLight, directionalLight, hemisphereLight, pointLight, rectAreaLight, spotLight);

//--------------------------------------------------Performance---------------------------------------------------
//Lights can cost a lot when it comes to performances, try to add as few lights as possible and try to use the lights that cost less.
//Minimal Cost: Ambient Light and Hemisphere Light
//Moderate Cost: Directional Light & Point Light
//High Cost: Spot Light and Rect Area Light

//Baking, when you need to have a loot of lights.
//The idea is to bake the light into the texture, whis can be done in 3D software, the drawback is that we cannot move the light anymore, and we have to load huge textures.

//------------------Helpers, to assist us to positioning the light
const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2);
hemisphereLightHelper.visible = false;

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
directionalLightHelper.visible = false;

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
pointLightHelper.visible = false;

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
spotLightHelper.visible = false;

//This have to be imported 
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper';

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
rectAreaLightHelper.visible = false;

scene.add(hemisphereLightHelper, directionalLightHelper, pointLightHelper, spotLightHelper, rectAreaLightHelper);

//Geometries
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const planeGeometry = new THREE.PlaneGeometry(10,10);
const sphereGeometry = new THREE.SphereGeometry(1)
const torusGeometry = new THREE.TorusGeometry(0.75, 0.25);

//Materials
const whiteMaterial = new THREE.MeshStandardMaterial({roughness:0});

//Meshes
const cubeMesh = new THREE.Mesh(cubeGeometry, whiteMaterial);
const planeMesh = new THREE.Mesh(planeGeometry, whiteMaterial);
const sphereMesh = new THREE.Mesh(sphereGeometry, whiteMaterial);
const torusMesh = new THREE.Mesh(torusGeometry, whiteMaterial);



planeMesh.rotation.x = -Math.PI/2;
planeMesh.position.y = -2

sphereMesh.position.x = -2.5;
torusMesh.position.x = 2.5;

pointLight.position.set(5, 5, 5)

scene.add(cubeMesh, planeMesh, sphereMesh, torusMesh);

//--------------GUI

const gui = new GUI();

const lightsGui = gui.addFolder('Lights');
//lightsGui.close();


//Ambient Light Folder
const ambientLightGui = lightsGui.addFolder('Ambient Light').close();

ambientLightGui.add (ambientLight, 'visible')
ambientLightGui.add(ambientLight, 'intensity', 0, 2, 0.1)
ambientLightGui .addColor(ambientLight, 'color')


//Directional Light Folder
const directionalLightGui = lightsGui.addFolder('Directional Light').close();

directionalLightGui.add(directionalLight, 'visible');
directionalLightGui.add(directionalLight, 'intensity', 0, 4);
directionalLightGui.addColor(directionalLight, 'color');
directionalLightGui.add(directionalLightHelper, 'visible').name('helper');

//Directional Light Position Folder
const directionalLightPositionGui = directionalLightGui.addFolder('Position').close().onChange(()=>{
  directionalLightHelper.update();
})

directionalLightPositionGui.add(directionalLight.position, 'x', -7, 7, 0.01).name('position X');
directionalLightPositionGui.add(directionalLight.position, 'y', -1.5, 10, 0.01).name('position Y');
directionalLightPositionGui.add(directionalLight.position, 'z', -7, 7, 0.01).name('position Z');

//Hemisphere Light Folder

const hemisphereLightGui = lightsGui.addFolder('Hemisphere Light').close().onChange(()=>{
  hemisphereLightHelper.update();
});

hemisphereLightGui.add(hemisphereLight, 'visible');
hemisphereLightGui.add(hemisphereLight, 'intensity', 0, 3)
hemisphereLightGui.addColor(hemisphereLight, 'color').name('Sky color');
hemisphereLightGui.addColor(hemisphereLight, 'groundColor').name('Ground color')
hemisphereLightGui.add(hemisphereLightHelper, 'visible').name('helper');

//Point Light Folder

const pointLightGui = lightsGui.addFolder('Point Light').close();

pointLightGui.add(pointLight, 'visible');
pointLightGui.add(pointLight, 'distance', 0, 100);
pointLightGui.add(pointLight, 'decay', 0, 10);
pointLightGui.addColor(pointLight, 'color');
pointLightGui.add(pointLightHelper, 'visible').name('helper');


//Point Light Position Folder
const pointLightPositionGui = pointLightGui.addFolder('Position').close();
pointLightPositionGui.add(pointLight.position, 'x', -7, 7, 0.01).name('position X');
pointLightPositionGui.add(pointLight.position, 'y', -1.5, 10, 0.01).name('position Y');
pointLightPositionGui.add(pointLight.position, 'z', -7, 7, 0.01).name('position Z');

//Rect Area Light Folder
const rectAreaLightGui = lightsGui.addFolder('Rect Area Light').close().onChange(()=>{
  rectAreaLight.lookAt(cubeMesh.position);
});
rectAreaLightGui.add(rectAreaLight, 'visible');
rectAreaLightGui.add(rectAreaLight, 'intensity', 0, 10);
rectAreaLightGui.addColor(rectAreaLight, 'color');
rectAreaLightGui.add(rectAreaLightHelper, 'visible').name('helper');


//Rect Area Light Position Folder
const rectAreaLightPositionGui = rectAreaLightGui.addFolder('Position').close();

rectAreaLightPositionGui.add(rectAreaLight.position, 'x', - 5, 5).name('Position X');
rectAreaLightPositionGui.add(rectAreaLight.position, 'y', -1, 5).name('Position Y');
rectAreaLightPositionGui.add(rectAreaLight.position, 'z', - 5, 5).name('Position Z');

//Rect Area Light Size Folder

const rectAreaLightSizeGui = rectAreaLightGui.addFolder('Size').close();

rectAreaLightSizeGui.add(rectAreaLight, 'width', 0, 10);
rectAreaLightSizeGui.add(rectAreaLight, 'height', 0, 10);

//Spot Light Folder
const spotLightGui = lightsGui.addFolder('Spot Light').close().onChange(()=>{
  spotLightHelper.update();
});;

spotLightGui.add(spotLight, 'visible');
spotLightGui.add(spotLight, 'intensity', 0, 5);
spotLightGui.add(spotLight, 'distance', 0, 20);
spotLightGui.add(spotLight, 'angle', 0, Math.PI);
spotLightGui.add(spotLight, 'penumbra', 0, 1);
spotLightGui.add(spotLight, 'decay', 0, 5);
spotLightGui.addColor(spotLight, 'color');
spotLightGui.add(spotLightHelper, 'visible').name('helper');


//Spot Light Position Folder

const spotLightPositionGui = spotLightGui.addFolder('Position').close();
spotLightPositionGui.add(spotLight.position, 'x', -5, 5).name('Position X');
spotLightPositionGui.add(spotLight.position, 'y', -1, 8).name('Position Y');
spotLightPositionGui.add(spotLight.position, 'z', -5, 5).name('Position Z');

//Spor Light Target Position Folder

const spotLightTargetGui = spotLightGui.addFolder('Target Position').close();

spotLightTargetGui.add(spotLight.target.position, 'x', -5, 5).name('Position X');
spotLightTargetGui.add(spotLight.target.position, 'y', -1, 5).name('Position Y');
spotLightTargetGui.add(spotLight.target.position, 'z', -5, 5).name('Position Z');

//Animate

const clock = new THREE.Clock();

const tick = ()=>{
  //Update Controls
  orbitControls.update();
  //Render
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}

tick();
