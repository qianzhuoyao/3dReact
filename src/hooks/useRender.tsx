import { useCallback, useEffect } from "react";
import { getWindowSingle } from "../window/windowSingle";
import { useWindowSize } from "react-use";

export const useRender = (renderPlugins?: (() => void)[]) => {
  const { width, height } = useWindowSize();

  const render = useCallback(() => {
    renderPlugins?.forEach((plugin) => plugin());
    getWindowSingle().threeRender.render(
      getWindowSingle().threeScene,
      getWindowSingle().threeCamera
    );
    getWindowSingle().threeOrbitControls.update();
  }, [renderPlugins]);

  useEffect(() => {
    try {
      getWindowSingle().threeRender.setSize(width, height);
    } catch (e) {
      console.log(e);
    }
  }, [height, width]);

  return {
    render,
  };
};
