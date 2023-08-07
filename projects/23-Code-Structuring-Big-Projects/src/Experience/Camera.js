import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

//Inside the camera we need to acces to de Experience, so that way we can make the orbit controls and sizes of the camera
//First import the experience
import Experience from "./Experience";

export default class Camera {
    constructor(){
        //One wey to acces the experience is using the global variable we've created in the experience
        //isn't a good practice so we can use other solution
        // this.experience = window.experience
        // console.log('My camera')
        
        
        //Also we can acces to the ecperience canvas and sizes using parameters by sending the camera by sending the experience itself with 'this'
        //Is a good way to solve it but ypu have to send a lot of parametters

        //By doing this we have acces to the first experience and all the stuff inside it
        this.experience = new Experience();
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.setInstance();
        this.setOrbitControls();
    }

    setInstance(){
        this.instance = new THREE.PerspectiveCamera(
            35,
            this.sizes.width/ this.sizes.height,
            0.1,
            100
        )
        this.instance.position.set(6, 4, 8)
        this.scene.add(this.instance);
    }

    setOrbitControls(){
        this.controls = new OrbitControls(this.instance, this.canvas);
        this.controls.enableDamping = true;
    }

    //We need to update the camera when resiza occurs, we could listen to the resize event on the Size class, but instead we are going to propagate the resize from the experience to the children

    resize(){
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix();
    }

    //Also we need to update thi class on each fram for the OrbitControls and damping
    update(){
        this.controls.update();
    }
}