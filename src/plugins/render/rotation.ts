import { getWindowSingle } from "../../window/windowSingle";

export const rotation = () => {
  getWindowSingle().threeScene.rotation.y += 0.001;
};
