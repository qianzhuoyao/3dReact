import { useCallback } from "react";
import { getWindowSingle } from "../window/windowSingle";

export const useInsertDom = () => {
  const initDom = useCallback((dom: HTMLElement) => {
    getWindowSingle().threeRender.setPixelRatio(window.devicePixelRatio);
    getWindowSingle().threeDom = dom as HTMLElement;
    dom?.appendChild(getWindowSingle().threeRender.domElement);
    getWindowSingle().threeCssRenderer.domElement.style.position = "absolute";
    getWindowSingle().threeCssRenderer.domElement.style.top = "0";
    getWindowSingle().threeCssRenderer.domElement.style.pointerEvents='none'
    dom?.appendChild(getWindowSingle().threeCssRenderer.domElement);
  }, []);

  return {
    initDom,
  };
};
