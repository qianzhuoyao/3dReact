import {
  BufferGeometry,
  Color,
  Material,
  Mesh,
  MeshStandardMaterial,
  NormalBufferAttributes,
  Object3DEventMap,
} from "three";
import { getWindowSingle } from "../../window/windowSingle";
import {
  lineMap,
  PAUSE_INTERSECTION,
  selectedTag,
} from "../../common/constant";
import { createSingle } from "../../common/createSingle";
import { findModelByCondition } from "../../common/findModelByCondition";
import { changeObject } from "../../common/changeModelByObject";
import { CSS3DObject } from "three/examples/jsm/Addons.js";
import { LineRelationMap } from "../../common/LineRelationMap";

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
    // getWindowSingle().threeRaycaster.layers.set(1);

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
        if (tag.userData.tipType === "show") {
          tag.element.firstElementChild.style.backgroundImage =
            tag.userData.originMaterialImage;
        }
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

      if (getWindowSingle().state.currentLoadImportModels.has("modelA")) {
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
            if (cssTagObject.userData.tipType === "show") {
              cssTagObject.element.firstElementChild.style.backgroundImage = `url(${selectedTag})`;
              originalMaterials()?.cssTagObjects.add(cssTagObject);
            }
          }

          changeObject(parentGroup, (target) => {
            //同时需要更新tag

            const material = target.material;
            if (material instanceof MeshStandardMaterial) {
              if (!originalMaterials()?.materials.has(target)) {
                originalMaterials()?.origins.add(target);
                originalMaterials()?.materials.set(target, material.clone());
              }
              const cloneMaterial = material.clone();

              if (Array.isArray(target.material)) {
                target.userData.originalMaterial = target.material[0];
                target.material[0] = cloneMaterial;
              } else {
                target.userData.originalMaterial = target.material;
                target.material = cloneMaterial;
              }
              if (cloneMaterial.userData.materialType === "alert") {
                return;
              }
              cloneMaterial.emissive.set(0x008000);
            }
          });
        }
      } else if (
        getWindowSingle().state.currentLoadImportModels.has(
          "cabinetAndDeviceModel"
        )
      ) {
        // const lineGroup = findModelByCondition((userData) => {
        //   return userData?.meshType === "line";

        // }, object);

        console.log(getWindowSingle().threeCamera,'object')
        if (object.userData?.meshType === "line") {
          if (object.isMesh) {
            const targetLineObjectMaterial = Array.isArray(object.material)
              ? object.material[0]
              : object.material;
            if (!originalMaterials()?.materials.has(object)) {
              originalMaterials()?.origins.add(object);
              originalMaterials()?.materials.set(
                object,
                targetLineObjectMaterial.clone()
              );
            }

            const cloneLineObjectMaterial = targetLineObjectMaterial.clone();

            if (Array.isArray(object.material)) {
              object.userData.originalMaterial = object.material[0];
              object.material[0] = cloneLineObjectMaterial;
            } else {
              // LineRelationMap()?.relation.get(object.userData.floor+object.userData.name).

              const aboutLines = lineMap.filter(
                (mapRelation) =>
                  (mapRelation.start.floor === object.userData.floor &&
                    mapRelation.start.name === object.userData.name) ||
                  (mapRelation.target.floor === object.userData.floor &&
                    mapRelation.target.name === object.userData.name)
              );
              aboutLines.forEach((mapRelation) => {
                const aboutLine = LineRelationMap()?.relation.get(
                  mapRelation.start.floor + mapRelation.start.name
                );

                if (aboutLine instanceof Mesh) {
                  aboutLine.userData.originalMaterial = object.material;

                  aboutLine.material = cloneLineObjectMaterial;
                  (cloneLineObjectMaterial as MeshStandardMaterial).color =
                    new Color(0x008000);
                  (
                    cloneLineObjectMaterial as MeshStandardMaterial
                  ).emissive.set(0x008000);
                }
              });
            }
          }
        }
      }
    }
  } catch (e) {
    console.error(e);
    console.trace(e);
  }
};
