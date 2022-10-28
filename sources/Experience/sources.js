export default [
  {
    name: "environmentMapTexture",
    type: "cubeTexture",
    path: [
      "textures/environmentMap/px.png",
      "textures/environmentMap/nx.png",
      "textures/environmentMap/py.png",
      "textures/environmentMap/ny.png",
      "textures/environmentMap/pz.png",
      "textures/environmentMap/nz.png",
    ],
  },

  {
    name: "matcap",
    type: "texture",
    path: "textures/matcap-metal.jpg",
  },
  {
    name: "particleTexture",
    type: "texture",
    path: "textures/particles/3.png",
  },

  {
    name: "car",
    type: "gltfModel",
    path: "models/car/scene.gltf",
  },
];
