import { BufferGeometry, BufferAttribute, ShaderMaterial, Points, AdditiveBlending } from "three";
import Experience from "../Experience";

import firefliesVertexShader from "../shaders/fireflies/vertex.glsl";
import firefliesFragmentShader from "../shaders/fireflies/fragment.glsl";

export default class Particles {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("fireflies");
    }

    this.init();
  }

  init() {
    /**
     * Fireflies
     */
    // Geometry
    const firefliesGeometry = new BufferGeometry();
    const firefliesCount = 1500;
    const positionArray = new Float32Array(firefliesCount * 3);
    const scaleArray = new Float32Array(firefliesCount);

    for (let i = 0; i < firefliesCount; i++) {
      positionArray[i * 3 + 0] = (Math.random() - 0.5) * 400;
      positionArray[i * 3 + 1] = Math.random() * 200;
      positionArray[i * 3 + 2] = -Math.random() * 400 - 150;

      scaleArray[i] = Math.random();
    }

    firefliesGeometry.setAttribute("position", new BufferAttribute(positionArray, 3));
    firefliesGeometry.setAttribute("aScale", new BufferAttribute(scaleArray, 1));

    // Material
    this.firefliesMaterial = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 6.5 },
      },
      vertexShader: firefliesVertexShader,
      fragmentShader: firefliesFragmentShader,
    });

    if (this.debug.active) {
      this.debugFolder.add(this.firefliesMaterial.uniforms.uSize, "value").min(0).max(50).step(1).name("firefliesSize");
    }

    // Points
    const fireflies = new Points(firefliesGeometry, this.firefliesMaterial);
    fireflies.frustumCulled = false;
    this.scene.add(fireflies);
  }
}
