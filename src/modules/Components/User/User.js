import { GLTFLoader } from '../../../../node_modules/three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from '../../../../node_modules/three/examples/jsm/loaders/DRACOLoader';
import { Group, Mesh, MeshBasicMaterial, Raycaster, SphereGeometry, Vector3} from 'three';
import { Controller } from './Controller';


export class User {
    constructor(scene, ifcModels, ifcAPI) {
        this.root = new Group();
        this.scene = scene.scene;
        this.ifcModels = ifcModels;
        this.ifcAPI = ifcAPI;
        this.raycaster = new Raycaster();


        this.hit = false;

        this.setupFileOpener(); 

        this.controller = new Controller(this);
        this.tempVec = new Vector3(1,1,1);
        
        

        
    };

    testSphere()
    {
        const geometry = new SphereGeometry(3);
        const material = new MeshBasicMaterial();
        this.sphere = new Mesh(geometry, material);  
        this.sphere.position.set(10,0,10);
        this.scene.add(this.sphere);
    }
    
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
                        
                        this.scene.add(this.root);
                        this.initialSetup();
                    }
            )

        }catch(error){
            console.log( "errro no load gltf:", error);
        }
    };

    initialSetup()
    {
        this.root.position.set(7,0,7);
        this.root.lookAt(this.ifcModels[0].position);
        
        this.hitCheck();
        
    }
    
    hitCheck(){
        let relativePosZ = Math.abs(this.ifcModels[0].position.z - this.root.position.z);
        let relativePosX = Math.abs(this.ifcModels[0].position.x - this.root.position.x);
        if(relativePosX <=4 || relativePosZ <= 4){
            this.hit = true;
        }else{
            this.hit = false;
        }
    }
    
    rayIntersec(pastPosition) {
        let pos = this.root.position.clone();
        let direction = pos.clone().sub(pastPosition).normalize();

        this.raycaster.set(pos, direction);
        this.intersecs = this.raycaster.intersectObjects(this.ifcModels);
        //console.log(this.intersecs);
        return this.intersecs;
    }

    pickID(pastPosition)
    {
        let firstObject = this.rayIntersec(pastPosition)[0];
        if(firstObject){
            const object= {
                modelID: firstObject.object.modelID,
                geometry: firstObject.object.geometry,
                faceIndex: firstObject.faceIndex,
                id: 0
              };
            const objectID = this.ifcAPI.getExpressId(object.geometry, object.faceIndex);
            object.id = objectID;
            //console.log(object);
            return object;
        }else{
            console.log("nenhum objeto no campo de visão");
        }
    }

    async getProps(pastPosition){
        const targetObject = this.pickID(pastPosition);
        if(targetObject){
          try{
            let objectProps = await this.ifcAPI.getItemProperties(targetObject.modelID, targetObject.id);
            console.log(objectProps);
            return objectProps;
      
          }catch(error){
            console.log(error);
          }
        }
      };
    
    update(dt) {
        this.controller.update(dt);
    }
};

