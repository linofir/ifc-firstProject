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

        document.addEventListener("click", (e) => {
          this.mouseClick(e)
        });
        document.addEventListener("mousemove", (e) => this.highlight(e, this.preSelectMat));
        document.addEventListener("dblclick", e => {
          ifcAPI.removeSubset(ifcModels[0].modelID, this.selectMat);
          ifcAPI.removeSubset(ifcModels[0].modelID, this.preSelectMat);
          // ifcAPI.removeSubset(ifcModels[0].modelID, selecAlltMat);
          console.log("db");
        });

        console.log("picking module", ifcModels[0]);


    };

    mouseClick(e) {
        const id = (this.pickID(e)) ? this.pickID(e).id :"Nenhum objeto selecionado";
        console.log(id);
        this.highlight(e, this.selectMat);
      
        if(e.altKey){
          console.log("alt+click");
          this.printProps(e);
        }
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
};



