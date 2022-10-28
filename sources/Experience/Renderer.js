import {
  WebGLRenderer,
  Mesh,
  sRGBEncoding,
  CineonToneMapping,
  NoToneMapping,
  LinearToneMapping,
  ReinhardToneMapping,
  ACESFilmicToneMapping,
} from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

import Experience from "./Experience.js";

export default class Renderer {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.debug = this.experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("renderer");
    }

    this.setInstance();
    this.setPostprocessing();
  }

  setInstance() {
    this.instance = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });

    this.instance.physicallyCorrectLights = true;
    this.instance.outputEncoding = sRGBEncoding;
    this.instance.toneMapping = CineonToneMapping;
    this.instance.toneMappingExposure = 0.25;
    this.instance.setClearColor("#010101", 1);
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));

    console.log(this.instance.info);

    // Debug
    if (this.debug.active) {
      this.debugFolder
        .add(this.instance, "toneMapping", {
          NoToneMapping: NoToneMapping,
          LinearToneMapping: LinearToneMapping,
          ReinhardToneMapping: ReinhardToneMapping,
          CineonToneMapping: CineonToneMapping,
          ACESFilmicToneMapping: ACESFilmicToneMapping,
        })
        .onChange(() => {
          this.scene.traverse((_child) => {
            if (_child instanceof Mesh) _child.material.needsUpdate = true;
          });
        });

      this.debugFolder.add(this.instance, "toneMappingExposure").min(0).max(10);
    }
  }

  setPostprocessing() {
    this.effectComposer = new EffectComposer(this.instance);
    this.effectComposer.setSize(this.sizes.width, this.sizes.height);
    this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.renderPass = new RenderPass(this.scene, this.camera.instance);
    this.effectComposer.addPass(this.renderPass);

    const rgbShiftPass = new ShaderPass(RGBShiftShader);
    rgbShiftPass.uniforms["amount"].value = 0.002;
    this.effectComposer.addPass(rgbShiftPass);

    const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
    // this.effectComposer.addPass(gammaCorrectionPass);

    const params = {
      shape: 1,
      radius: 4,
      rotateR: Math.PI / 12,
      rotateB: (Math.PI / 12) * 2,
      rotateG: (Math.PI / 12) * 3,
      scatter: 0,
      blending: 1,
      blendingMode: 1,
      greyscale: false,
      disable: false,
    };

    const bloomParams = {
      strength: 0.25,
    };

    const bloomPass = new UnrealBloomPass();
    bloomPass.strength = bloomParams.strength;
    this.effectComposer.addPass(bloomPass);

    if (this.debug.active) {
      this.debugFolder
        .add(rgbShiftPass.uniforms["amount"], "value")
        .min(0)
        .max(0.01)
        .step(0.00001)
        .name("RGBShift intensity");

      this.debugFolder
        .add(bloomParams, "strength", 0.0, 3.0)
        .onChange((value) => {
          bloomPass.strength = Number(value);
        })
        .name("Bloom Strength");
    }
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));

    // Update effect composer
    this.effectComposer.setSize(this.sizes.width, this.sizes.height);
    this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  update() {
    // this.instance.render(this.scene, this.camera.instance);
    this.effectComposer.render();
  }
}
