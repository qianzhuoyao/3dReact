import { useWindow } from "./useWindow";
import { useRender } from "./useRender";
import { useScene } from "./useScene";
import { useCamera } from "./useCamera";
import { useControls } from "./useControls";
import { RefCallback, useCallback, useEffect, useMemo, useRef } from "react";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTF, GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { getWindowSingle } from "../window/windowSingle";
import { useInsertDom } from "./useInsertDom";
import { useAnimate } from "./useAnimate";
import { useClock } from "./useClock";
import { useStats } from "./useStats";
import { useMeasure } from "react-use";
import { useDefaultEvent } from "./useDefaultEvent";
import { checkIntersection } from "../plugins/render/checkIntersection";
import * as THREE from "three";
import { cssLabelObject } from "../plugins/render/cssLabelObject";
import { useClickModel } from "./useClickModel";
import { worldCab } from "../plugins/render/world";
import { useLight } from "./useLight";
import { battery } from "../plugins/render/battery";

export const useInit3D = () => {
  const ref = useRef({
    loadCount: 0,
    loaded: false,
  });

  const [mRef, { width, height }] = useMeasure();
  useWindow();
  const { clicked } = useClickModel(width, height);
  useControls();
  useScene();
  useLight();
  useDefaultEvent();
  const { initDom } = useInsertDom();
  const animate = useAnimate();
  const { render: renderUpdate } = useRender({ width, height }, [
    checkIntersection,
    worldCab,
    cssLabelObject,
    battery,
    ...animate,
  ]);
  useClock();
  useStats();
  const {
    setPosition: setCameraPosition,
    lookAt: setCameraLookAt,
    setNear,
    setFar,
  } = useCamera({ width, height });

  const dracoLoader = useMemo(() => new DRACOLoader(), []);

  const loader = useMemo(() => new GLTFLoader(), []);

  useEffect(() => {
    dracoLoader.setDecoderPath("draco/gltf/");
    loader.setDRACOLoader(dracoLoader);
  }, [dracoLoader, loader]);

  const setCenter = useCallback(
    (object: THREE.Group<THREE.Object3DEventMap>) => {
      const box = new THREE.Box3().setFromObject(object); // 获取模型的包围盒
      const center = new THREE.Vector3();
      box.getCenter(center); // 计算中心点
      object.position.sub(center); // 将模型移动到 (0,0,0)
    },
    []
  );

  //目前只允许导入一个模型
  const load = useCallback(
    (
      modelPath: { model: string; tag: string }[],
      callback?: (gltf: GLTF) => void,
      onProgress?: (event: ProgressEvent) => void,
      err?: (e: unknown) => void
    ) => {
      modelPath.forEach((path) => {
        if (getWindowSingle().state.loadedModelSet.has(path.model)) {
          return;
        }
        loader.load(
          path.model,
          function (gltf) {
            const model = gltf.scene;
            getWindowSingle().threeScene.add(model);
            getWindowSingle().threeModels.set(model.uuid, model);
            getWindowSingle().threeRender.setAnimationLoop(renderUpdate);
            gltf.scene.userData.tag = path.tag;
            gltf.scene.userData.path = path.model;
            getWindowSingle().state.loadedModelSet.add(path.model);
            console.log(model, "model");

            callback?.(gltf);
            if (ref.current.loadCount > 1) {
              console.warn(
                "模型加载次数过多,加载" + ref.current.loadCount + "次"
              );
            }
          },
          onProgress,
          function (e) {
            err?.(e);
            console.error(e);
          }
        );
      });
      ref.current.loadCount++;
    },
    [loader, renderUpdate]
  );

  const setRef: RefCallback<HTMLDivElement> = useCallback(
    (dom) => {
      if (dom) {
        mRef(dom);
        if (!ref.current.loaded) {
          initDom(dom);
          ref.current.loaded = true;
        }
      }
    },
    [initDom, mRef]
  );

  const setCurrentModel = useCallback((tag: string[]) => {
    getWindowSingle().state.currentLoadImportModels.clear();
    tag.forEach((str) => {
      getWindowSingle().state.currentLoadImportModels.add(str);
    });
    getWindowSingle().threeScene.children.forEach((child) => {
      console.log(child.userData, "child.userData");
      if (
        getWindowSingle().state.currentLoadImportModels.has(child.userData.tag)
      ) {
        child.visible = true;

        if (Array.isArray(child.userData.originScale)) {
          //保持缩放状态
          child.scale.set(
            child.userData.originScale[0],
            child.userData.originScale[1],
            child.userData.originScale[2]
          );
        }
      } else {
        // child.userData.originScale = [...child.scale.toArray()];
        child.visible = false;
        child.scale.set(0, 0, 0);
      }
    });
  }, []);

  return {
    setFar,
    setRef,
    width,
    clicked,
    height,
    load,
    setNear,
    setCurrentModel,
    setCenter,
    setCameraLookAt,
    setCameraPosition,
  };
};
