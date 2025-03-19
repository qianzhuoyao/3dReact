import { getWindowSingle } from "../../window/windowSingle";

export const rotation = () => {
  //允许旋转，现在聚焦下不允许旋转
  if (getWindowSingle().threeIntersection.length > 0) {
    return;
  }

  getWindowSingle().threeScene.rotation.y += 0.001;
};
