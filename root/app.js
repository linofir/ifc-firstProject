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
import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls";
import { IFCLoader } from "../node_modules/web-ifc-three/IFCLoader";
import { Raycaster, Vector2, MeshLambertMaterial } from "three";
import { acceleratedRaycast, computeBoundsTree, disposeBoundsTree } from "three-mesh-bvh";

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

//render function Animation loop
const animate = () => {
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

//Sets up the IFC loading function
const ifcLoader = new IFCLoader();
const ifcApi = ifcLoader.ifcManager;
const ifcModels = [];
const modelId = [];
ifcLoader.ifcManager.setWasmPath("./");

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

document.addEventListener("click", (e) => {
  mouseClick(e);
  
});
document.addEventListener("mousemove", (e) => {
  highlight(e, preselectMat);
});

document.addEventListener("dblclick", e => {
  ifcApi.removeSubset(modelId[0], selectMat);
  console.log("db");
});

const htmlElement = document.getElementById("pick-element");
const canvasPositionData = threeCanvas.getBoundingClientRect();

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
  //pickedId = pickID(intersec);
  
  const objecdId = (pickID(intersec)) ? pickID(intersec).objecdId :"Nenhum objeto selecionado";
  console.log(objecdId);
  highlight(e, selectMat);
  if(e.altKey){
    console.log("alt+click");
    const referenceObject = pickID(intersec);
    const objectProps = ifcApi.getItemProperties(referenceObject.modelId, referenceObject.objecdId);
    console.log(objectProps, objectProps.IFCSLAB);
    // ifcApi.getAllItemsOfType(referenceObject.objecdId, objectProps.Prope);
  }
  
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
        objecdId: 0
    };
    const objectID = ifcLoader.ifcManager.getExpressId(object.geometry, object.faceIndex);
    object.objecdId = objectID;
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
      ids: [objectToHighlight.objecdId],
      material: material,
      removePrevious: true
    });
  }else {
    ifcApi.removeSubset(modelId[0], material);
    console.log("any objects to highlight");
  };

};







 