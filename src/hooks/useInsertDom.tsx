import { useCallback } from "react";
import { getWindowSingle } from "../window/windowSingle";

export const useInsertDom = () => {
  const initDom = useCallback((dom: HTMLElement) => {
    console.log('sdasdas')
    getWindowSingle().threeRender.setPixelRatio(window.devicePixelRatio);
    getWindowSingle().threeDom = dom as HTMLElement;
    dom?.appendChild(getWindowSingle().threeRender.domElement);
  }, []);

  return {
    initDom,
  };
};
