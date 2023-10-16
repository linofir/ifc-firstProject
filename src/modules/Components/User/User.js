import { GLTFLoader } from '../../../../node_modules/three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from '../../../../node_modules/three/examples/jsm/loaders/DRACOLoader';
import { Group, Raycaster} from 'three';
import { Controller } from './Controller';


export class User {
    constructor(scene, ifcModels) {
        this.root = new Group();
        this.scene = scene.scene;
        this.ifcModels = ifcModels
        this.raycaster = new Raycaster();

        this.setupFileOpener(); 

        this.controller = new Controller(this);
        
    };
    
    setupFileOpener() {
        const input = document.getElementById("gltf-file");
        if (!input) return;
        input.addEventListener(
            'change',
            (event) => {
                this.load(event);
                
            },
            false
            );
        }
        
        async load(event){
            try{
                const gltfURL = URL.createObjectURL(event.target.files[0]);
                const loader = new GLTFLoader();
                const dracoLoader = new DRACOLoader();
                dracoLoader.setDecoderPath('./draco/');
                loader.setDRACOLoader(dracoLoader);
                
                loader.load(
                    gltfURL,
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
                        console.log(this.ifcModels);
                    }
            )

        }catch(error){
            console.log( "errro no load gltf:", error);
        }
    };

    rayIntersec(pos) {
        this.raycaster.set(pos, this.root.quaternion );
        this.intersecs = this.raycaster.intersectObject(this.ifcModels);
        console.log(this.intersecs);
    }

    update(dt) {
        this.controller.update(dt);
    }
};

