import { PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import Experience from "./Experience.js";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.debug = this.experience.debug;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("camera");
    }

    this.setInstance();
    // this.setControls();
  }

  setInstance() {
    this.instance = new PerspectiveCamera(45, this.sizes.width / this.sizes.height, 1, 500);
    // this.instance.position.set(0, 1.6, 152.1);
    this.instance.position.set(0, 1.6, 52.1);
    this.scene.add(this.instance);

    if (this.debug.active) {
      this.debugFolder.add(this.instance.position, "x").min(-500).max(500).step(0.01);
      this.debugFolder.add(this.instance.position, "y").min(-500).max(500).step(0.01);
      this.debugFolder.add(this.instance.position, "z").min(-500).max(500).step(0.01);

      this.debugFolder
        .add(this.instance, "near")
        .min(0)
        .max(10)
        .step(0.1)
        .onChange(() => this.instance.updateProjectionMatrix())
        .name("Camera Near");
      this.debugFolder
        .add(this.instance, "far")
        .min(0)
        .max(1000)
        .step(0.1)
        .onChange(() => this.instance.updateProjectionMatrix())
        .name("Camera Far");
      this.debugFolder
        .add(this.instance, "fov")
        .min(0)
        .max(180)
        .step(0.1)
        .onChange(() => this.instance.updateProjectionMatrix())
        .name("Camera FOV");
    }
  }

  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    // this.controls.update();
  }
}
