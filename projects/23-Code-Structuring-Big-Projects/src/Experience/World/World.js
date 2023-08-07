import * as THREE from 'three'

import Experience from "../Experience";
import Environment from './Environment';
import Floor from './Floor';

export default class World{
    constructor (){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;


        //Test mesh
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(2, 2, 2, 3, 3, 3),
            new THREE.MeshStandardMaterial({wireframe: false}),
        )
        this.scene.add(mesh);
        
        this.resources.on('assetsLoaded', ()=>{
            //Setup
            this.floor = new Floor();
            this.environment = new Environment();

        })

    }
}