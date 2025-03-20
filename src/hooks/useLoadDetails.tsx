import { useCallback, useEffect, useMemo, useRef } from "react";
import { useInit3D } from "./useInit3D";
import * as THREE from "three";
import { CSS3DObject } from "three/examples/jsm/Addons.js";
import { getWindowSingle } from "../window/windowSingle";

export const useModelDetails = (models: string[]) => {
  const ref = useRef({
    isLoaded: false,
  });
  const {
    load,
    setCameraPosition,
    setCenter,
    setCameraLookAt,
    setRef,
    setFar,
    setNear,
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
      if (getWindowSingle().state.loadedModelSet.has("modelA")) {
        return;
      }
      load(models, (gltf) => {
        console.log(gltf, "gltf");
        gltf.scene.position.set(0, 0, 0);
        gltf.scene.scale.set(0.1, 0.1, 0.1);
        setCenter(gltf.scene);
        mixTagWithJG(gltf.scene);
        getWindowSingle().state.loadedModelSet.add("modelA");
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
    setFar,
    setNear,
  ]);

  return {
    setRef,
    setFar,
    setNear,
  };
};
