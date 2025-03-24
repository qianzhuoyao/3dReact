import { getWindowSingle } from "../window/windowSingle";
import * as THREE from "three";
import {
  CSS3DObject,
  Line2,
  LineGeometry,
  LineMaterial,
} from "three/examples/jsm/Addons.js";
import { findModelByCondition } from "./findModelByCondition";
import { changeObject } from "./changeModelByObject";
import { selectedTag } from "./constant";

export const setColor = (
  object: THREE.Object3D<THREE.Object3DEventMap>,
  color: number
) => {
  try {
    const dfs = (obj: THREE.Object3D<THREE.Object3DEventMap>) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      obj?.children?.forEach((child: any) => {
        const parentGroup = findModelByCondition((userData) => {
          if (typeof userData?.name === "string") {
            return userData?.name.indexOf("JG") > -1;
          }
          return false;
        }, child);

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
          parentGroup.userData.bindCssTagObject = cssTagObject;
          changeObject(parentGroup, (t) => {
            const material = t.material;

            if (material instanceof THREE.MeshStandardMaterial) {
              const cloneMaterial = material.clone();
              const cloneMaterial2 = material.clone();

              if (!t.userData.originalCableOriginMaterial) {
                t.userData.originalCableOriginMaterial = cloneMaterial;
              }

              t.material = cloneMaterial2;
              cloneMaterial2.emissive.set(color);
              t.userData.clonedCableOriginMaterial = cloneMaterial2;
              console.log(cloneMaterial, cloneMaterial2, "cloneMaterial");
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

export const createLine = (
  scene: THREE.Group,
  id: string,
  start: {
    obj: THREE.Object3D | null;
    position: THREE.Vector3;
  },
  target: {
    obj: THREE.Object3D;
    position: THREE.Vector3;
  }
) => {
  const geometry = new LineGeometry();
  geometry.setPositions([
    start.position.x,
    start.position.y,
    start.position.z,
    start.position.x,
    start.position.y + 0.1,
    start.position.z,
    target.position.x,
    target.position.y + 0.1,
    target.position.z,
    target.position.x,
    target.position.y,
    target.position.z,
  ]);

  const matLine = new LineMaterial({
    linewidth: 5,
    color: 0x00ff00,
    dashed: false,
  });

  const line = new Line2(geometry, matLine);
  line.scale.set(1, 1, 1);
  if (start.obj) {
    setColor(start.obj, 0x008000);
    setColor(target.obj, 0x008000);
  }

  getWindowSingle().objects.cableLines.set(id, {
    id,
    start,
    target,
    line,
  });

  scene.add(line);
};
