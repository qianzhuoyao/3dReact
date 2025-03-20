import { createSingle } from "../common/createSingle";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { Intersection } from "three/src/Three.WebGPU.Nodes.js";
import { RESUME_INTERSECTION } from "../common/constant";
import { CSS3DObject, CSS3DRenderer } from "three/examples/jsm/Addons.js";

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
  const threeCssRenderer = new CSS3DRenderer();
  const CSS3DObjects = new Set<CSS3DObject>();

  return {
    threeCssRenderer,
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
    objects: {
      CSS3DObjects,
    },
    worker: {
      computedWorker: new Worker(
        new URL("../worker/worker.js", import.meta.url).href,
        {
          type: "module",
        }
      ),
    },
    state: {
      //当前被加载的模型场景
      currentLoadImportModels: new Set<string>(),
      //加载过
      windowLoaded: false,
      //已经记载的模型的标记，缓存避免重复加载
      loadedModelSet: new Set<string>(),
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
