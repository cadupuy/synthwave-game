import { Vector3, MathUtils } from "three";

import Experience from "../Experience.js";
import { Sky as ThreeSky } from "three/examples/jsm/objects/Sky";

export default class Sky {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.renderer = this.experience.renderer.instance;
    this.debug = this.experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("sky");
    }

    this.setSky();
    this.setUniforms();
  }

  setSky() {
    this.effectController = {
      turbidity: 0.2,
      rayleigh: 0.056,
      mieCoefficient: 0.015,
      mieDirectionalG: 0.945,
      elevation: 4.6,
      azimuth: -180,
      exposure: this.renderer.toneMappingExposure,
    };

    this.sky = new ThreeSky();
    this.sky.scale.setScalar(450000);
    this.scene.add(this.sky);

    this.sun = new Vector3();

    if (this.debug.active) {
      this.debugFolder.add(this.effectController, "turbidity").min(0.00001).max(20).step(0.1);

      this.debugFolder.add(this.effectController, "rayleigh").min(0.00001).max(4).step(0.001);

      this.debugFolder.add(this.effectController, "mieCoefficient").min(0.00001).max(0.1).step(0.001);

      this.debugFolder.add(this.effectController, "mieDirectionalG").min(0.00001).max(1).step(0.001);

      this.debugFolder.add(this.effectController, "elevation").min(0.00001).max(90).step(0.1);

      this.debugFolder.add(this.effectController, "azimuth").min(-180).max(180).step(0.1);

      this.debugFolder.add(this.effectController, "exposure").min(0).max(1).step(0.0001);

      this.debugFolder.onChange(() => this.setUniforms());
    }
  }

  setUniforms() {
    const uniforms = this.sky.material.uniforms;
    uniforms["turbidity"].value = this.effectController.turbidity;
    uniforms["rayleigh"].value = this.effectController.rayleigh;
    uniforms["mieCoefficient"].value = this.effectController.mieCoefficient;
    uniforms["mieDirectionalG"].value = this.effectController.mieDirectionalG;

    const phi = MathUtils.degToRad(90 - this.effectController.elevation);
    const theta = MathUtils.degToRad(this.effectController.azimuth);

    this.sun.setFromSphericalCoords(1, phi, theta);

    this.renderer.toneMappingExposure = this.effectController.exposure;
    uniforms["sunPosition"].value.copy(this.sun);
  }
}
