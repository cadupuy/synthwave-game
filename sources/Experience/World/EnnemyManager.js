import { BoxGeometry, Mesh, Box3, Vector3, MeshMatcapMaterial } from "three";
import gsap from "gsap";
import Experience from "../Experience.js";

export default class Ennemy {
  constructor(car) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.resources = this.experience.resources;
    this.resource = this.resources.items.matcap;
    this.camera = this.experience.camera;
    this.car = car;
    this.active = true;
    this.ennemyBuffer = [];
    this.box = new Box3(new Vector3(), new Vector3());

    this.score = document.querySelector(".score");
    this.calc;

    this.setGeom();
    this.setMaterial();
  }

  setGeom() {
    this.geom = new BoxGeometry(0.7, 0.7, 0.7);
  }

  setMaterial() {
    this.mat = new MeshMatcapMaterial({ matcap: this.resource });
  }

  createEnnemy() {
    if (this.active) {
      let mesh = new Mesh(this.geom, this.mat);
      mesh.position.set((Math.random() * 2 - 1) * 1.75, 0.5, -51);
      this.scene.add(mesh);

      this.ennemyBuffer.push(mesh);
    }
  }

  gameOver() {
    for (let i = 0; i < this.ennemyBuffer.length; i++) {
      this.scene.remove(this.ennemyBuffer[i]);
    }
    const tl = gsap.timeline();

    tl.to(this.car.model.position, {
      z: 47.5,
      duration: 1,
      ease: "circ.easeOut",
    }).to(
      this.car.model.position,
      {
        z: -200,
        duration: 3.9,
        ease: "expo.easeOut",
      },
      "<0.85"
    );
  }

  detectCollisionWithObstacles(current) {
    this.box.setFromObject(current);
    if (this.car.box.intersectsBox(this.box)) {
      this.active = false;

      this.gameOver();
      return;
    }
  }

  update() {
    if (this.active) {
      if (this.score) this.score.innerHTML = Math.floor(this.time.elapsed / 50);

      for (let i = 0; i < this.ennemyBuffer.length; i++) {
        let current = this.ennemyBuffer[i];
        current.position.z += this.time.delta * 0.035;

        this.detectCollisionWithObstacles(current);

        if (current.position.z > 60) {
          this.scene.remove(current);
          this.ennemyBuffer.shift;
        }
      }
    }
  }
}
