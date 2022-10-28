import { PlaneGeometry, ShaderMaterial, Mesh, Group, MeshBasicMaterial } from "three";
import gsap from "gsap";
import Experience from "../Experience";

import vert from "../shaders/terrain/vert.glsl";
import frag from "../shaders/terrain/frag.glsl";

export default class Terrain {
  constructor(audio) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.resources = this.experience.resources;
    this.resource = this.resources.items.grid;
    this.audio = audio;
    this.volume = 0;

    this.lerp = gsap.utils.interpolate(this.volume, this.audio.volume);

    this.setGeometry();
    this.setMaterial();
    this.setGroup();
  }

  setGeometry() {
    this.planeGeom = new PlaneGeometry(100, 100, 27, 62);
    this.planeGeom.rotateX(-Math.PI * 0.5);
  }
  setMaterial() {
    this.planeMat = new ShaderMaterial({
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

  setGroup() {
    this.plane = new Mesh(this.planeGeom, this.planeMat);
    this.plane2 = new Mesh(this.planeGeom, this.planeMat);

    this.plane3 = new Mesh(new PlaneGeometry(100, 2, 27, 62), new MeshBasicMaterial());

    this.plane.position.y = 0.0;
    this.plane.position.z = 0;

    this.plane2.position.y = 0;
    this.plane2.position.z = -100;

    this.plane3.position.z = -100;
    this.plane3.position.y = -0.85;

    this.group = new Group();
    this.group.add(this.plane, this.plane2, this.plane3);
    this.scene.add(this.group);
  }

  update = () => {
    this.planeMat.uniforms.uVolume.value += (this.audio.volume - this.planeMat.uniforms.uVolume.value) * 0.6;

    this.volume = this.audio.volume;

    this.plane.position.z = (this.time.elapsed * 0.035) % 100;
    this.plane2.position.z = ((this.time.elapsed * 0.035) % 100) - 100;
  };
}
