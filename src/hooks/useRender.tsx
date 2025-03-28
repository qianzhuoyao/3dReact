import { useCallback, useEffect } from "react";
import { getWindowSingle } from "../window/windowSingle";

export const useRender = (
  { width, height }: Record<string, number>,
  renderPlugins?: (() => void)[]
) => {
  const render = useCallback(() => {
   
    renderPlugins?.forEach((plugin) => plugin());
    // getWindowSingle().threeOrbitControls.update();
    getWindowSingle().threeRender.render(
      getWindowSingle().threeScene,
      getWindowSingle().threeCamera
    );

    getWindowSingle().threeCssRenderer.render(
      getWindowSingle().threeScene,
      getWindowSingle().threeCamera
    );
  }, [renderPlugins]);

  useEffect(() => {
    try {
      getWindowSingle().threeCssRenderer.setSize(width, height);
      getWindowSingle().threeRender.setSize(width, height);
    } catch (e) {
      console.log(e);
    }
  }, [height, width]);

  return {
    render,
  };
};
