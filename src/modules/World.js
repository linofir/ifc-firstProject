import { ThreeScene } from './Components/Scene';
import { Picking    } from './Components/Picking'
import { LoadIFC } from './System/LoadIFC';
import { ModelInfo } from './System/ModelInfo';
import { User } from './Components/User/User'
import { Clock } from 'three';


export class World {
    constructor(){

        this.clock = new Clock();
        this.scene = new ThreeScene();
        
        const loadIFC = new LoadIFC(this.scene);
        let ifcModels = loadIFC.ifcModels;
        let ifcAPI = loadIFC.ifcAPI;

        let picking = new Picking(this.scene, ifcModels, ifcAPI);
        let modelInfo = new ModelInfo(ifcModels,ifcAPI);
        this.user = new User(this.scene, ifcModels, ifcAPI);



        this.scene.renderer.setAnimationLoop(this.render.bind(this));


    };

    render(){
        let dt = this.clock.getDelta();

        this.scene.render()
        this.user.update(dt)
    }

}









