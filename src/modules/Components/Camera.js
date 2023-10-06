import { PerspectiveCamera, Vector3 } from "three";

export class Camera {
    constructor(){
        this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.defaultPosition = new Vector3(30,30,30);
        this.targetPosition = new Vector3(0,0,0);

    };

    setupCamera(position = this.defaultPosition, target = this.targetPosition) {
        this.camera.position.set(position);
        this.controls.target.set(target);
    }
};