import StatsJs from "stats.js";

export default class Stats {
  constructor() {
    this.active = window.location.hash === "#debug";

    if (this.active) {
      this.instance = new StatsJs();
      this.instance.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
      document.body.appendChild(this.instance.dom);
    }
  }

  update() {
    this.instance.update();
  }
}
