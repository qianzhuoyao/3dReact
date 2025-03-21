import { getWindowSingle } from "../window/windowSingle";
import * as THREE from "three";
import { createLine } from "./createLine";
import { findModelByCondition } from "./findModelByCondition";
import { CSS3DObject } from "three/examples/jsm/Addons.js";
import { selectedTag } from "./constant";
import { changeObject } from "./changeModelByObject";

const setGreen = (object: THREE.Object3D<THREE.Object3DEventMap>) => {
  try {
    const dfs = (obj: THREE.Object3D<THREE.Object3DEventMap>) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      obj?.children?.forEach((child: any) => {
        console.log(child, "cscscscsc33");

        const parentGroup = findModelByCondition((userData) => {
          if (typeof userData?.name === "string") {
            return userData?.name.indexOf("JG") > -1;
          }
          return false;
        }, child);

        console.log(parentGroup, "parentGroupss");
        if (parentGroup) {
          const cssTagObject = parentGroup.parent?.children.find(
            (o) => o instanceof CSS3DObject
          );

          if (
            cssTagObject &&
            cssTagObject.element.firstElementChild instanceof HTMLDivElement
          ) {
            cssTagObject.element.firstElementChild.style.backgroundImage = `url(${selectedTag})`;
          }
          changeObject(parentGroup, (t) => {
            const material = t.material;
            if (material instanceof THREE.MeshStandardMaterial) {
              const cloneMaterial = material.clone();
              t.material = cloneMaterial;
              cloneMaterial.emissive.set(0x008000);
            }
          });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        child?.children?.forEach((element: any) => {
          dfs(element);
        });
      });
    };
    dfs(object);
  } catch (e) {
    console.error(e);
  }
};

export const createLineByNames = (
  fromName: string,
  targetNames: string[],
  offset: [number, number, number] //xyz
) => {
  getWindowSingle().threeScene.children.filter((scene) => {
    //只作用显示的模型
    if (
      getWindowSingle().state.currentLoadImportModels.has(scene.userData.tag)
    ) {
      const startPosition = new THREE.Vector3();

      const targetsPosition: { name: string; position: THREE.Vector3 }[] = [];

      scene.traverse((obj) => {
        if (obj.userData.name === fromName) {
          setGreen(obj);
          startPosition.set(
            obj.position.toArray()[0] + offset[0],
            obj.position.toArray()[1] + offset[1],
            obj.position.toArray()[2] + offset[2]
          );
        }

        if (targetNames.includes(obj.userData.name)) {
          console.log(obj, "objssss");
          setGreen(obj);
          targetsPosition.push({
            name: obj.userData.name,
            position: new THREE.Vector3(
              obj.position.toArray()[0] + offset[0],
              obj.position.toArray()[1] + offset[1],
              obj.position.toArray()[2] + offset[2]
            ),
          });
        }
      });

      if (scene instanceof THREE.Group) {
        targetsPosition.forEach((target) => {
          console.log(startPosition, target.position, "csolwe");
          createLine(
            scene,
            String(Math.random()),
            startPosition,
            target.position,
            fromName,
            target.name
          );
        });
      }
    }
  });
};
