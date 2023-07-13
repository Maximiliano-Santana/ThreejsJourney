import * as THREE from 'three';

//Scene
const scene = new THREE.Scene();


//Cube 

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({color: 'red'})
const cube = new THREE.Mesh(geometry, material);
//scene.add(cube);

//Sizes utility to make project work and change easyer
const sizes = {
    width: 800,
    height: 600
}

//Camera

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height); 
camera.position.set(1, 1, 3)


//Renderer
const canvas = document.querySelector('.experience');

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,

}) 
renderer.setSize(sizes.width, sizes.height)  

renderer.render(scene, camera); 


//Position is complicated but we can get some help of AxesHelper with


const axesHelper = new THREE.AxesHelper(3); //The parameter set the length of the axes helpers  
scene.add(axesHelper);



//There are 4 propierties to transform objects 
// position
// scale
// rotation
// quaternion: Is like a rotation

//----------------------------------Position----------------------------------------------

//Al classes that inherit of object3D have those propierties (camera, mesh, etc).
//All those properties will be compiled in matrices

//Position let move objects 
//Position is not just an object, it is a Vector3, is a class that it can be used to position things in space. And thats why it has a lot of methods.

cube.position.y = 0.5; //1 is whatever you want (1cm, 1m, 1ft,1km) 

//-----------Vector3 Methods----------

console.log(cube.position.length()) //With this method of Vector3D im getting the length of the Vector3, it means that it return de distance from de 0 position to the position of the object

console.log(cube.position.distanceTo(camera.position))// This method returns de distance between the position of the object to the position of the object in the parameters

console.log(cube.position.distanceTo(new THREE.Vector3(0,0,0)))//As we see, every instance of object3D has a propiertie postion that is a vector 3, so whe can create vectors from this class and use it, like this example, we put a new Vector3 to calculate the distance bewtwen the cube and de imaginary vector we created.

cube.position.normalize();//This method make that the distance of the vector value turn to 1 but still keep the direction.

cube.position.set(0.5, 0.5, 0.5) // This method let us to set a position like a vector
console.log(cube.position)


//-----------------------------------Scale------------------------------------------------
//To scale an object is the same
cube.scale.x = 1.5 
cube.scale.y = 0.5 

cube.scale.set(1.5, 0.5, 1);

console.log('Scale cube')
console.log(cube.scale)


//-----------------------------------Rotation---------------------------------------------
//To do a rotation is harder cuase we have 2 ways to do it 
// rotation propiertie
// quartenion propiertie

//Rotarion
//Has x, y and z, but is'nt a Vectror3, it actually is a Euler
//To manage rotation we need to manage like Radians a 360 degree rotation is a 2 times Pi, so...

//Be carefull cause if you rotate something, the axies of rotation still are global, so if you rotate in 'x', the 'y' axis will change from the cube, if you loose control for that it called gimball lock, so to fix it, you can use reorder. That will be reorder the rotation axies to according to the local axes of the object

cube.rotation.reorder('YXZ')
cube.rotation.y = Math.PI/4 // 1 time PI is 180 degrees
cube.rotation.x= Math.PI/2

//Euler is Easy to understand, but this axies order can be problematic, thats why we need Quaternions. We get the same result but on a different matematical way.
//Quaternion are harder to understand 


//Object3D instances have a lookAt() methot wich rotates the object so that its -z faces the target provided, the target must be a Vector3

camera.lookAt(cube.position)

//-----------------------Group------------------------
// You can put objects inside groups and use position, rotation (or quaternion), and scale on those groups and that will be aplicated to all the objects beeing a group
//To do that you can use group class


const group = new THREE.Group()
scene.add(group);

//Create de objects of the group
const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(0.5,0.5,0.5),
  new THREE.MeshBasicMaterial({color: 0xff0000}),
)
const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(0.5,0.5,0.5),
  new THREE.MeshBasicMaterial({color: 0x00ff00}),
)
const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(0.5,0.5,0.5),
  new THREE.MeshBasicMaterial({color: 0x0000ff}),
)

//Set positions of cubes
cube1.position.set(1, 0, 0)
cube2.position.set(-1, 0, 0)
cube3.position.set(0, 0, 1)

//Add cubes to the group
console.log('Group created');
group.add(cube1);
group.add(cube2);
group.add(cube3);

group.position.set(0, 0.1, 0)
group.scale.x = 1.5;
group.scale.y = 2;









renderer.render(scene, camera); 
