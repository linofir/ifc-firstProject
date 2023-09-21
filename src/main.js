import { ThreeScene } from './modules/Scene';
import { IfcManager } from './modules/ifc-manager';

const ifcModels = [];
const baseScene = new ThreeScene();
const loader = new IfcManager(baseScene.scene, ifcModels);