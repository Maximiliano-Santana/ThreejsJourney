import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
//We are going to loop on a list of assets to load

//Each resources in th array will be defined by an object composed of the following properties 
//name: wich  will be used to retrieve the loaded respurce
//type: in the order to knowwhtal loader to use
//path: the path(s) of the file to load

//Becaus is a heavy array, its a good practice to put it in a different file

import EventEmitter from "./EventEmitter";


export default class Resources extends EventEmitter{
    constructor (sources){
        super();

        //Options
        this.soruces = sources;

        //Setup
        this.items = {}; //Is where we will save the itmes loaded
        this.toLoad = this.soruces.length;
        this.loaded = 0;

        //Loaders
        this.setLoaders();
        this.startLoading();

    }

    setLoaders(){
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.textureLoader = new THREE.TextureLoader();
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
    }

    startLoading(){
        //Load each soruce
        for (const source of this.soruces){
            if(source.type === 'gltfModel'){
                this.loaders.gltfLoader.load(
                    source.path,
                    (file)=>{
                        this.sourceLoaded(source, file);
                    }
                )
            }else if(source.type === 'texture'){
                this.loaders.textureLoader.load(
                    source.path,
                    (file)=>{
                        this.sourceLoaded(source, file);
                    }
                )
            }else if (source.type === 'cubeTexture'){
                this.loaders.cubeTextureLoader.load(
                    source.path,
                    (file)=>{
                        this.sourceLoaded(source, file);
                    }
                )
            }
        } 
    }

    sourceLoaded(source, file){
        this.items[source.name] = file
        this.loaded++
        if (this.loaded == this.toLoad){
            this.trigger('assetsLoaded')
        }
    }
}