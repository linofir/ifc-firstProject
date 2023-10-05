import { GLTFLoader } from '../../../node_modules/three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from '../../../node_modules/three/examples/jsm/loaders/DRACOLoader';
import { Group, SphereGeometry, MeshBasicMaterial, Mesh } from 'three';
import { Controller } from './Controller';


export class User {
    constructor(scene) {
        this.root = new Group();
        this.scene = scene;
        // this.geometry = new SphereGeometry(5,18,8);
        // this.material =  new MeshBasicMaterial( { color: 0xffff00 } );
        // this.sphere = new Mesh( this.geometry, this.material ); 
        //this.scene.add(this.sphere);

        this.load(); 


        this.controller = new Controller(this);



    };

    load(){
        const loader = new GLTFLoader().setPath('../../assets/');
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('../../node_modules/three/examples/jsm/libs/draco/');
        loader.setDRACOLoader(dracoLoader);

        loader.load(
            'eve2.glb',
            (gltf) => {
                this.root.add(gltf.scene);
                this.object = gltf.scene;
                this.object.frustumCulled = false;

                const scale = 1.2;
                this.object.scale.set(scale, scale, scale);

                this.object.traverse( child => {
                    if ( child.isMesh){
                        child.castShadow = true;
						child.frustumCulled = false;
                    }
                });

                this.scene.add(this.root)
                
            }
        )



    };

    update(dt) {
        this.controller.update(dt);
    }
};

