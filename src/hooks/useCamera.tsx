import { getWindowSingle } from "../window/windowSingle";
import { useCallback, useEffect } from "react";

export const useCamera = ({ width, height }: Record<string, number>) => {
  useEffect(() => {
    getWindowSingle().threeCamera.aspect = width / height;
    getWindowSingle().threeCamera.updateProjectionMatrix();
  }, [height, width]);
  //5,2,8
  const setPosition = useCallback((x: number, y: number, z: number) => {
    getWindowSingle().threeCamera.position.set(x, y, z);
  }, []);

  const setNear = useCallback((near: number) => {
    getWindowSingle().threeCamera.near = near;
  }, []);

  const setFar = useCallback((far: number) => {
    getWindowSingle().threeCamera.far = far;
  }, []);

  const lookAt = useCallback((x: number, y: number, z: number) => {
    getWindowSingle().threeCamera.lookAt(x, y, z);
  }, []);

  return {
    setFar,
    lookAt,
    setNear,
    setPosition,
  };
};
