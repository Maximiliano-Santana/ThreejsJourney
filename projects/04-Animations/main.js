import './style.css'
import * as THREE from 'three';

const scene = new THREE.Scene();

const boxGeometry = new THREE.BoxGeometry(1,1,1);
const boxMaterial = new THREE.MeshBasicMaterial({color: 'blue'});

const cube = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(cube);

const canva = document.querySelector('.experience');

const sizes = {
  height: window.innerHeight,
  width: window.innerWidth
}

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height);

const renderer = new THREE.WebGLRenderer({
  canvas: canva,
})
renderer.setSize(sizes.width, sizes.height);


camera.position.set(0,0,5);
camera.lookAt(cube.position);

//To animate we need to render frames like stop motion, but sometimes computers have higer or lower framerates, so if the speed of animation depends to framerate, it is a problem cause the speed of the animation would'nt be the same on 60fps as 140fps, thats why to solve this proble we can make that the animation look the same regardless of the framerate.
//We neet to update objects and do a render on each frame we are going to do that in a function window.requestAnimationFrame()

//The purpose of requesAnimationFrame is to call the function provided on the next frame.


//Animation with speed problem

const tick1 = ()=>{ //Creat the function for each tick or frame 
  
  //Update objects
  cube.rotation.y += 0.01;

  //Render
  renderer.render(scene, camera);

  //Animation request
  window.requestAnimationFrame(tick1); //We saying that call the next tick on the next frame of our screen so now we can display as much frames as the computer user can display
}
//tick1();

//The past animation it is working, but we have a problem and it is cause the speed of animation depends on speed of framerate



//---------------------Solution adapt animation to framerate-------------------------------

//Lets fix it to do this there are many ways, this time were going to adapt to the framerate, it would be like animate depending the real time.
//Using how much time it's been since the last tick. 
//Compare the current time with the previous time, and its going to be the delta (time beetween frames)

let lastTime = Date.now(); //Get the time that animation it started

const tick2 = ()=>{ 
  //Time
  const currentTime = Date.now(); //Get the current time
  const deltaTime = currentTime - lastTime; //Get delta time
  lastTime = currentTime; //Update the last time to actual time for the next tick
  console.log(deltaTime);

  //Ubdate Object
  cube.rotation.y += 0.001 * deltaTime; //The idea of this is the cube rotation is more or less on each frame depending in framerate, so it will be the same for all 
  

  //Render
  renderer.render(scene, camera);

  //Animation request
  window.requestAnimationFrame(tick2); 
}
//tick2();

//----------------------------------------Clock-------------------------------------------
//Is a built solution inside three js, first we have to build a clock, is a class

const clock = new THREE.Clock();

const tick3 = ()=>{ 
  //Clock
  const elapsedTime = clock.getElapsedTime(); // This method return the time in seconds since de clock was created
  console.log(elapsedTime)
  //Ubdate Object
  cube.position.x = Math.sin(elapsedTime); // We are creating a function that describes the position on the x axies of the cube along the time elapsed. If you search for Sin(x) graph is a wave.
  cube.position.y = Math.cos(elapsedTime);
  camera.lookAt(cube.position)

  //Render
  renderer.render(scene, camera);

  //Animation request
  window.requestAnimationFrame(tick3); 
}
tick3();