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
  const { load, setCameraPosition, setCameraLookAt, setRef } = useInit3D();
  //初始的一些设置
  useEffect(() => {
    //加载，只加载一次
    if (ref.current.isLoaded === false) {
      setCameraPosition(5, 2, 8);
      //设置下视线，避免一开始就选中
      setCameraLookAt(0, 0, 0);
      load(models);
      ref.current.isLoaded = true;
    }
  }, [load, models, setCameraLookAt, setCameraPosition]);

  return {
    setRef,
  };
};
