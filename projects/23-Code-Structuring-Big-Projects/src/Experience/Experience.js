import * as THREE from 'three'

import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";
import Camera from './Camera';
import Renderer from './Renderer';

//------------------------------ Singleton pattern
//We can use a singleton pattern that way wi can acces to the the experience from other classes
//A singleton is a class that will instantiate just like usual when it's the first time
//But, for all the following time, it will return that first instance
let instance = null;

export default class Experience{
    constructor(canvas){
        //Singleton pattern
        //first we have to convert our experience class to a singleton. To do it when the experience is beeing construct have to save the instance with this
        //Before do that we are to test if the instance exist and retun it, then if we create a new experience again this will test if the instance already exist, if it doesen't exist, all the code is going to be executed, if it exist, it will return it self.
        if(instance){
            return instance;
        }

        instance = this;


        //------------------------- Global Acces -------------------------
        //Sometimes it's useful to be able to acces the experience righ from the console.
        //To do it we can save the instance in 'window' right inside the cosntructor
        window.experience = this
        //This is trick that not everybody will like and if you have multiple experiences, the las one will override the previous one

        //Options
        this.canvas = canvas;

        //Setup
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.camera = new Camera();
        this.renderer = new Renderer();

        //Sizes resize event 
        this.sizes.on('resize', ()=>{
            this.resize();
        })

        //Time tick event
        this.time.on('tick', ()=>{
            this.update();
        })
    }

    //This functions will propagate the resize event to the children 
    resize(){
        this.camera.resize();
    }

    update(){
        this.camera.update();
    }
}