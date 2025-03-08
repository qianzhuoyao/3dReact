import { createSingle } from "../common/createSingle";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { Intersection } from "three/src/Three.WebGPU.Nodes.js";
import { RESUME_INTERSECTION } from "../common/constant";

export const windowSingle = createSingle(() => {
  const threeCamera = new THREE.PerspectiveCamera();
  const threeRender = new THREE.WebGLRenderer({ antialias: true });
  const threeScene = new THREE.Scene();
  const threeClock = new THREE.Clock();
  const threePmremGenerator = new THREE.PMREMGenerator(threeRender);
  const threeOrbitControls = new OrbitControls(
    threeCamera,
    threeRender.domElement
  );
  const threeIntersection: Intersection<THREE.Mesh>[] = [];
  const threeRaycaster = new THREE.Raycaster();
  const threeMouse = new THREE.Vector2(1, 1);
  const threeStats = new Stats();
  const threeDom = null as HTMLElement | null;
  const threeModels = new Map<string, THREE.Group<THREE.Object3DEventMap>>();

  return {
    threeModels,
    threeRaycaster,
    threeStats,
    threeMouse,
    threeIntersection,
    threePmremGenerator,
    threeRender,
    threeScene,
    threeCamera,
    threeClock,
    threeOrbitControls,
    threeDom,
    state: {
      //优化方案，当鼠标不是选中的模式下，不允许intersection去获取射线聚焦的材质内容
      intersectionAble: RESUME_INTERSECTION,
    },
  };
});

export const getWindowSingle = () => {
  const single = windowSingle();

  if (single) {
    return single;
  }
  throw new Error("windowSingle is null");
};
