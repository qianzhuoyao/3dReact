import { getWindowSingle } from "../../window/windowSingle";

export const cssLabelObject = () => {
 
  if (
    getWindowSingle().state.currentLoadImportModels.has("cabinetAndDeviceModel")
  ) {
    return;
  }
  getWindowSingle().objects.CSS3DObjects.forEach((o) => {
    o.lookAt(getWindowSingle().threeCamera.position);
  });
};
