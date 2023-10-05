import { Raycaster, Vector2, MeshLambertMaterial } from "three";

export class Picking {
    constructor(Scene, ifcModels, ifcAPI) {
        this.ifcAPI = ifcAPI;

        this.Scene = Scene;
        this.scene = this.Scene.scene;
        this.ifcModels = ifcModels;
        this.camera = this.Scene.camera;
        this.threeCanvas = this.Scene.threeCanvas;
        this.canvasPositionData = threeCanvas.getBoundingClientRect();

        
        this.raycaster = new Raycaster();
        this.raycaster.firstHitOnly = true;

        this.preSelectMat = new MeshLambertMaterial({
          transparent: true,
          opacity: 0.6,
          color: 0xff88ff,
          depthTest: false,
        });

        this.selectMat = new MeshLambertMaterial({
            transparent: true,
            opacity: 0.6,
            color: 0x2cba5d,
            depthTest: false,
        });

        this.selecAlltMat = new MeshLambertMaterial({
          transparent: true,
          opacity: 0.6,
          color: 0x04c6f6,
          depthTest: false,
        });

        this.visibilityMat = new MeshLambertMaterial({
          transparent: true,
          opacity: 0,
        });

        
        
        document.addEventListener("click", (e) => {
          this.mouseClick(e)
        });
        document.addEventListener("mousemove", (e) => this.highlight(e, this.preSelectMat));
        document.addEventListener("dblclick", e => {
          this.ifcAPI.removeSubset(this.ifcModels[0].modelID, this.selectMat);
          this.ifcAPI.removeSubset(this.ifcModels[0].modelID, this.preSelectMat);
          this.ifcAPI.removeSubset(this.ifcModels[0].modelID, this.selecAlltMat);
          console.log("db");
        });
        document.addEventListener("keydown", (e) =>{
          if(e.key == "s" || e.key == "S"){
            console.log("s pressed")
            this.printSpatialStructure();

          };

        }) 

        document.addEventListener("contextmenu", (e) => this.rightClick(e))

        //this.typeGroups = [{nome, type, subset}];

        console.log("picking module", ifcModels[0]);


    };

    mouseClick(e) {
        const id = (this.pickID(e)) ? this.pickID(e).id :"Nenhum objeto selecionado";
        console.log(id);
        this.highlight(e, this.selectMat);
      
        if(e.altKey){
          console.log("alt+click");
          this.printProps(e);
        };

        if(e.shiftKey){
          console.log("shift+click");
          this.highlightAll(this.selecAlltMat,e);
        };

        // if(e.ctrlKey){
        //   console.log("ctrl+click");
        //   this.visibility(e);
        // }
    }

    getMouseData(e){
        const relativePositionCanvas = {
          x: this.canvasPositionData.right - this.canvasPositionData.left,
          y: this.canvasPositionData.bottom - this.canvasPositionData.top
        };
      
        const relativeMousePos = {
          x: e.clientX - this.canvasPositionData.left,
          y: e.clientY -this.canvasPositionData.top
        }
        let mousePosition = {
          x: (relativeMousePos.x/relativePositionCanvas.x)*2 -1 ,  
          y: -(relativeMousePos.y/relativePositionCanvas.y)*2 +1 
        };
      
        let vecMousePos = new Vector2(mousePosition.x,mousePosition.y);
      
        return vecMousePos
      };

    rayIntersec(e) {
        let mouseData = this.getMouseData(e);
        this.raycaster.setFromCamera(mouseData, this.camera);
        const intersec = this.raycaster.intersectObjects(this.ifcModels);
      
        return intersec;
    };

    pickID(e) {
        const objectPicked = this.rayIntersec(e)[0];
        if(objectPicked){
            const object= {
              modelID: objectPicked.object.modelID,
              geometry: objectPicked.object.geometry,
              faceIndex: objectPicked.faceIndex,
              id: 0
            };
          const objectID = this.ifcAPI.getExpressId(object.geometry, object.faceIndex);
          object.id = objectID;
          return object;
        }else if(!this.ifcModels.length == 0){
          this.ifcAPI.removeSubset(this.ifcModels[0].modelID, this.preSelectMat);
        }
        
    };
    
    highlight(e, material) {
        let objectToHighlight = this.pickID(e);
        if(!this.ifcModels.length == 0) {
          if(objectToHighlight){
              //this.ifcAPI.state.models = [objectToHighlight.modelID]
              console.log("highlight func");
              this.ifcAPI.createSubset({
              scene: this.scene,
              modelID: objectToHighlight.modelID,
              ids: [objectToHighlight.id],
              removePrevious: true,
              material: material
            });
        
          }else {
            //this.ifcAPI.removeSubset(this.ifcModels[0].modelID, material);
            console.log("any objects to highlight");
          }
        }else console.log('any ifcModel loaded');
    };

    async getProps(e){
      const targetObject = this.pickID(e);
      if(targetObject){
        try{
          let objectProps = await this.ifcAPI.getItemProperties(targetObject.modelID, targetObject.id);
          
          return objectProps;
    
        }catch(error){
          console.log(error);
        }
      }
    };

    async printProps(e){
      
        try{
          let objectProps = await this.getProps(e);
          console.log(objectProps);
          objectProps = JSON.stringify(objectProps, null, 2);
          console.log(objectProps);
          
        }catch(error){
          console.log(error)
        }

    };

    async highlightAll(material, e ){
      let  objectToHighlight = this.pickID(e);
      if(!this.ifcModels.length == 0) {
        if (objectToHighlight){
          try{
            let objectIFC = await this.getProps(e);
      
            const objectsTypesArray = await this.ifcAPI.getAllItemsOfType(objectIFC.getExpressId, objectIFC.type );
            console.log('highlightAll func');
            
            let subsetCreated = this.ifcAPI.createSubset({
              scene: this.scene,
              modelID: this.ifcModels[0].modelID,
              ids: objectsTypesArray,
              removePrevious: true,
              material: material,
            });

            return subsetCreated;

          }catch(error){
            console.log(error);
          }
        }else {
          //this.ifcAPI.removeSubset(this.ifcModels[0].modelID, this.selecAlltMat);
          console.log("highlight all disable");
  
        };

      }else console.log('any ifcModel loaded, hightlightall'); 
    };

    rightClick(e) {
      e.preventDefault();
      console.log("rightClick");
      this.visibility(e);
      
    };


    async visibility(e){
      console.log("visibility function")
      try{
        let subset = await this.createSubset(e);
        //this.ifcAPI.ifcModels[0].ifcManager.subsets[3512223829].visible = false;
        //this.ifcModels[0].ifcManager, this.ifcModels[0].ifcManager.subsets.subsets['0 - DEFAULT - DEFAULT'].mesh.material.forEach(material => material.visible = false)

        
        // let objectProps = await this.getProps(e);
        // console.log(objectProps);
        //this.ifcAPI.removeSubset(this.ifcModels[0].modelID, 3512223829 );
        this.ifcAPI.removeSubset(this.ifcModels[0].modelID, this.selectMat);
        this.ifcAPI.removeSubset(this.ifcModels[0].modelID, this.preSelectMat);
        console.log(this.ifcModels[0].ifcManager, this.ifcModels[0].ifcManager.subsets.subsets['0 - DEFAULT - DEFAULT'].mesh)
        
        
      }catch(error){
        console.log(error)
      };

  };

  async createSubset(e){
    let  objectToHighlight = this.pickID(e);
    if(!this.ifcModels.length == 0) {
      if (objectToHighlight){
        try{
          let objectIFC = await this.getProps(e);
    
          const objectsTypesArray = await this.ifcAPI.getAllItemsOfType(objectIFC.getExpressId, objectIFC.type );
          console.log('createsubset func'); 
          
          let subsetCreated = this.ifcAPI.createSubset({
            scene: this.scene,
            modelID: this.ifcModels[0].modelID,
            ids: objectsTypesArray,
            removePrevious: true,
          });

          return subsetCreated;

        }catch(error){
          console.log(error);
        }
      }else {
        //this.ifcAPI.removeSubset(this.ifcModels[0].modelID, this.selecAlltMat);
        console.log("highlight all disable");

      };

    }else console.log('any ifcModel loaded, hightlightall'); 
  }


  async printSpatialStructure(){
    try{
      let structure = await this.ifcAPI.getSpatialStructure(this.ifcModels[0].modelID);
      let structureJSON = JSON.stringify(structure, null, 2);
      console.log(structureJSON);
    
    }catch(error){
      console.log("Data not found");
    };
    
  };
};






