import { getWindowSingle } from "../window/windowSingle";
import * as THREE from "three";
import { createLine } from "./createLine";

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
      const start: {
        obj: THREE.Object3D | null;
        position: THREE.Vector3;
      } = {
        obj: null,
        position: new THREE.Vector3(),
      };

      const targets: {
        obj: THREE.Object3D;
        position: THREE.Vector3;
      }[] = [];

      scene.traverse((obj) => {
        if (obj.userData.name === fromName) {
          // setGreen(obj);
          start.obj = obj
          start.position.set(
            obj.position.toArray()[0] + offset[0],
            obj.position.toArray()[1] + offset[1],
            obj.position.toArray()[2] + offset[2]
          );
        }

        if (targetNames.includes(obj.userData.name)) {
        

          targets.push({
            obj,
            // name: obj.userData.name,
            position: new THREE.Vector3(
              obj.position.toArray()[0] + offset[0],
              obj.position.toArray()[1] + offset[1],
              obj.position.toArray()[2] + offset[2]
            ),
          });
        }
      });

      if (scene instanceof THREE.Group) {
        targets.forEach((target) => {
     
          createLine(
            scene,
            String(Math.random()),
            start,
            target,
          );
        });
      }
    }
  });
};
