import { getWindowSingle } from "../../window/windowSingle";

export const rotation = () => {
  if (getWindowSingle().state.rotatable === false) {
    return;
  }

  //允许旋转，现在聚焦下不允许旋转
  if (getWindowSingle().threeIntersection.length > 0) {
    return;
  }

  if (
    getWindowSingle().state.currentLoadImportModels.has("cabinetAndDeviceModel")
  ) {
    return;
  }

  getWindowSingle().threeScene.rotation.y += 0.001;
};
