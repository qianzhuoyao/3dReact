import {
  BufferGeometry,
  Material,
  Mesh,
  MeshStandardMaterial,
  NormalBufferAttributes,
  Object3DEventMap,
} from "three";
import { getWindowSingle } from "../../window/windowSingle";
import { PAUSE_INTERSECTION } from "../../common/constant";
import { createSingle } from "../../common/createSingle";

const originalMaterials = createSingle(() => {
  return {
    origins: new Set<
      Mesh<
        BufferGeometry<NormalBufferAttributes>,
        Material | Material[],
        Object3DEventMap
      >
    >(),
    materials: new WeakMap(),
  };
});

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
  console.log(originalMaterials()?.origins, "ooo");
  originalMaterials()?.origins.forEach((o) => {
    const met = Array.isArray(o.material) ? o.material?.[0] : o.material;
    const om = originalMaterials()?.materials.get(o);
    if (om) {
      met.copy(om); // 恢复材质
      originalMaterials()?.materials.delete(o);
      originalMaterials()?.origins.delete(o);
    }
  });

 

  if (getWindowSingle().threeIntersection.length > 0) {

  
    const object = getWindowSingle().threeIntersection[0].object;
    const material = object.material;

    if (material instanceof MeshStandardMaterial) {
      if (!originalMaterials()?.materials.has(object)) {
        originalMaterials()?.origins.add(object);
        originalMaterials()?.materials.set(object, material.clone()); // 克隆原材质
      }
      material.emissive.set(0x008000);
    }
  }
};
