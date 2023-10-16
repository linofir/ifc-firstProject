import { ThreeScene } from './Components/Scene';
import { Picking    } from './Components/Picking'
import { LoadIFC } from './System/LoadIFC';
import { ModelInfo } from './System/ModelInfo';



export class World {
    constructor(){
        
        const scene = new ThreeScene();
        
        const loadIFC = new LoadIFC(scene);
        let ifcModels = loadIFC.ifcModels;
        let ifcAPI = loadIFC.ifcAPI;

        let picking = new Picking(scene, ifcModels, ifcAPI);
        if (ifcModels != null){
            let modelInfo = new ModelInfo(ifcModels,ifcAPI);

        }


    };

}









