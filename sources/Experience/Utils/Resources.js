import { TextureLoader, CubeTextureLoader } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";

import EventEmitter from "./EventEmitter.js";
export default class Resources extends EventEmitter {
  constructor(sources) {
    super();

    this.sources = sources;
    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;
    this.progressBar = document.querySelector(".progressBar");
    this.progressFill = document.querySelector(".progressFill");
    this.button = document.querySelector(".start");

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.textureLoader = new TextureLoader();
    this.loaders.cubeTextureLoader = new CubeTextureLoader();
  }

  startLoading() {
    // Load each source
    for (const source of this.sources) {
      if (source.type === "gltfModel") {
        this.loaders.gltfLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "texture") {
        this.loaders.textureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "cubeTexture") {
        this.loaders.cubeTextureLoader.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      }
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file;

    this.loaded++;

    this.progressRatio = (this.loaded / this.toLoad) * 100;

    this.progressFill.style.width = `${this.progressRatio}%`;

    if (this.loaded === this.toLoad) {
      this.trigger("ready");

      gsap.to(this.progressBar, {
        opacity: 0,
        duration: 1,
        delay: 1,
      });

      gsap.to(this.button, {
        opacity: 1,
        duration: 1,
        delay: 1.5,
      });
    }
  }
}
