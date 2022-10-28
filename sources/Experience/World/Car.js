import { Box3, Vector3, Mesh, BoxGeometry, MeshBasicMaterial, Group } from "three";
import gsap from "gsap";

import Experience from "../Experience";

export default class Car {
  #initialPosY = 46.4;

  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.mouse = this.experience.mouse;
    this.scene = this.experience.scene;
    this.resource = this.resources.items.car;
    this.debug = this.experience.debug;
    this.time = this.experience.time;
    this.camera = this.experience.camera;
    this.box = new Box3(new Vector3(), new Vector3());

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("car");
    }

    this.setModel();

    gsap.fromTo(
      this.model.position,
      {
        z: this.#initialPosY + 8,
      },
      {
        z: this.#initialPosY,
        duration: 4,
        ease: "expo.easeOut",
        delay: 1,
      }
    );
  }

  setModel() {
    this.group = new Group();
    this.carBox = new Mesh(new BoxGeometry(), new MeshBasicMaterial({ visible: false }));
    //debug
    // this.carBox = new Mesh(new BoxGeometry(), new MeshBasicMaterial({ color: "yellow" }));
    this.carBox.scale.set(7, 7, 22);
    this.carBox.position.set(0, 0, 0);

    this.model = this.resource.scene;
    this.model.scale.set(0.2, 0.2, 0.2);
    this.model.position.set(0, 0.25, this.#initialPosY);
    this.topleftWheel = null;
    this.bottomleftWheel = null;
    this.toprightWheel = null;
    this.bottomleftWheel = null;

    this.model.traverse((child) => {
      if (child.name == "Left_Wheels_6") {
        this.bottomleftWheel = child;
      }
      if (child.name == "Wheel_4") {
        this.bottomrightWheel = child;
      }
      if (child.name == "Right_Wheels_7") {
        this.topleftWheel = child;
      }

      if (child.name == "Rear_Wheels_5") {
        this.toprightWheel = child;
      }
    });

    this.model.add(this.carBox);
    this.scene.add(this.model);

    // Debug
    if (this.debug.active) {
      this.debugFolder.add(this.model.position, "x").name("x").min(-100).max(100).step(0.001);
      this.debugFolder.add(this.model.position, "y").name("y").min(-100).max(100).step(0.001);
      this.debugFolder.add(this.model.position, "z").name("z").min(-100).max(100).step(0.001);
    }
  }

  activateKonami() {
    console.log("todo");
  }

  update() {
    this.box.setFromObject(this.carBox);

    this.bottomleftWheel.rotation.x -= 0.4;
    this.bottomrightWheel.rotation.x -= 0.4;
    this.topleftWheel.rotation.x -= 0.4;
    this.toprightWheel.rotation.x -= 0.4;
    this.model.position.y = Math.sin(this.time.elapsed * 0.002) * 0.02;

    if (this.mouse.instance.mouseDown) {
      gsap.fromTo(
        this.model.position,
        {
          x: this.model.position.x,
        },
        {
          x: this.mouse.instance.x,
          duration: 0.2,
          ease: "circ.easeOut",
        }
      );
    }
  }
}
