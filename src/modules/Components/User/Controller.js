import { Vector3, Quaternion, Object3D } from "three";

export class Controller {
    constructor(user) {
        this.move = {up:0, right:0};
        this.user = user
        this.user.root = user.root;
        //this.sphere = user.sphere;

        this.forward = new Vector3(0, 0, 0.1);
        this.down = new Vector3(0, -1, 0);
        this.speed = 50;

        document.addEventListener('keydown',(e) => this.keyDown(e));
        document.addEventListener('keyup',(e) => this.keyUp(e));

        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false
        }

        this.keyHandler();
    };

    keyDown(e) {
        console.log('down');

        switch(e.key){
            case 'ArrowUp':
                console.log('up pressed');
                this.keys.up = true;
                break;
            case 'ArrowDown':
                console.log('down pressed');
                this.keys.down = true;
                break;
            case 'ArrowLeft':
                console.log('left pressed');
                this.keys.left = true;
                break;
            case 'ArrowRight':
                console.log('right pressed');
                this.keys.right = true;
                break;    
        }
    };

    keyUp(e) {
        console.log('up');

        switch(e.key){
            case 'ArrowUp':
                console.log('up unpressed');
                this.keys.up = false;
                if (!this.keys.down) this.move.up = 0;
                break;
            case 'ArrowDown':
                console.log('down unpressed');
                this.keys.down = false;
                if (!this.keys.up) this.move.up = 0;
                break;
            case 'ArrowLeft':
                console.log('left unpressed');
                this.keys.left = false;
                if (!this.keys.right) this.move.right = 0;
                break;
            case 'ArrowRight':
                console.log('right unpressed');
                this.keys.right = false;
                if (!this.keys.left) this.move.right = 0;
                break;    
        }
    };

    keyHandler() {
        if(this.keys.up) this.move.up += 0.1;
        if(this.keys.down) this.move.up -= 0.1;
        if(this.keys.right) this.move.right -= 0.1;
        if(this.keys.left) this.move.right += 0.1;

        if(this.move.up > 1) this.move.up = 1;
        if(this.move.up < -1) this.move.up = -1;
        if(this.move.right < -1) this.move.right = -1;
        if(this.move.right > 1) this.move.right = 1;

        //console.log('keyhandler')
    };

    update(dt =0.0167 ) {
        this.keyHandler();
        let speed;

        if(this.move.up !=0) {
            const forward = this.forward.clone().applyQuaternion(this.user.root.quaternion);
            speed = this.move.up>0 ? this.speed * dt : this.speed * dt * 0.3;
            speed *= this.move.up;
            const pos = this.user.root.position.clone().add(forward.multiplyScalar(speed));
            
            //pos.z += this.move.up*0.1;
            this.user.root.position.copy(pos);

            //this.user.rayIntersecs(this.user.root.position);

        }else speed =0;

        if (Math.abs(this.move.right)>0.1){
            console.log('rotate')
            const theta = dt * (this.move.right) * 1;
            this.user.root.rotateY(theta);
        };

    };
};