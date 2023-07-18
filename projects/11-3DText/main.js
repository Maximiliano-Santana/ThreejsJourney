import './style.css';
import * as THREE from 'three';
import { gsap } from 'gsap';
import GUI from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


THREE.ColorManagement.enabled = false

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  aspect: window.innerWidth/window.innerHeight,
}

//Textures
const loadingManager = new THREE.LoadingManager();
loadingManager.onLoad = ()=>{
  console.log('Textures loaded')
}

const textureLoader = new THREE.TextureLoader(loadingManager);
const textMatcapTexture = textureLoader.load('/resources/texture/13.png');


//Resize

window.addEventListener('resize', ()=>{
  //Update Sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  //Update Camera 
  camera.aspect = sizes.width/sizes.height;
  camera.updateProjectionMatrix();
  //Update renderer 
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
});

//FullScreen
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

//Axes help
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

//Camera
const camera = new THREE.PerspectiveCamera(50, sizes.aspect, 0.1, 100);

//Renderer 

const canvas = document.querySelector('.experience');
const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//Controls 

const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;
orbitControls.enabled = true;

//------------------------------------------Text 3D
//First we need to use TextBufferGeometry, we also need a particular font famully format called typeface
//To convert  a font on typedace we can use tools like gero3 facetype.js on github
//Or we can use the fonts provided by Threejs, go to /node_modules/three/examples/fonts folder, we can take the fonts and put then into resources folder or we can import it directly

// import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
// console.log(typefaceFont);

// To load the font we are going to use FontLoader
//First of all we need to import the font loader and the text geometry.
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

//const url = '/node_modules/three/examples/fonts/helvetiker_bold.typeface.json'
const url = '/resources/fonts/CodeBold_Regular.json'

const fontLoader = new FontLoader();

//We need tu pass the path and then the promise whet is loades then we need to create the geometry
//Creating a text geometry is long and hard for the computer, avoid doing it too many times and keep the geometry as low poly as possible by reducing the curve segments and bevel segments. 
fontLoader.load(
  url,
  (font)=>{
    const textGeometry = new TextGeometry('Maximiliano', {
      font: font,
      size: 0.5,
      height: 0.25,
      curveSegments: 5,
      bevelEnabled: true,
      bevelThickness: 0.04, 
      bevelSize: 0.02,
      bevelOffset: 0.0,
      bevelSegments: 4
    });
    //Once we added the text, is not centered so to center it we have two solutions 
    //Using the bounding 
    //The bounding is an information associated with the geomtery that tells what space is taken by that geometry, it can be a boz or a sphere.
    //It helps threejs calculate if the objet is on the screen (frustum culling) we are going to use the bounding measures to recenter the geometry
    //By default threejs is using sphere bounding, calculate the box bounding with computeBoundingBox();
    //Instead of moving the mesh, we are going to move the whole geometry with translate()
    
    // textGeometry.computeBoundingBox(); //To center the geometry
    // console.log(textGeometry.boundingBox);
    // textGeometry.translate(
    //   -(textGeometry.boundingBox.max.x-0.02) * 0.5, //Because the beable, the boundingBox * 0.5 is not the exacte center thats why have to substract the bevelSize on x & y and bevelThiknes on z
    //   -(textGeometry.boundingBox.max.y-0.02) * 0.5,
    //   -(textGeometry.boundingBox.max.z-0.04) * 0.5
    // );

    //The other solution is to use the .center() method from BufferGeometry inherit
    textGeometry.center();
    const textMaterial = new THREE.MeshMatcapMaterial({matcap: textMatcapTexture});

    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    scene.add(textMesh);
  },
)


//Light 
const pointLight = new THREE.PointLight('0xffffff', 1);
pointLight.position.set(-4, 2, 2)

//Objects 
const TorusGeometry = new THREE.TorusGeometry(2.7, 0.5);
const donutGeometry = new THREE.TorusGeometry(0.5, 0.30, 20, 30);
const torusMaterial = new THREE.MeshMatcapMaterial({matcap: textMatcapTexture});


console.time('donuts');
 
for(let i = 0; i < 200; i++){
  const donut = new THREE.Mesh(donutGeometry, torusMaterial);
  donut.position.set(
    (Math.random()-0.5)*30,
    (Math.random()-0.5)*30,
    (Math.random()-0.5)*30,
    )
    donut.rotation.x = (Math.random()*Math.PI*2);
    donut.rotation.y = (Math.random()*Math.PI*2);
    donut.rotation.z = (Math.random()*Math.PI*2);
    
    const scale = Math.random()+0.2;
    donut.scale.x = scale;
    donut.scale.y = scale;
    donut.scale.z = scale;
    
    scene.add(donut);
  }

  console.timeEnd('donuts')
  
  const torusMesh = new THREE.Mesh(TorusGeometry, torusMaterial);

scene.add(pointLight, torusMesh);

camera.position.set(-13, 6, 25);
camera.lookAt(new THREE.Vector3(0,0,0));

//Animate 

const clock = new THREE.Clock();

const tick = () => {
  const time = clock.getElapsedTime();
  //Move Objects
  torusMesh.rotation.x = Math.cos(time)*Math.PI*4 
  


  //Render
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);

}

tick();