import { createSingle } from "../common/createSingle";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { Intersection } from "three/src/Three.WebGPU.Nodes.js";
import { RESUME_INTERSECTION } from "../common/constant";
import {
  CSS3DObject,
  CSS3DRenderer,
  RGBELoader,
} from "three/examples/jsm/Addons.js";
import * as CANNON from "cannon-es";
import { Subject } from "rxjs";

export interface IDevice {
  cabinetId: string;
  high: number;
  id: string;
  ip: string;
  maker: string;
  model: string;
  name: string;
  position: number;
  relationCabinetName: string;
  serialNum: string;
  state: number;
  type: string;
}

export const windowSingle = createSingle(() => {
  const threeCamera = new THREE.PerspectiveCamera();
  const threeRender = new THREE.WebGLRenderer({
    antialias: true,
    precision: "highp",
  });
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
  const threeAmbientLight = new THREE.AmbientLight(0xffffff, 1); // 颜色: 白色, 强度: 1

  const threeRgbeLoader = new RGBELoader();

  const png = new URL("../assets/battery.png", import.meta.url).href;

  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(png);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping; // 让纹理重复
  texture.repeat.set(5, 1); // 控制纹理沿着线缆方向重复

  const batteryMaterial = new THREE.MeshStandardMaterial({
    map: texture, // 贴图
    metalness: 0.7, // 金属感
    roughness: 0.9, // 粗糙度
  });

  batteryMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.time = { value: 0 };
    shader.fragmentShader = `
      uniform float time;
      ${shader.fragmentShader}
    `.replace(
      `gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,
      `vec2 uv = vUv;
       uv.x += time * 0.1; // 让纹理沿 X 轴流动
       gl_FragColor = texture2D(map, uv);`
    );
  };
  const world = new CANNON.World();
  world.gravity.set(0, -9.82, 0); // 设置重力

  const cabinets = new Map<string, unknown>();

  const cabinetDevices = new Map<string, IDevice[]>();

  const singalUpdate = new Subject<{
    messageCode: string;
    payload: unknown;
  }>();

  const cableLines = new Map<
    string,
    {
      id: string;
      start: {
        obj: THREE.Object3D | null;
        position: THREE.Vector3;
      };
      target: {
        obj: THREE.Object3D;
        position: THREE.Vector3;
      };
      line: THREE.Mesh;
    }
  >();

  const pivot = new WeakMap();

  const loadModels = new Map<string, THREE.Object3D>();

  return {
    world,
    threeRgbeLoader,
    threeAmbientLight,
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
    singals: {
      singalUpdate,
    },
    objects: {
      texture,
      batteryMaterial,
      pivot,
      //记录机柜名称与id的映射
      cabinets,
      //记录机柜与所属设备的信息
      cabinetDevices,
      //线缆
      cableLines,
      //css3对象
      CSS3DObjects,
      //载入的所有资源模型
      loadModels,
      //记录告警数据
      alertCabintList: new Set<string>(),
    },
    worker: {
      computedWorker: new Worker(
        new URL("../worker/worker.js", import.meta.url).href,
        {
          type: "module",
        }
      ),
    },
    mapping: {
      indexMap01: {
        JF02_JG01: "JF02_JG01",
        JF02_JG02: "JF02_JG02",
        JF02_JG03: "JF02_JG03",
        JF02_JG04: "JF02_JG04",
        JF02_JG05: "JF02_JG05",
        JF02_JG06: "JF02_JG06",
        JF02_JG07: "JF02_JG07",
        JF02_JG08: "JF02_JG08",
        JF02_JG09: "JF02_JG09",
        JF02_JG10: "JF02_JG10",
        JF02_JG11: "JF02_JG11",
        JF02_JG12: "JF02_JG12",
        JF02_JG013: "JF02_JG24",
        JF02_JG14: "JF02_JG23",
        JF02_JG15: "JF02_JG22",
        JF02_JG16: "JF02_JG21",
        JF02_JG17: "JF02_JG20",
        JF02_JG18: "JF02_JG19",
        JF02_JG19: "JF02_JG18",
        JF02_JG20: "JF02_JG17",
        JF02_JG21: "JF02_JG16",
        JF02_JG22: "JF02_JG15",
        JF02_JG23: "JF02_JG14",
        JF02_JG24: "JF02_JG13",
      },
    },
    state: {
      controlUpdate: true,
      //允许相机旋转
      rotatable: true,
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
