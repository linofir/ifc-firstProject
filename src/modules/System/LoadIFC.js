import {IFCLoader} from 'web-ifc-three';
import {acceleratedRaycast, computeBoundsTree, disposeBoundsTree} from 'three-mesh-bvh';

export class LoadIFC {
    constructor(scene) {

        this.ifcLoader = new IFCLoader();
        this.ifcAPI = ifcLoader.ifcManager;

        this.ifcModels;
        this.scene = scene.scene

        setupFileOpener();
        setupThreeMeshBVH();

    };

    setupThreeMeshBVH() {
        this.ifcAPI.setupThreeMeshBVH(
            computeBoundsTree,
            disposeBoundsTree,
            acceleratedRaycast
            );
    };

    setupFileOpener() {
        const input = document.querySelector('input[type="file"]');
        if (!input) return;
        input.addEventListener(
            'change',
            async (changed) => {
                loadModel(changed);
                if(modelCondition){
                    console.log('main', this.ifcModels[0], this.ifcModels[0].modelID)
                    
                };
        },
        false
    );
};

loadModel(changed) {

    const ifcURL = URL.createObjectURL(changed.target.files[0]);
    this.ifcLoader.load(ifcURL, 
        (ifcModel) => {
            this.ifcModels.push(ifcModel);
            console.log(this.ifcAPI.state.models);
            this.scene.add(ifcModel)
        },
        ifcAPI.setOnProgress((event) =>{
            let percent = (event.loaded/event.total) *100;
            let progress = Math.trunc(percent);
            modelCondition = progress >= 100 ? true : false;
            
            console.log(`Loading progress: ${progress.toString( )}%`)
        })
            
    );
};
}