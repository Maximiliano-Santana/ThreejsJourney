//To maje an 3D experience we need some things
// scene
// camera
// renderer



//Scene
const scene = new THREE.Scene();


//Cube 
//To create a mesh (something that can be rendered) we need 2 things, the geometry (positions of vertices on space) and a material (the pixels drawn between the vertices).
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({color: 'red'})

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

//Sizes utility to make project work and change easyer
const sizes = {
    width: 800,
    height: 600
}

//Camera

const camera = new THREE.PerspectiveCamera(50, sizes.width/sizes.height); //parameter 1 FOV, parameter 2 Aspect Ratio, it will be (width/height)
camera.position.z = 3;


//Renderer
//It render the scene of your camera POV, the result is drawn into a canvas, Three js will use WebGl to draw thr renderer inside this canvas
//We can create that cancas or we can let three js do it for us.


//Select canvas where is going to render the scene
const canvas = document.querySelector('.experience');

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,

}) 
renderer.setSize(sizes.width, sizes.height) //This will give the sizes to the canvas element 

//Now we need to render all the stuff we made, render is like take a photo of this, so when we call renderer to render the scene three will paint the scene on the canvas.
renderer.render(scene, camera); 




