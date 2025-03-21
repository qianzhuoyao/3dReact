import {
  BufferGeometry,
  Material,
  Mesh,
  MeshStandardMaterial,
  NormalBufferAttributes,
  Object3DEventMap,
} from "three";
import { getWindowSingle } from "../../window/windowSingle";
import {
  PAUSE_INTERSECTION,
  selectedTag,
  unSelectedTag,
} from "../../common/constant";
import { createSingle } from "../../common/createSingle";
import { findModelByCondition } from "../../common/findModelByCondition";
import { changeObject } from "../../common/changeModelByObject";
import { CSS3DObject } from "three/examples/jsm/Addons.js";

const originalMaterials = createSingle(() => {
  return {
    cssTagObjects: new Set<CSS3DObject>(),
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

  try {
    getWindowSingle().threeRaycaster.setFromCamera(
      getWindowSingle().threeMouse,
      getWindowSingle().threeCamera
    );

    getWindowSingle().threeIntersection =
      getWindowSingle().threeRaycaster.intersectObjects(
        getWindowSingle().threeScene.children
      );

    originalMaterials()?.cssTagObjects.forEach((tag) => {
      if (tag.element.firstElementChild instanceof HTMLDivElement) {
        tag.element.firstElementChild.style.backgroundImage = `url(${unSelectedTag})`;
        originalMaterials()?.cssTagObjects.delete(tag);
      }
    });

    originalMaterials()?.origins.forEach((o) => {
      const met = Array.isArray(o.material) ? o.material?.[0] : o.material;
      const om = originalMaterials()?.materials.get(o);
      if (om) {
        met.copy(om); // 恢复材质
        originalMaterials()?.materials.delete(o);
        originalMaterials()?.origins.delete(o);

        if (o.userData.originalMaterial) {
          o.material = o.userData.originalMaterial; // 恢复原始材质
          delete o.userData.originalMaterial; // 删除存储的原始材质
        }
      }
    });

    if (getWindowSingle().threeIntersection.length > 0) {
      const object = getWindowSingle().threeIntersection[0].object;

      if (object.visible === false) {
        return;
      }

      const parentGroup = findModelByCondition((userData) => {
        if (typeof userData?.name === "string") {
          return userData?.name.indexOf("JG") > -1;
        }
        return false;
      }, object);

      if (parentGroup) {
        const cssTagObject = parentGroup.parent?.children.find(
          (o) => o instanceof CSS3DObject
        );

        if (
          cssTagObject &&
          cssTagObject.element.firstElementChild instanceof HTMLDivElement
        ) {
          cssTagObject.element.firstElementChild.style.backgroundImage = `url(${selectedTag})`;
          originalMaterials()?.cssTagObjects.add(cssTagObject);
        }

        changeObject(parentGroup, (target) => {
          //同时需要更新tag

          const material = target.material;
          if (material instanceof MeshStandardMaterial) {
            if (!originalMaterials()?.materials.has(target)) {
              originalMaterials()?.origins.add(target);
              originalMaterials()?.materials.set(target, material.clone()); // 克隆原材质
            }
            const cloneMaterial = material.clone();

            if (Array.isArray(target.material)) {
              target.userData.originalMaterial = target.material[0]; // 存储原始材质
              target.material[0] = cloneMaterial;
            } else {
              target.userData.originalMaterial = target.material; // 存储原始材质
              target.material = cloneMaterial;
            }

            cloneMaterial.emissive.set(0x008000);
          }
        });
      }
    }
  } catch (e) {
    console.error(e);
    console.trace(e);
  }
};
