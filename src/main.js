import {IFCLoader} from 'web-ifc-three';
import {acceleratedRaycast, computeBoundsTree, disposeBoundsTree} from 'three-mesh-bvh';
import { ThreeScene } from './modules/Scene';
//import { User } from './modules/User';
import { Picking    } from './modules/Picking'

const ifcModels = [];
const ifcLoader = new IFCLoader();
const ifcAPI = ifcLoader.ifcManager;

const Scene = new ThreeScene();
const scene = Scene.scene;

setupFileOpener();
setupThreeMeshBVH();

let modelCondition = false;

const picking = new Picking(Scene, ifcModels, ifcAPI);
//const user = new User(scene);



function setupThreeMeshBVH() {
    ifcAPI.setupThreeMeshBVH(
        computeBoundsTree,
        disposeBoundsTree,
        acceleratedRaycast
        );
    };
    
    
    function setupFileOpener() {
        const input = document.querySelector('input[type="file"]');
        if (!input) return;
        input.addEventListener(
            'change',
            async (changed) => {
                loadIFC(changed);
                if(modelCondition){
                    console.log('main', ifcModels[0], ifcModels[0].modelID)
                    
                };
        },
        false
    );
};

function loadIFC(changed) {

    const ifcURL = URL.createObjectURL(changed.target.files[0]);
    ifcLoader.load(ifcURL, 
        (ifcModel) => {
            ifcModels.push(ifcModel);
            console.log(ifcAPI.state.models);
            scene.add(ifcModel)
        },
        ifcAPI.setOnProgress((event) =>{
            let percent = (event.loaded/event.total) *100;
            let progress = Math.trunc(percent);
            modelCondition = progress >= 100 ? true : false;
            
            console.log(`Loading progress: ${progress.toString( )}%`)
        })
            
    );
};
