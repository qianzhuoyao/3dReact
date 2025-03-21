import { useCallback, useEffect, useMemo, useRef } from "react";
import { useInit3D } from "./useInit3D";
import * as THREE from "three";
import { CSS3DObject } from "three/examples/jsm/Addons.js";
import { getWindowSingle } from "../window/windowSingle";
import { findModelByCondition } from "../common/findModelByCondition";
import gsap from "gsap";
import { createLineByNames } from "../common/createLineByNames";
/**
 * 加载模型
 * @param models
 * @returns
 *
 */
export const useLoad = (models: { model: string; tag: string }[]) => {
  const ref = useRef({
    openDoor: false,
    isLoaded: false,
    currentModel: "modelA",
  });

  const {
    load,
    setCameraPosition,
    setCenter,
    setCameraLookAt,
    setRef,
    setFar,
    setNear,
    setCurrentModel,
    clicked,
  } = useInit3D();

  const createTag = useCallback(() => {
    const labelDiv = document.createElement("div");
    return labelDiv;
  }, []);

  const tagUrl = useMemo(() => {
    return new URL("../assets/grayTag.png", import.meta.url).href;
  }, []);

  const mix = useCallback(
    (object: THREE.Object3D, scene: THREE.Object3D) => {
      const group = new THREE.Group();
      const tag = createTag();
      tag.innerHTML = ` <div class="tag-content" style="
     background-image: url(${tagUrl});
      "> 
      <div class="tag-text">${object.userData.name}</div>
      </div>`;
      const label = new CSS3DObject(tag);
      getWindowSingle().objects.CSS3DObjects.add(label);
      const position = object.position.toArray();
      label.position.set(position[0] - 0.2, position[1] + 1.2, position[2]); // 标签放在立方体上方
      label.scale.set(0.02, 0.02, 0.02);
      group.add(label);
      group.add(object);
      group.userData.type = "tag-group";
      label.userData.mixBy = object.userData.name;
      group.userData.objectName = object.userData.name;
      scene.add(group);
    },
    [createTag, tagUrl]
  );

  //查找机柜，并创建tag
  const mixTagWithJG = useCallback(
    (obj: THREE.Object3D) => {
      [...obj.children].forEach((child) => {
        if (
          child.isObject3D &&
          typeof child.name === "string" &&
          child.name.indexOf("JG") > -1
        ) {
          mix(child, obj);
        }
      });
      obj.traverse((object) => {
        if (
          object.isObject3D &&
          typeof object.name === "string" &&
          object.name.indexOf("JG") > -1
        ) {
          mix(object, obj);
        }
      });
    },
    [mix]
  );

  clicked(() => {
    const selectedObject = getWindowSingle().threeIntersection[0]
      .object as THREE.Mesh;
    if (
      getWindowSingle().state.currentLoadImportModels.has(
        "cabinetAndDeviceModel"
      )
    ) {
      console.log(selectedObject, "selectedObject");
      const doorGroup = findModelByCondition((userData) => {
        if (typeof userData?.name === "string") {
          return userData?.name.indexOf("门") > -1;
        }
        return false;
      }, selectedObject);

      if (doorGroup) {
        let gp: THREE.Group | null = null;
        if (getWindowSingle().objects.pivot.has(doorGroup)) {
          gp = getWindowSingle().objects.pivot.get(doorGroup);
        } else {
          gp = new THREE.Group();
          // const scene = getWindowSingle().threeScene.children.find(
          //   (child) => child.userData.tag === "cabinetAndDeviceModel"
          // );
          // gp.position.set(1, 0, 0);
          // doorGroup.position.set(-490, -990, 900);
          doorGroup.parent?.add(gp);
           gp.position.set(250,-950,580)
          doorGroup.position.set(-250,0,0)
          // doorGroup.parent?.position.set(1, 0, 0);
          gp.add(doorGroup);
          getWindowSingle().objects.pivot.set(doorGroup, gp);
        }
        // gp?.scale.set(1, 1, 1);
        // gp.position.x = 10;
        console.log(doorGroup, "sceness");
        if (gp) {
          if (ref.current.openDoor) {
            gsap.to(gp.rotation, { y: 0, duration: 1 });
          } else {
            gsap.to(gp.rotation, { y: Math.PI , duration: 1 });
          }
          ref.current.openDoor = !ref.current.openDoor;
        }
      }

      return;
    }

    const parentGroup = findModelByCondition((userData) => {
      if (typeof userData?.name === "string") {
        return userData?.name.indexOf("JG") > -1;
      }
      return false;
    }, selectedObject);
    console.log(getWindowSingle().threeScene, "cl");
    console.log("点击了:", parentGroup);
    if (parentGroup?.name) {
      const direction = new THREE.Vector3();
      getWindowSingle().threeCamera.getWorldDirection(direction); // 获取摄像机的朝向方向（单位向量）

      gsap.to(getWindowSingle().threeCamera.position, {
        x: getWindowSingle().threeCamera.position.x + direction.x * 0.7,
        y: getWindowSingle().threeCamera.position.y + direction.y * 0.7,
        z: getWindowSingle().threeCamera.position.z + direction.z * 0.7,
        duration: 1.5,
        ease: "power2.out",
        onComplete: () => {
          if (ref.current.currentModel === "modelA") {
            ref.current.currentModel = "cabinetAndDeviceModel";
            getWindowSingle().threeScene.children.forEach((child) => {
              if (child.userData.tag === "cabinetAndDeviceModel") {
                child.scale.set(0.3, 0.3, 0.3);
                child.userData.originScale = [0.3, 0.3, 0.3];
                child.position.set(0, -0.5, 0);
              }
            });
          } else {
            ref.current.currentModel = "modelA";
          }
          setCurrentModel([ref.current.currentModel]);
          gsap.to(getWindowSingle().threeCamera.position, {
            x: -0.22624660155885867,
            y: 0.6044115994544303,
            z: 1.1906498404273447,
            duration: 1,
            ease: "power2.out",
          });
        },
      });

      //
    }
  });

  //初始的一些设置
  useEffect(() => {
    //加载，只加载一次
    if (ref.current.isLoaded === false) {
      setCameraPosition(
        0.35417975254882605,
        0.9307114999619761,
        1.042830504709191
      );
      setFar(1000);
      setNear(0.01);
      //设置下视线，避免一开始就选中
      setCameraLookAt(0, -0.2, 0);

      load(models, (gltf) => {
        console.log(gltf, "gltf");
        gltf.scene.position.set(0, 0, 0);
        gltf.scene.scale.set(0.1, 0.1, 0.1);
        gltf.scene.userData.originScale = [0.1, 0.1, 0.1];
        setCenter(gltf.scene);
        mixTagWithJG(gltf.scene);
        setCurrentModel(["modelA"]);
        createLineByNames("JF02_JG01", ["JF02_JG10"], [0.1, 1, 0]);

        //添加标签
      });
      ref.current.isLoaded = true;
    }
  }, [
    load,
    mixTagWithJG,
    models,
    setCameraLookAt,
    setCameraPosition,
    setCenter,
    setCurrentModel,
    setFar,
    setNear,
  ]);

  return {
    setRef,
    setFar,
    setNear,
  };
};
