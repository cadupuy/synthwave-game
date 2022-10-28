import { Scene, Mesh, Fog } from "three";

import Debug from "./Utils/Debug.js";
import Sizes from "./Utils/Sizes.js";
import Stats from "./Utils/Stats.js";
import Time from "./Utils/Time.js";
import Camera from "./Camera.js";
import Renderer from "./Renderer.js";
import World from "./World/World.js";
import Resources from "./Utils/Resources.js";
import Mouse from "./Utils/Mouse.js";
import Loader from "./Loader.js";

import sources from "./sources.js";

let instance = null;

export default class Experience {
  constructor(_canvas) {
    // Singleton
    if (instance) {
      return instance;
    }
    instance = this;

    // Global access
    window.experience = this;

    // Options
    this.canvas = _canvas;

    // Setup
    this.setDebug();
    this.setStats();
    this.setSizes();
    this.setTime();
    this.setMouse();
    this.setScene();
    this.setResources();
    this.setCamera();
    this.setRenderer();
    this.setLoader();
    this.setWorld();

    // Resize event
    this.sizes.on("resize", () => {
      this.resize();
    });

    // Time tick event
    this.time.on("tick", () => {
      this.update();
    });
  }

  setLoader() {
    this.loader = new Loader();
  }

  setDebug() {
    this.debug = new Debug();
  }

  setStats() {
    this.stats = new Stats();
  }

  setSizes() {
    this.sizes = new Sizes();
  }

  setTime() {
    this.time = new Time();
  }

  setMouse() {
    this.mouse = new Mouse();
  }

  setScene() {
    this.scene = new Scene();
    this.scene.fog = new Fog(0x030229, 50, 101);
  }

  setResources() {
    this.resources = new Resources(sources);
  }

  setCamera() {
    this.camera = new Camera();
  }

  setRenderer() {
    this.renderer = new Renderer();
  }

  setWorld() {
    this.world = new World();
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    if (this.stats.active) this.stats.update();

    this.camera.update();
    this.world.update();
    this.renderer.update();
  }

  destroy() {
    this.sizes.off("resize");
    this.time.off("tick");

    // Traverse the whole scene
    this.scene.traverse((child) => {
      // Test if it's a mesh
      if (child instanceof Mesh) {
        child.geometry.dispose();

        // Loop through the material properties
        for (const key in child.material) {
          const value = child.material[key];

          // Test if there is a dispose function
          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        }
      }
    });

    this.camera.controls.dispose();
    this.renderer.instance.dispose();

    if (this.debug.active) this.debug.ui.destroy();
  }
}
