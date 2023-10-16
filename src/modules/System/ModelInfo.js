import {spatialStructure} from "../../../public/spatialStructure.js";

export class ModelInfo {
    constructor(ifcModels, ifcAPI){
        this.structureJS = spatialStructure;
        this.ifcModels = ifcModels;
        this.ifcAPI = ifcAPI;

        console.log("chamando modelInfo")
        //console.log("Teste js",this.structure);
        //this.importJSON();
        document.addEventListener("keydown", (e) =>{
            if(e.key == "s" || e.key == "S"){
                this.structureJSON = this.printSpatialStructure();
                //this.getAllTypes(this.structureJSON);
                console.log("s pressed model");
  
            };
  
          }) 

    }

    async importJSON() {
       try{
        let response = await  fetch("../../../public/spatialStructure2.json");
        if (!response.ok) {
            throw new Error(`Erro na solicitação: ${response.status} - ${response.statusText}`);
        };
        const spatial = await response.json();
        console.log(spatial);
        console.log(this.re);

       }catch(error){
        console.log("Ocorreu um erro: ",error);
       }
    }

    async printSpatialStructure(){
        try{
          let structure = await this.ifcAPI.getSpatialStructure(this.ifcModels[0].modelID);
          let structureJSON = JSON.stringify(structure, null, 2);
          //console.log(structureJSON);
          this.getAllTypes(structure);
          return structure;
        
        }catch(error){
          console.log("Data not found");
        };
        
    };

    async getAllTypes(structure){
        this.types = new Set();
        try{
            await this.nodeProcess(structure)
            console.log(Array.from(this.types));
            //return Array.from(this.types); 

        }catch(error){
            console.log("erro", error)
        }
        
    }
    nodeProcess(node){
        if(node.type){
            this.types.add(node.type)
        }
        if(node.children) {
            node.children.forEach(child => {
                this.nodeProcess(child)
            });
        
        }
    }
    
}