import { MeshStandardMaterial } from "three";
import { getWindowSingle } from "../../window/windowSingle";
import { PAUSE_INTERSECTION } from "../../common/constant";
/**
 * 这个要针对模型来
 *
 */
export const checkIntersection = () => {
  if (getWindowSingle().state.intersectionAble === PAUSE_INTERSECTION) {
    return;
  }
  getWindowSingle().threeRaycaster.setFromCamera(
    getWindowSingle().threeMouse,
    getWindowSingle().threeCamera
  );

  getWindowSingle().threeIntersection =
    getWindowSingle().threeRaycaster.intersectObjects(
      getWindowSingle().threeScene.children
    );

  if (getWindowSingle().threeIntersection.length > 0) {
    const material = getWindowSingle().threeIntersection[0].object.material;
    if (material instanceof MeshStandardMaterial) {
      material.color.set(0xff0000);
    }
  }
};
