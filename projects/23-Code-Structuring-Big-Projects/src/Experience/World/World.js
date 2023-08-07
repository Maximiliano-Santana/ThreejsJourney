import * as THREE from 'three'

import Experience from "../Experience";
import Environment from './Environment';

export default class World{
    constructor (){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;


        //Test mesh
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(2, 2, 2, 3, 3, 3),
            new THREE.MeshStandardMaterial({wireframe: false, roughness: 0, metalness: 1}),
        )
        this.scene.add(mesh);
        
        this.resources.on('assetsLoaded', ()=>{
            //Setup
            this.environment = new Environment();
        })

    }
}