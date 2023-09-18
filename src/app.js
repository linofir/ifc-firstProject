import './css/stylesheet.css';
import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  GridHelper,
  HemisphereLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { IFCLoader } from "web-ifc-three";
import { Raycaster, Vector2, MeshLambertMaterial } from "three";
import { IFCWALLSTANDARDCASE, IFCSLAB, IFCDOOR, IFCWINDOW, IFCFURNISHINGELEMENT, IFCMEMBER, IFCPLATE } from "web-ifc";
import Stats from '../node_modules/stats.js/src/Stats';
import { acceleratedRaycast, computeBoundsTree, disposeBoundsTree } from "three-mesh-bvh";
//const path = require("../node_modules\path\path.js");

//init function 
  
//Creates the Three.js scene
const scene = new Scene();
  
//Object to store the size of the viewport
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};
  
//Creates the camera (point of view of the user)
  
const camera = new PerspectiveCamera(75, size.width / size.height);
camera.position.z = 15;
camera.position.y = 13;
camera.position.x = 8;

//Creates the lights of the scene
const lightColor = 0xffffff;
  
const ambientLight = new AmbientLight(lightColor, 0.5);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(lightColor, 1);
directionalLight.position.set(0, 10, 0);
directionalLight.target.position.set(-5, 0, 0);
scene.add(directionalLight);
scene.add(directionalLight.target);

//Sets up the renderer, fetching the canvas of the HTML

const threeCanvas = document.getElementById("three-canvas");
const renderer = new WebGLRenderer({ canvas: threeCanvas, alpha: true });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//Creates grids and axes in the scene
const grid = new GridHelper(50, 30);
scene.add(grid);

const axes = new AxesHelper();
axes.material.depthTest = false;
axes.renderOrder = 1;
scene.add(axes);

//Creates the orbit controls (to navigate the scene)
const controls = new OrbitControls(camera, threeCanvas);
controls.enableDamping = true;
controls.target.set(-2, 0, 0);

// Stats
const stats = new Stats();
stats.showPanel(2);
document.body.append(stats.dom);


//render function Animation loop
const animate = () => {
  stats.begin();
  // Update other stuff
  stats.end();
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();

//resize function

//Adjust the viewport to the size of the browser
window.addEventListener("resize", () => {
  (size.width = window.innerWidth), (size.height = window.innerHeight);
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
});

//Sets up the IFC loading function and manipulation
const ifcLoader = new IFCLoader();
const ifcApi = ifcLoader.ifcManager;
const ifcModels = [];
const modelId = [];

ifcApi.setWasmPath('./');



const input = document.getElementById("file-input");
input.addEventListener(
  "change",
  (changed) => {
    const ifcURL = URL.createObjectURL(changed.target.files[0]);
    ifcLoader.load(ifcURL, (ifcModel) => {
      ifcModels.push(ifcModel);
      ifcModels.forEach((model => modelId.push(model.modelID)));
      scene.add(ifcModel); 
    });
  },
  false
  );
  
  
// Sets up optimized picking
ifcLoader.ifcManager.setupThreeMeshBVH(computeBoundsTree, disposeBoundsTree, acceleratedRaycast);
  
  
const raycaster = new Raycaster();
raycaster.firstHitOnly = true;

// Creates subset material
const preselectMat = new MeshLambertMaterial({
  transparent: true,
  opacity: 0.6,
  color: 0xff88ff,
  depthTest: false,
});

const selectMat = new MeshLambertMaterial({
  transparent: true,
  opacity: 0.6,
  color: 0x2cba5d,
  depthTest: false,
});

const selecAlltMat = new MeshLambertMaterial({
  transparent: true,
  opacity: 0.6,
  color: 0x04c6f6,
  depthTest: false,
});

const typesCategories = {};


// user inputs
document.addEventListener("click", (e) => {
  mouseClick(e);
  
});
document.addEventListener("mousemove", (e) => {
  highlight(e, preselectMat);
});

document.addEventListener("dblclick", e => {
  ifcApi.removeSubset(modelId[0], selectMat);
  ifcApi.removeSubset(modelId[0], selecAlltMat);
  console.log("db");
});

document.addEventListener("keydown", (e) => {
  if(e.key == "s" || e.key == "S"){
    console.log("Key - S")
    printSpatialStructure();
    
  }
  
});

// Stores the created subsets
// List of categories names
const genericTypes = {
  IFCWALLSTANDARDCASE,
  IFCSLAB,
  IFCFURNISHINGELEMENT,
  IFCDOOR,
  IFCWINDOW,
  IFCPLATE,
  IFCMEMBER,
};

let subsets = {};


const canvasPositionData = threeCanvas.getBoundingClientRect();
var inputElements = document.querySelectorAll('input[type="checkbox"]');

inputElements.forEach((element) => {
  element.addEventListener("change", (e) => {
    scene.remove(modelId[0])
    scene.remove(scene.children[6],scene.children[7],scene.children[8],scene.children[9],scene.children[10],scene.children[11]);
    console.log(scene);
    let checkStatus = e.target.checked;
    let typeUser = e.target.value;
    setSubsets(typeUser, checkStatus);
   
    })
    
});
  
  
  

async function setSubsets(typeUser, checkStatus) {
  const allTypesName = Object.keys(genericTypes);
  
  for(let i = 0; i < allTypesName.length ; i++) {
    subsets[allTypesName[i]] = await subsetOfType(genericTypes[allTypesName[i]]);
    console.log(subsets[allTypesName[i]], allTypesName, genericTypes[allTypesName[i]]);

  }
  setVisibility(typeUser, checkStatus);
};

async function setVisibility(typeUser, checkStatus) {
  console.log(subsets, scene);
  let found = scene.children.find(child => child === subsets[typeUser]);
  console.log("found",found);

  if(checkStatus){
    console.log("checked", subsets[typeUser], scene );
    scene.add(subsets[typeUser]);
  }else {
    const removeSubset = await subsets[typeUser];
    subsets[typeUser].removeFromParent();
    scene.remove(subsets[typeUser]);

    
    console.log("unchecked", typeUser, removeSubset, scene );
    
};

}

  // Gets the IDs of all the items of a specific typeUser
async function getAll(expressID) {
  const ids = await ifcApi.getAllItemsOfType(modelId[0], expressID, false);
  //console.log("ids:", ids);
  return ids;
};
  
  // Creates a new subset containing all elements of a typeUser

async function subsetOfType(expressID) {
  const ids = await getAll(expressID);
  const subset =  ifcApi.createSubset({
    modelID: modelId[0],
    scene: scene,
    ids: ids,
    removePrevious: true,
    customID: expressID
  });
  //console.log("subset:", subset);
  return subset;
};

//set mouse position between 1 and -1 
function getMouseData(e){
  const relativePositionCanvas = {
    x: canvasPositionData.right - canvasPositionData.left,
    y: canvasPositionData.bottom - canvasPositionData.top
  };

  const relativeMousePos = {
    x: e.clientX - canvasPositionData.left,
    y: e.clientY -canvasPositionData.top
  }
  let mousePosition = {
    x: (relativeMousePos.x/relativePositionCanvas.x)*2 -1 ,  
    y: -(relativeMousePos.y/relativePositionCanvas.y)*2 +1 
  };

  let vecMousePos = new Vector2(mousePosition.x,mousePosition.y);

  return vecMousePos
}
  
function mouseClick(e) {
  let vecMousePos = getMouseData(e);
  const intersec = rayIntersec(vecMousePos, camera, ifcModels);
  const id = (pickID(intersec)) ? pickID(intersec).id :"Nenhum objeto selecionado";
  console.log(id);
  highlight(e, selectMat);

  if(e.altKey){
    console.log("alt+click");
    printProps(intersec);
  }

  if(e.shiftKey){
    console.log("shift +click");
    highlightAll(selecAlltMat, intersec);
    
    // document.addEventListener("keydown", (e) => {
    //   let keypressed = "0";
    //   if(e.key === "u" || e.key == "U"){
    //     console.log("u");
    //     keypressed = "u";
    //     visibility(preselectMat, selectMat, selecAlltMat, keypressed, intersec);

    //   }
    //   if(e.key === "v" || e.key === "V"){
    //     console.log("v");
    //     keypressed = "v";
    //     visibility(preselectMat, selectMat, selecAlltMat, keypressed, intersec);

    //   }
    // });
    

    
  };

  
  
}

// checar ser a posição do mouse tem intersecção com algum objedmodel.
function rayIntersec(vecMousePos, camera, ifcModels = ifcModels) {
  raycaster.setFromCamera(vecMousePos, camera);
  const intersec = raycaster.intersectObjects(ifcModels);
  
  // if(!intersec.length>0){
  //   console.log("Any objects intersecs");
  // }

  return intersec;
}


function pickID(intersec) {
  const objectPicked = intersec[0];
  if(objectPicked){
      const object= {
        modelId: objectPicked.object.modelID,
        geometry: objectPicked.object.geometry,
        faceIndex: objectPicked.faceIndex,
        id: 0
    };
    const objectID = ifcLoader.ifcManager.getExpressId(object.geometry, object.faceIndex);
    object.id = objectID;
    //htmlElement.value = objectID;
    return object;
  }
};

function highlight(e, material) {
  let vecMousePos = getMouseData(e);
  const intersec = rayIntersec(vecMousePos, camera, ifcModels);
  if(intersec.length > 0){
    let objectToHighlight = pickID(intersec);
    ifcApi.createSubset({
      scene: scene,
      modelID: objectToHighlight.modelId,
      ids: [objectToHighlight.id],
      material: material,
      removePrevious: true
    });

  }else {
    ifcApi.removeSubset(modelId[0], material);
    console.log("any objects to highlight");
  };

};

async function getProps(intersec){
  if(intersec.length>0){
    try{
      const referenceObject = pickID(intersec);
      let objectProps = await ifcApi.getItemProperties(referenceObject.modelId, referenceObject.id);
      
      return objectProps;

    }catch(error){
      console.log(error);
    }
  }
}

async function printProps(intersec){
  try{
    let objectProps = await getProps(intersec);
    console.log(objectProps);
    objectProps = await JSON.stringify(objectProps, null, 2);
    console.log(objectProps);
    
  }catch(error){
    console.log(error)
  }
};
   
async function highlightAll(material, intersec ){
  const referenceObject = pickID(intersec);
  if (referenceObject){
    try{
      objectIFC = await getProps(intersec);

      const objectsTypesArray = await ifcApi.getAllItemsOfType(referenceObject.modelId, objectIFC.type );
      

      ifcApi.createSubset({
        scene: scene,
        modelID: referenceObject.modelId,
        ids: objectsTypesArray,
        removePrevious: true,
        material: material,
      });

      return ;


    }catch(error){
      console.log(error);
    }
  }else{
    //ifcApi.removeSubset(referenceObject.modelId, material);

  }
};

//creates a subset of the types
async function newSubsetOfType(intersec){
  if (intersec){
    try{
      const referenceObject = pickID(intersec);
      const objectsTypesArray = await getAllitems(intersec);
      let newSubset = ifcApi.createSubset({
        scene: scene,
        modelID: 0,
        ids: objectsTypesArray,
        removePrevious: true,
      });

      return newSubset

    }catch(error){
      console.log(error);
    }
  }else{
    //ifcApi.removeSubset(referenceObject.modelId, material);

  }
};

// returns the array of the type intersecs
async function getAllitems(intersec) {
  const referenceObject = pickID(intersec);
  try{
    objectIFC = await getProps(intersec);
    const objectsTypesArray = await ifcApi.getAllItemsOfType(referenceObject.modelId, objectIFC.type );
    return objectsTypesArray;
  }catch(error){
    console.log("failed to get items ")
  }

};

// function setCategories(type, subset) {
//   typesCategories[type] = [0,1];
//   typesCategories[type][0] = subset;
//   typesCategories[type][1] = true;
//   //console.log(typesCategories);
// }

// async function visibility(preselectMat, materialHighlight, materialHighlightAll, keyPressed, intersec){
//   try{
//     const objectIFC = await getProps(intersec);
//     let subset = await newSubsetOfType(intersec);
//     setCategories(objectIFC.type, subset);
//     if(keyPressed === "u"){
//       if(!subset.parent){
//         console.log("already removed");
//         throw error;
//       }
//       console.log("click + u");
//       ifcApi.removeSubset(modelId[0], materialHighlight);
//       ifcApi.removeSubset(modelId[0], materialHighlightAll);
//       ifcApi.removeSubset(modelId[0], preselectMat);
//       //subset.removeFromParent();
//       //console.log(subset);
//       console.log(subset)
//       //scene.remove(subset);
//       console.log(scene);
//       subset.removeFromParent();
//       scene.remove(subset);
//       scene.remove(grid);
//     }
//     if(keyPressed === "v") {
//       if(!subset.parent){
//         console.log("subset removed", subset.parent);
//         console.log("click + v")
//         scene.add(grid);
//         scene.add(typesCategories[objectIFC][0]);
//       }
//     }
    

//   }catch(error){
//     console.log(" failed to set visibility")

//   }
// }



async function printSpatialStructure(){
  try{
    let structure = await ifcApi.getSpatialStructure(modelId[0]);
    let structureJSON = JSON.stringify(structure, null, 2);
    console.log(structureJSON);

  }catch(error){
    console.log("Data not found");
  }

};

// Sets up memory disposal
const button = document.getElementById('memory-button');
button.addEventListener(`click`, () => releaseMemory());

async function releaseMemory() {
	  // This releases all IFCLoader memory
		await ifcLoader.ifcManager.dispose();
		ifcLoader = null;
		ifcLoader = new IFCLoader();
		await ifcLoader.ifcManager.setWasmPath('./');

		// If you are storing the ifcmodels in an array or object, you must release them there as well
		// Otherwise, they won't be garbage collected
		models.length = 0;
};

async function setUpMultiThreading() {
  const manager = ifcLoader.ifcManager;
  // These paths depend on how you structure your project
  await manager.useWebWorkers(true, "../node_modules/web-ifc-three/IFCWorker.js");
  await manager.setWasmPath("./");
}

setUpMultiThreading();




