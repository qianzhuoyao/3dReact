import { useEffect, useRef } from "react";
import { useInit3D } from "./useInit3D";

/**
 * 加载模型
 * @param models
 * @returns
 *
 */
export const useLoad = (models: string[]) => {
  const ref = useRef({
    isLoaded: false,
  });
  const {
    load,
    setCameraPosition,
    setCenter,
    setCameraLookAt,
    setRef,
    setFar,
    setNear,
  } = useInit3D();
  //初始的一些设置
  useEffect(() => {
    //加载，只加载一次
    if (ref.current.isLoaded === false) {
      setCameraPosition(0, 1, 1);
      setFar(1000);
      setNear(0.01);
      //设置下视线，避免一开始就选中
      setCameraLookAt(0, 0, 0);
      load(models, (gltf) => {
        gltf.scene.position.set(0, 0, 0);
        gltf.scene.scale.set(0.1, 0.1, 0.1);
        setCenter(gltf.scene);
      });
      ref.current.isLoaded = true;
    }
  }, [
    load,
    models,
    setCameraLookAt,
    setCameraPosition,
    setCenter,
    setFar,
    setNear,
  ]);

  return {
    setRef,
    setFar,
    setNear,
  };
};
