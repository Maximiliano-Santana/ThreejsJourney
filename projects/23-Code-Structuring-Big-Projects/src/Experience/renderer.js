import * as THREE from 'three'

import Experience from "./Experience";

export default class Renderer{
    constructor(){
        this.experence = new Experience();
        this.canvas = this.experence.canvas;
        this.sizes = this.experence.sizes;
        this.scene = this.experence.scene;
        this.camera = this.experence.camera;
        
        this.setInstance();
    }

    setInstance(){
        this.instance = new THREE.WebGLRenderer({
            canvas:this.canvas,
            antialias: true,
        });
        this.instance.useLegacyLights = false
        this.instance.toneMapping = THREE.CineonToneMapping
        this.instance.toneMappingExposure = 1.75
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        this.instance.setClearColor('#211d20');
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
    }

    resize(){
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
    }

    update(){
        this.instance.render(this.scene, this.camera.instance);
    }
}