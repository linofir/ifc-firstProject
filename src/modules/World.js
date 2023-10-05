import { ThreeScene } from './Scene';
import { Picking    } from './Picking'
import { LoadIFC } from './System/LoadIFC';



export class World {
    constructor(){
        
        const scene = new ThreeScene();
        
        const loadIFC = new LoadIFC(scene);
        let ifcModels = loadIFC.ifcModels;
        let ifcAPI = loadIFC.ifcAPI;

        let picking = new Picking(scene, ifcModels, ifcAPI);


    };

}









