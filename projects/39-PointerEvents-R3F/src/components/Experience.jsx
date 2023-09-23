import { OrbitControls, meshBounds, useGLTF } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from 'three'

export default function Experience(){

    const box = useRef();

    //Before handling mouse events used to be tricky
    //We needed a Raycaster, cast rays (sometimes on each fram) and tested intersecting objects that we had to put in arrays, etc
    //R3F has made that process much easier and we won't even have to implement a Raycaster, all we need to do is add a onClick attribute to an object in scene (like a <mesh>) and provide it with a function

    //Let's change the color of the box when we click on it 

    //Also we can have acces to tthe event information for example:
    //distance
    //point
    //uv
    //object
    //eventObject    
    //x
    //y

    //Also we have other events like
    //onContextMenu: When the context menu should appear, on desktop with a Richt Click or Ctrl + left clic on mobile by pressing down for some time
    //onDoubleClick: when we double click on the same object, the delay bewtween the first and second click is defined by the OS
    //onPointerUp: We ealease to click (left or righ) or touch
    //onPointerDown: The same in oposite
    //onPointerOver & onPointerEnter: When the cursor or finger just went above the object both work similar but Over is for multiple enters on the children of the object we are intersectig in at once and pointerEnter only will get one event when the mouse get over
    //onPointerOut and onPointerLeave
    //onPointerMove: is trigger on each frame
    //onPointerMissed: When the user clicks outside of the object, we can add it on the Canvas and it will be triggered if we click (when cthe click realased) but none of the listen object have registered a hit

    //-------------------- Occluding
    //By default an object intersects between the object with the event and other object, the event will work
    //To occlude we are going to listen to the onClick event on the sphere too tell that event to stop propagating the event
    //We are going to vall the stop propagation
    
    //-------------------- Cursor
    //On a desktop, one solution to ensure that a user understand that an object is clickable, is to trandsform the cursor into a finger cursor.
    //Wee need to know when the mouse enters the cube and when the mouse leaves the cube 
    //Add a onPointerEnter and a onPointerLeave attributes to the cube
    
    //Now we need to change the cursor from the canvas or the body on depend the aplication
    //We need to acces the canvas with the hook useThree

    //This works, but there is a helper for that on drei
    //useCursor helper

    //--------------------Events on complex objects
    const hamburguer = useGLTF('/hamburger.glb')

    //We can lisent to events on the hamburguer 
    //If we click we get one event for each object
    //Also we can test on what object we clicked acces on the event.object 
    //We just need to stop propagation


    //-------------- Performances
    //Listening to pointer events is quite a taxing task for the cpu
    //Avoid events that need to be tested on each frame
    //onPointerOver, onPointerEnter, onPointerOut, onPointerLeave, onPointerMove
    //Minimise the number of objets that listen to events and avoid testing complex geometries 
    //If you notices a freeze youll have to more optimization
    
    //--------- Mesh Bounds
    //We have a solutin to this wich is a helper
    //meshBounds
    
    //Instead of testing the geometry we have the meshBounds will create a theoretical sphere around the mesh (called bounding sphere)
    //And thr pointer events will be tested on that sphere instead of testing the geometry of the mesh, beshBounds ongly works on single meshes

    //Send it to the cube mesh using the raycast attribute

    //Bvh
    //If you have a very complex geometries and still ned the pointer events to be accurate, you can aslo use the BVH (Boundig volume hierachy)
    //Is a much more complex approach, but made easy with the useBVH helper from drei 


    const eventHandler = (event) =>{
        box.current.material.color.set(`hsl(${Math.random()*360}, ${Math.random()*100}%, ${Math.random()*100}%)`)
    }
    const eventEnter = ()=>{
        console.n('wheel')
    }


    return<>
        <OrbitControls/>

        <color args={['#1b1b1b']} attach="background"/>
        <ambientLight/>

        <mesh 
            raycast={meshBounds}

            onClick={eventHandler} 
            ref={box}  
            onPointerEnter={()=>{ document.body.style.cursor = 'pointer' }}
            onPointerLeave={()=>{ document.body.style.cursor = 'default' }}
        >
            <boxGeometry/>
        </mesh>
        

        <mesh position={[-2, 0, 0]} onClick={(event)=>{event.stopPropagation()}} >
            <sphereGeometry/>
        </mesh>

        <primitive
            object={hamburguer.scene}
            scale={0.25}
            position-x={2}
            onClick={(event)=>{console.log(event.object.name); event.stopPropagation()}}
        />
    </>
}