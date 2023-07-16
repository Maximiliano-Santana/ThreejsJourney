import './style.css';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap';
import GUI from 'lil-gui';



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

const camera = new THREE.PerspectiveCamera(50, sizes.aspect); 
camera.position.z = 3;

//Renderer

const canvas = document.querySelector('.experience');

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
}) 
renderer.setSize(sizes.width, sizes.height) 
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
//Controls 

const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;
//orbitControls.enabled = false;

//GUI

//const gui = new GUI();


//------------------------------------------Textures--------------------------------------------
//There are many types of textures, this textures are based on PBR principles (Physically Based Rendering), this renderings follow real life, becoming a standard for realistic renders, and many softwares are using it.

//Texture is a Three js class, we provide a image and it transform the image to a image more gpu friendly.

//----------Color Texture
//This is the most simple, used just to add color texture to a material
//----------Alpha Texture
//Is a grayscale image, the white part will be visible and black not visible.
//----------Height Texture
//Grayscale image that move the vertices to create some relief, need enough subdivision
//---------- Texture Normals
//A blue and red texture, add details regarding, dosent need subdivision, the vertices won't move , lure the light abouth the face orentation, better performances than adding a height texture 
//---------- Ambient Oclusion
//Grayscale image, It will add fake shadouse in crevices, not physically accurate, help to create contrast and see dataild 
//---------- Texture Metalnes
//When its white is metalic, when is not, is not metalic.
//---------- Texture Roughness
//Grayscale image in duo with metalness, white is riough, black is smooth, mostly for light dissipation

//----------------How to load textures there are many ways 

//JavaScript native 
const image = new Image();
const texture = new THREE.Texture(image); //Create the texture

image.onload = ()=>{ //Once we loaded the image to use it we need to convert it to a texture
  texture.needsUpdate = true; //Update the object Texture with the texture we loaded
}

image.src = './door-texture/color.jpg';

//Texture Loader, Three js have TextureLoaders, there ara a class used it to load teaxtures easyer.
//We can send 3 functions after the path, 
//load- when the image loaded successfully 
//progres- when the loading is progressing
//error- if something went wrong 


//Using loadint manager
//Loading Manager is a Three js class to mutualize the events 
const loadingManager = new THREE.LoadingManager();

// loadingManager.onStart = () => {
//   console.log('onstart')
// }
// loadingManager.onLoad = () => {
//   console.log('on loaded')
// }
// loadingManager.onProgress = () => {
//   console.log('on progress')
// }
// loadingManager.onError = () => {
//   console.log('on error')
// }

const TextureLoader = new THREE.TextureLoader(loadingManager); //Instanciate the texture loader 
const colorTexture = TextureLoader.load('/door-texture/color.jpg'); 
const colorDiamondTexture = TextureLoader.load('/textures/minecraft.png'); 
const alphaTexture = TextureLoader.load('/door-texture/alpha.jpg'); 
const ambientOcclusionTexture = TextureLoader.load('/door-texture/ambientOcclusion.jpg'); 
const heightTexture = TextureLoader.load('/door-texture/height.png'); 
const metalicTexture = TextureLoader.load('/door-texture/metalic.jpg'); 
const normalTexture = TextureLoader.load('/door-texture/normal.jpg'); 
const roughnessTexture = TextureLoader.load('/door-texture/roughness.jpg');


//Cube 
const geometry = new THREE.BoxGeometry(1, 1, 1)

const material = new THREE.MeshBasicMaterial({color: 'red'});
const doorMaterial = new THREE.MeshBasicMaterial({map:  colorDiamondTexture});

const cube = new THREE.Mesh(geometry, doorMaterial);
scene.add(cube);


//------------------------------------------------UV Unwrapping----------------------------------------------------------
//Each Vertex will have a 2D coordinate on a flat plane (ussually a square)

//To understand this you can acces to the attributes of the geometries who contains the uvs, the uvs is a attributeBuffer who contains a float32array, with the coordinates of vertices of 2 axies, this coordinates will help to position the texture on the geometry 

//Those uv coordinates are generated by three.js, if you create your own geometry youll have to specify the uv coordinates, 
//console.log(geometry.attributes.uv);

//---------Transforming the texture 
// //repeat: It is a Vector2, so it have Vector2 propierties. The result is that the last pixel is repeating, and it gets streched. 
// colorTexture.repeat.x = 1
// colorTexture.repeat.y = 1
// //wrapS wrapT: is a propierto who dictams how is the texture repeating
// //To that be fixed we can change that with THREE.RepearWrapping or MirroredReperWrapping on thre wrapS and wrapT propierties, 
// colorTexture.wrapS = THREE.RepeatWrapping
// colorTexture.wrapT = THREE.RepeatWrapping

// //offset: Is vector 2, is the desplacement of the texture

// colorTexture.offset.x = 0;
// colorTexture.offset.y = 0;

// //rotation: Is the rotation in a 2D space this rotation happens from a pivot vertex, if i wanto to the texture rotates from the middle, i have to move this pivot point at the center, with the center propiertie which is a vetor2 
// colorTexture.rotation = Math.PI;
// colorTexture.center.x = 0.5;
// colorTexture.center.y = 0.5;

//-----------------------------------------------Filtering and mip mapping--------------------------------------------------
//Mip Mapping is a technic that consist of creating half a smaller version of a texture again and again until we get a 1x1 texture, all those texture variations are sent to the gpu, and the gpu will choose the mosr appropriate version of the texture.
//This textures are used on depending the amount of pixels we are looking.
//This is already handled by three js, and the gpu but we can choose different two algorithms to use this.


//Minification filter

//Happens when the pixels of the texture are smaller than the pixels of the render in other words, the texture is too big for durgaces it covers.

//We can change the minification filter of the texture using the minFilter property with those 6 values
// THREE.NearestFilter: Make the same but the texture turns more sharp
// THREE.LinearFilter
// THREE.NearestMipmapNearestFilter
// THREE.NearestMipmapLinearFilter
// THREE.LinearMipmapNearestFilter
// THREE.LinearMipmapLinearFilter (default)

colorDiamondTexture.generateMipmaps = false; //Using nearest filters is better for performance, cause on minFilter, we dont need mipmapping. So we can deactivate them with .generateMipmaps
colorDiamondTexture.minFilter = THREE.NearestFilter;

colorTexture.minFilter = THREE.NearestFilter;

//Magnification filter 

//It happens when the texture is not enought to cover the pixels of the render, it strech the pixels of the texture and maje it look blurry.
//Thats grate but it depends the context, if you want to get a minecraft style whis magnification filter will make your blocks look blurry.
//We can change the mafnification filter of the textures using the magFilter property with those 2 values.
//THREE.NearestFilter
//THREE.LinearFilter (default)
colorDiamondTexture.magFilter = THREE.NearestFilter;
colorTexture.magFilter = THREE.NearestFilter;

//---------------------------------------------------Texture format and optimization-------------------------------------------
//When preparing your texture keep in pind 3 crucial elements.
//The diffuculty is to fin the right combination of texture format and resolutions

//-----The weight: The users will have to download all the textures. To better performance we have to find the way to keep the weight of our files the minimum as posible.

//.jpg - lossy compression but usually lighter.
//.png - lossless compression but usually heavier.
//bases compresion
//You can use compression software (tinypng.com) 

//-----The size:
 
//Each pixel of the textures will have to be stored on the gpu regardless of the images weight, gpu has storage limitations, its even worse becaus mipmapping increasses the number of pizels to store. Try to reduce the size of your images as much as possible.  
//When ussing mipmapping, we have to use images that can be divided by two, if is not, three js will rezise your image, and it have a performance cost

//-----The data:

//Textures support transparency, but we can't have transparency in .jpg if we want to have only one texture that combine color and apha, we better use .png.
//If we are using a normal texture we need the exact values witch is why we shouldn't apply lossy compression and we better use .png fot those
//Sometimes we can combine different data into une texture by using a the red, green, blue and alpha chanel seperatly

//----------------Where to find textura
//poliigon.com
//3dtextures.me
//arroway-textures.ch

//Animation
const clock = new THREE.Clock();

const tick = ()=>{
  const elapsed = clock.getElapsedTime();
  //cube.rotation.y = Math.sin(elapsed)*Math.PI;
  
  orbitControls.update();
  
  renderer.render(scene, camera); 
  window.requestAnimationFrame(tick);
}
tick();





