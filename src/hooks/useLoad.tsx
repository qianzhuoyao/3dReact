import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInit3D } from "./useInit3D";
import * as THREE from "three";
import { CSS3DObject } from "three/examples/jsm/Addons.js";
import { getWindowSingle } from "../window/windowSingle";
import { findModelByCondition } from "../common/findModelByCondition";
import gsap from "gsap";
import { createLineByNames } from "../common/createLineByNames";
import { changeObject } from "../common/changeModelByObject";
import { selectedTag, unSelectedTag } from "../common/constant";
/**
 * 加载模型
 * @param models
 * @returns
 *
 */
export const useLoad = (models: { model: string; tag: string }[]) => {
  const [currentModelState, setCurrentModelState] = useState<string[]>([
    "modelA",
  ]);

  const ref = useRef({
    expandDevice: "",
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

  const Object3DRef = useRef<{
    distribution: null | THREE.Object3D;
    door: null | THREE.Object3D;
    device: null | THREE.Object3D;
    cabinet: null | THREE.Group;
    allCloneDeviceList: THREE.Object3D[];
  }>({
    allCloneDeviceList: [],
    door: null,
    cabinet: null,
    distribution: null,
    device: null,
  });

  const removeObject = useCallback((object: THREE.Object3D) => {
    if (!object) return;

    // **从父级移除对象**
    if (object.parent) {
      object.parent.remove(object);
    }

    // **递归清除子对象**
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // **释放几何体**
        if (child.geometry) {
          child.geometry.dispose();
        }
        // **释放材质**
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    });

    // **避免内存泄漏**
    object.clear();
  }, []);

  const showTag = useCallback((show: boolean) => {
    getWindowSingle().objects.CSS3DObjects.forEach((cssobj) => {
      cssobj.visible = show;
    });
  }, []);

  const setRotatable = useCallback((rotatable: boolean) => {
    getWindowSingle().state.rotatable = rotatable;
  }, []);

  const openDoor = useCallback((gp: THREE.Group) => {
    gsap.to(gp.rotation, { y: Math.PI, duration: 1 });
    ref.current.openDoor = true;
  }, []);
  const closeDoor = useCallback((gp: THREE.Group) => {
    gsap.to(gp.rotation, { y: 0, duration: 1 });
    ref.current.openDoor = false;
  }, []);
  const addDevice = useCallback((deviceList: { name: string }[]) => {
    if (
      getWindowSingle().state.currentLoadImportModels.has(
        "cabinetAndDeviceModel"
      )
    ) {
      console.log(deviceList, "deviceList");
      if (Object3DRef.current.cabinet) {
        deviceList.forEach((device, index) => {
          if (
            Object3DRef.current.allCloneDeviceList.some(
              (deviceItem) => deviceItem.userData.tag === index
            )
          ) {
            return;
          }

          const cloneDevice = Object3DRef.current.device?.clone();
          if (cloneDevice) {
            cloneDevice.userData.belong = "device";
            cloneDevice.visible = true;
            cloneDevice.userData.tag = index;
            cloneDevice.position.set(0, (index + 1) * 0.11, 0.32);
            cloneDevice.name = device.name;
            Object3DRef.current.cabinet?.add(cloneDevice);
            Object3DRef.current.allCloneDeviceList.push(cloneDevice);
          }
        });
      }
    }
  }, []);

  /**
   * 对机柜进行一些设置
   * 比如移动 设备与配线架
   * 设置门的旋转轴
   */
  const initCab = useCallback((cab: THREE.Group) => {
    if (cab) {
      cab.traverse((child) => {
        if (child.name === "门") {
          Object3DRef.current.door = child;
        } else if (child.name === "交换机") {
          Object3DRef.current.device = child;
        } else if (child.name === "配线架") {
          Object3DRef.current.distribution = child;
        }
      });
      //移出设备与配线架

      const deviceGroup = new THREE.Group();
      if (Object3DRef.current.distribution) {
        Object3DRef.current.distribution.visible = false;
        deviceGroup.add(Object3DRef.current.distribution);
      }
      if (Object3DRef.current.device) {
        Object3DRef.current.device.visible = false;
        deviceGroup.add(Object3DRef.current.device);
      }

      getWindowSingle().threeScene.add(deviceGroup);

      if (Object3DRef.current.door) {
        let gp: THREE.Group | null = null;
        if (getWindowSingle().objects.pivot.has(Object3DRef.current.door)) {
          gp = getWindowSingle().objects.pivot.get(Object3DRef.current.door);
        } else {
          gp = new THREE.Group();
          Object3DRef.current.door.parent?.add(gp);
          gp.position.set(270, -950, 580);
          Object3DRef.current.door.position.set(-270, 0, 0);

          gp.add(Object3DRef.current.door);
          getWindowSingle().objects.pivot.set(Object3DRef.current.door, gp);
        }
      }
    }
  }, []);

  const reset = useCallback(() => {
    if (Object3DRef.current.door) {
      const gp = getWindowSingle().objects.pivot.get(Object3DRef.current.door);
      closeDoor(gp);
    }

    Object3DRef.current.allCloneDeviceList.forEach((deviceClone, index) => {
      gsap.to(deviceClone.position, {
        x: 0,
        y: (index + 1) * 0.11,
        z: 0.32,
        duration: 0.5,
        ease: "power2.out",
      });
    });

    gsap.to(getWindowSingle().threeCamera.position, {
      x: -0.22624660155885867,
      y: 0.6044115994544303,
      z: 1.1906498404273447,
      duration: 1,
      ease: "power2.out",
    });
  }, [closeDoor]);

  const showCable = useCallback((show: boolean) => {
    getWindowSingle().objects.cableLines.forEach((cable) => {
      console.log(cable, "cablessss");

      if (cable.start.obj?.userData.bindCssTagObject) {
        if (show) {
          cable.start.obj.userData.bindCssTagObject.element.firstElementChild.style.backgroundImage = `url(${selectedTag})`;
        } else {
          cable.start.obj.userData.bindCssTagObject.element.firstElementChild.style.backgroundImage = `url(${unSelectedTag})`;
        }
      }
      if (cable.target.obj?.userData.bindCssTagObject) {
        if (show) {
          cable.target.obj.userData.bindCssTagObject.element.firstElementChild.style.backgroundImage = `url(${selectedTag})`;
        } else {
          cable.target.obj.userData.bindCssTagObject.element.firstElementChild.style.backgroundImage = `url(${unSelectedTag})`;
        }
      }

      cable.line.visible = show;
      if (cable.start.obj) {
        changeObject(cable.start.obj, (t) => {
          const material = t.material;
          if (material instanceof THREE.MeshStandardMaterial) {
            if (show) {
              t.material = t.userData.clonedCableOriginMaterial;
            } else {
              t.material = t.userData.originalCableOriginMaterial;
            }
          }
        });
      }
      if (cable.target.obj) {
        changeObject(cable.target.obj, (t) => {
          const material = t.material;
          if (material instanceof THREE.MeshStandardMaterial) {
            console.log(t, show, "csacascasc");
            if (show) {
              t.material = t.userData.clonedCableOriginMaterial;
            } else {
              t.material = t.userData.originalCableOriginMaterial;
            }
          }
        });
      }
    });
  }, []);

  const back = useCallback(() => {
    reset();
    if (ref.current.currentModel === "cabinetAndDeviceModel") {
      setCurrentModel(["modelA"]);
      ref.current.currentModel = "modelA";
      setCurrentModelState(["modelA"]);
    }
  }, [reset, setCurrentModel]);

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
      const deviceItem = findModelByCondition((userData) => {
        if (typeof userData?.belong === "string") {
          return userData?.belong.indexOf("device") > -1;
        }
        return false;
      }, selectedObject);

      if (deviceItem && ref.current.openDoor) {
        Object3DRef.current.allCloneDeviceList.forEach((deviceClone, index) => {
          if (deviceClone.userData.tag !== deviceItem.userData.tag) {
            gsap.to(deviceClone.position, {
              x: 0,
              y: (index + 1) * 0.11,
              z: 0.32,
              duration: 0.5,
              ease: "power2.out",
            });
          } else {
            if (ref.current.expandDevice === deviceClone.userData.tag) {
              gsap.to(deviceClone.position, {
                x: 0,
                y: (index + 1) * 0.11,
                z: 0.32,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                  ref.current.expandDevice = "";
                },
              });
            } else {
              gsap.to(deviceClone.position, {
                x: 0,
                y: (index + 1) * 0.11,
                z: 0.55,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                  ref.current.expandDevice = deviceClone.userData.tag;
                },
              });
            }
          }
        });
      }

      console.log(selectedObject, "selectedObject");
      const doorGroup = findModelByCondition((userData) => {
        if (typeof userData?.name === "string") {
          return userData?.name.indexOf("门") > -1;
        }
        return false;
      }, selectedObject);

      if (doorGroup) {
        const gp = getWindowSingle().objects.pivot.get(doorGroup);

        if (ref.current.expandDevice !== "") {
          //存在展出的不能收回
          return;
        }

        console.log(doorGroup, "sceness");
        if (gp) {
          if (ref.current.openDoor) {
            gsap.to(gp.rotation, { y: 0, duration: 1 });
          } else {
            gsap.to(gp.rotation, { y: Math.PI, duration: 1 });
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

    if (parentGroup?.name) {
      const direction = new THREE.Vector3();
      getWindowSingle().threeCamera.getWorldDirection(direction);

      gsap.to(getWindowSingle().threeCamera.position, {
        x: getWindowSingle().threeCamera.position.x + direction.x * 0.7,
        y: getWindowSingle().threeCamera.position.y + direction.y * 0.7,
        z: getWindowSingle().threeCamera.position.z + direction.z * 0.7,
        duration: 0.7,
        ease: "power2.out",
        onComplete: () => {
          if (ref.current.currentModel === "modelA") {
            ref.current.currentModel = "cabinetAndDeviceModel";
            getWindowSingle().threeScene.children.some((child) => {
              if (child.userData.tag === "cabinetAndDeviceModel") {
                Object3DRef.current.cabinet = child as THREE.Group;
                child.scale.set(0.3, 0.3, 0.3);
                child.userData.originScale = [0.3, 0.3, 0.3];
                child.position.set(0, -0.5, 0);
                return;
              }
            });
            //必须把场景旋转恢复下
            getWindowSingle().threeScene.rotation.y = 0;
            gsap.to(getWindowSingle().threeCamera.position, {
              x: -0.1,
              y: -0.2,
              z: 1.0,
              duration: 0.7,
              ease: "power2.out",
              onComplete: () => {
                if (Object3DRef.current.door) {
                  const gp = getWindowSingle().objects.pivot.get(
                    Object3DRef.current.door
                  );
                  //显示当前机柜下的设备
                  addDevice([
                    {
                      name: "1",
                    },
                    {
                      name: "2",
                    },
                    {
                      name: "3",
                    },
                  ]);
                  openDoor(gp);
                }
              },
            });
          } else {
            ref.current.currentModel = "modelA";
            gsap.to(getWindowSingle().threeCamera.position, {
              x: 0.35417975254882605,
              y: 0.9307114999619761,
              z: 1.042830504709191,
              duration: 0.7,
              ease: "power2.out",
            });
          }
          setCurrentModelState([ref.current.currentModel]);
          setCurrentModel([ref.current.currentModel]);
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
        setCurrentModelState(["modelA"]);
        setCurrentModel(["modelA"]);
        createLineByNames("JF02_JG01", ["JF02_JG10"], [0.1, 1, 0]);

        if (gltf.scene.userData.tag === "cabinetAndDeviceModel") {
          initCab(gltf.scene);
        }

        //添加标签
      });
      ref.current.isLoaded = true;
    }
  }, [
    load,
    addDevice,
    mixTagWithJG,
    models,
    setCameraLookAt,
    initCab,
    setCameraPosition,
    setCenter,
    setCurrentModel,
    setFar,
    setNear,
  ]);

  return {
    currentModelState,
    removeObject,
    setRotatable,
    showTag,
    back,
    showCable,
    setRef,
    setFar,
    setNear,
  };
};
