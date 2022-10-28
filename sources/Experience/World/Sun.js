import { CircleGeometry, ShaderMaterial, Mesh } from "three";
import Experience from "@experience/Experience.js";

import frag from "@shaders/sun/frag.glsl";
import vert from "@shaders/sun/vert.glsl";

export default class Sun {
  constructor(audio) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.debug = this.experience.debug;
    this.audio = audio;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("sun");
    }

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this.geometry = new CircleGeometry(35, 64);
  }

  setMaterial() {
    this.material = new ShaderMaterial({
      // transparent: true,
      vertexShader: vert,
      fragmentShader: frag,

      uniforms: {
        uTime: {
          value: 0,
        },
        uVolume: {
          value: 0,
        },
      },
    });
  }

  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.z = -151;
    this.mesh.position.y = 15;
    this.scene.add(this.mesh);

    if (this.debug.active) {
      this.debugFolder.add(this.mesh.position, "x").min(-500).max(500).step(0.1);
      this.debugFolder.add(this.mesh.position, "y").min(-500).max(500).step(0.1);
      this.debugFolder.add(this.mesh.position, "z").min(-500).max(500).step(0.1);
    }
  }

  update() {
    this.mesh.material.uniforms.uTime.value = this.time.elapsed * 0.009;
    this.mesh.material.uniforms.uVolume.value = this.audio.uVolume;
  }
}
