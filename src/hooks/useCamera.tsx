import { getWindowSingle } from "../window/windowSingle";
import { useWindowSize } from "react-use";
import { useCallback, useEffect } from "react";

export const useCamera = () => {
  const { width, height } = useWindowSize();

  useEffect(() => {
    getWindowSingle().threeCamera.aspect = width / height;
    getWindowSingle().threeCamera.updateProjectionMatrix();
  }, [height, width]);
  //5,2,8
  const setPosition = useCallback((x: number, y: number, z: number) => {
    getWindowSingle().threeCamera.position.set(x, y, z);
  }, []);

  const lookAt = useCallback((x: number, y: number, z: number) => {
    getWindowSingle().threeCamera.lookAt(x, y, z);
  }, []);

  return {
    lookAt,
    setPosition,
  };
};
