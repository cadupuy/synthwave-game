import { Vector2 } from "three";

import Experience from "@experience/Experience.js";

export default class Mouse {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;

    this.setInstance();

    window.addEventListener("mousedown", () => {
      ++this.instance.mouseDown;
    });

    window.addEventListener("mouseup", () => {
      --this.instance.mouseDown;
    });

    window.addEventListener("mousemove", (event) => {
      this.instance.x = ((event.clientX / this.sizes.width) * 2 - 1) * 2;
      this.instance.y = (-(event.clientY / this.sizes.height) * 2 + 1) * 2;
    });
  }

  setInstance() {
    this.instance = new Vector2();
    this.instance.mouseDown = 0;
  }
}
