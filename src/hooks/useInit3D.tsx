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

export const useInit3D = () => {
  const ref = useRef({
    loadCount: 0,
    loaded: false,
  });

  const [mRef, { width, height }] = useMeasure();
  useWindow();
  useControls();
  useScene();
  useDefaultEvent();
  const { initDom } = useInsertDom();
  const animate = useAnimate();
  const { render: renderUpdate } = useRender({ width, height },[checkIntersection, ...animate]);
  useClock();
  useStats();
  const { setPosition: setCameraPosition, lookAt: setCameraLookAt } =
    useCamera({ width, height });

  const dracoLoader = useMemo(() => new DRACOLoader(), []);

  const loader = useMemo(() => new GLTFLoader(), []);

  useEffect(() => {
    dracoLoader.setDecoderPath("draco/gltf/");
    loader.setDRACOLoader(dracoLoader);
  }, [dracoLoader, loader]);

  //目前只允许导入一个模型
  const load = useCallback(
    (
      modelPath: string[],
      callback?: (gltf: GLTF) => void,
      onProgress?: (event: ProgressEvent) => void,
      err?: (e: unknown) => void
    ) => {
      modelPath.forEach((path) => {
        loader.load(
          path,
          function (gltf) {
            const model = gltf.scene;
            model.position.set(1, 1, 0);
            model.scale.set(0.01, 0.01, 0.01);
            getWindowSingle().threeScene.add(model);
            getWindowSingle().threeModels.set(model.uuid, model);
            getWindowSingle().threeRender.setAnimationLoop(renderUpdate);
            callback?.(gltf);
            console.log(model, "model");
            ref.current.loadCount++;
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

  return {
    setRef,
    width,
    height,
    load,
    setCameraLookAt,
    setCameraPosition,
  };
};
