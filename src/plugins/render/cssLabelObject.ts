import { getWindowSingle } from "../../window/windowSingle";

export const cssLabelObject = () => {
  getWindowSingle().objects.CSS3DObjects.forEach((o) => {
    o.lookAt(getWindowSingle().threeCamera.position);
  });
};
