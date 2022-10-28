import gsap from "gsap";

import Audio from "@experience/Audio.js";
import Experience from "@experience/Experience.js";

import Environment from "./Environment.js";
import Terrain from "./Terrain.js";
import Car from "./Car.js";
import Sun from "./Sun.js";
import Sky from "./Sky.js";
import Particles from "./Particles.js";
import EnnemyManager from "./EnnemyManager.js";
export default class World {
  #KONAMI_CODE = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.mouse = this.experience.mouse;
    this.resources = this.experience.resources;
    this.button = document.querySelector(".start");
    this.loader = this.experience.loader;
    this.loaderDiv = document.querySelector(".loader");

    this.cursor = 0;
    this.buffer = 15;

    this.button.addEventListener("click", () => {
      this.audio = new Audio();

      this.car = new Car();
      this.ennemyManager = new EnnemyManager(this.car);
      this.audio.start({
        onBeat: () => {
          this.buffer--;
          if (this.buffer === 0) {
            this.ennemyManager.createEnnemy();
            this.buffer = 2;
          }
        },
        live: false,
        src: "/audio/synthwave.mp3",
      });
      this.resource = this.resources.items.environmentMapTexture;

      // Setup
      this.setTerrain(this.audio);
      this.setParticles();
      this.setSun(this.audio);
      this.setSky();
      this.setEnvironment();

      gsap.to(this.loaderDiv, {
        opacity: 0,
        duration: 0.5,
        delay: 0.5,
      });
      this.loaderDiv.classList.add("disabled");
      gsap.to(this.loader.overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 });
    });

    window.addEventListener("keydown", (e) => {
      this.cursor = e.keyCode == this.#KONAMI_CODE[this.cursor] ? this.cursor + 1 : 0;
      if (this.cursor == this.#KONAMI_CODE.length) {
        this.setEasterEgg();
        this.cursor = 0;
      }
    });
  }

  setTerrain(audio) {
    this.terrain = new Terrain(audio);
  }

  setParticles() {
    this.particles = new Particles();
  }

  setEnvironment() {
    this.environment = new Environment();
  }

  setSun(audio) {
    this.sun = new Sun(audio);
  }

  setSky() {
    this.sky = new Sky();
  }

  setEasterEgg() {
    if (this.car) this.car.activateKonami();
  }

  update() {
    if (this.audio) this.audio.update();
    if (this.terrain) this.terrain.update();
    if (this.sun) this.sun.update();
    if (this.car) this.car.update();
    if (this.ennemyManager) this.ennemyManager.update();
  }
}
