import { useEffect } from "react";
import { getWindowSingle, windowSingle } from "../window/windowSingle";

export const useWindow = () => {
  useEffect(() => {
    if (getWindowSingle().state.windowLoaded === false) {
      windowSingle();
      getWindowSingle().state.windowLoaded = true;
    }
  }, []);
};
