import {
    AmbientLight,
    AxesHelper,
    DirectionalLight,
    GridHelper,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
  } from "three";
  import { OrbitControls } from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
  import { IFCLoader } from "../node_modules/web-ifc-three/IFCLoader.js";
  
  const app = new App();
  class App {
    constructor(){
      this.init();
    }
    init(){
      //Creates the Three.js scene
      this.scene = new Scene();
      
      //Object to store the size of the viewport
      const size = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      
      //Creates the camera (point of view of the user)
      this.this.camera = new PerspectiveCamera(75, size.width / size.height);
      this.camera.position.z = 15;
      this.camera.position.y = 13;
      this.camera.position.x = 8;
      
      //Creates the lights othis.scene
      const lightColor = 0xffffff;
      
      const ambientLight = new AmbientLight(lightColor, 0.5);
      this.scene.add(ambientLight);
      
      const directionalLight = new DirectionalLight(lightColor, 1);
      directionalLight.position.set(0, 10, 0);
      directionalLight.target.position.set(-5, 0, 0);
      this.scene.add(directionalLight);
      this.scene.add(directionalLight.target);
      
      
      //Sets up the renderer, fetching the canvas of the HTML
      const threeCanvas = document.getElementById("three-canvas");
      const renderer = new WebGLRenderer({ canvas: threeCanvas, alpha: true, antialias: true});
      renderer.setSize(size.width, size.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      
      //Creates grids and axes ithis.scene
      const grid = new GridHelper(50, 30);
      this.scene.add(grid);
      
      const axes = new AxesHelper();
      axes.material.depthTest = false;
      axes.renderOrder = this.scene.add(axes);
      
      //Creates the orbit controls (to navigatthis.scene)
      const controls = new OrbitControls(this.camera, threeCanvas);
      controls.enableDamping = true;
      controls.target.set(-2, 0, 0);
      
      //Animation loop
      // const animate = () => {
      //   controls.update();
      //   renderer.render(this.scene, this.camera);
      //   requestAnimationFrame(animate);
      // };
      
      // animate();

      this.renderer.setAnimationLoop(this.render.bind(this));
      
      //Adjust the viewport to the size of the browser
      window.addEventListener("resize", () => {
        (size.width = window.innerWidth), (size.height = window.innerHeight);
        this.camera.aspect = size.width / size.height;
        this.camera.updateProjectionMatrix();
        renderer.setSize(size.width, size.height);
      });
      
      //Sets up the IFC loading
      const ifcLoader = new IFCLoader();
      ifcLoader.ifcManager.setWasmPath("./web-ifc-mt.wasm");
      
        const input = document.getElementById("file-input");
        input.addEventListener(
          "change",
          (changed) => {
            const ifcURL = URL.createObjectURL(changed.target.files[0]);
            ifcLoader.load(ifcURL, ifcModel);
            this.scene.add(ifcModel);
          },
          false
        );

    }

    render(){
      controls.update();
      this.renderer.render( this.scene, this.camera );
    }
  }

    export {
      App
    }