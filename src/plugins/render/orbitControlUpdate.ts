import { getWindowSingle } from "../../window/windowSingle";

export const orbitControlUpdate = () => {
  if (getWindowSingle().state.controlUpdate) {
    getWindowSingle().threeOrbitControls.update();
  }
};
