import { getWindowSingle } from "../window/windowSingle";
import * as THREE from "three";
import { changeObject } from "./changeModelByObject";
import { selectedTag } from "./constant";

export const setColor = (
  object: THREE.Object3D<THREE.Object3DEventMap>,
  color: number
) => {
  const cssTagObject = object.userData.bindCssTagObject;
  if (
    cssTagObject &&
    cssTagObject.element.firstElementChild instanceof HTMLDivElement
  ) {
    cssTagObject.userData.tipType = "select";
    cssTagObject.element.firstElementChild.style.backgroundImage = `url(${selectedTag})`;
    cssTagObject.userData.originMaterialImage = `url(${selectedTag})`;
  }

  changeObject(object, (t) => {
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
  const path = new THREE.CurvePath<THREE.Vector3>();

  path.add(
    new THREE.LineCurve3(
      start.position,
      new THREE.Vector3(
        start.position.x,
        start.position.y + 0.1,
        start.position.z
      )
    )
  ); // 左侧
  path.add(
    new THREE.LineCurve3(
      new THREE.Vector3(
        start.position.x,
        start.position.y + 0.1,
        start.position.z
      ),
      new THREE.Vector3(
        target.position.x,
        target.position.y + 0.1,
        target.position.z
      )
    )
  ); // 上拐点
  path.add(
    new THREE.LineCurve3(
      new THREE.Vector3(
        target.position.x,
        target.position.y + 0.1,
        target.position.z
      ),
      target.position
    )
  ); // 横向

  // const curve = new THREE.CatmullRomCurve3([
  //   start.position,
  //   new THREE.Vector3(
  //     start.position.x,
  //     start.position.y + 0.1,
  //     start.position.z
  //   ),
  //   new THREE.Vector3(
  //     target.position.x,
  //     target.position.y + 0.1,
  //     target.position.z
  //   ),
  //   target.position,
  // ]);
  const tubeGeometry = new THREE.TubeGeometry(path, 100, 0.016, 8, false);

  const cable = new THREE.Mesh(
    tubeGeometry,
    getWindowSingle().objects.batteryMaterial
  );

  cable.scale.set(1, 1, 1);
  if (start.obj) {
    setColor(start.obj, 0x008000);
    setColor(target.obj, 0x008000);
  }

  getWindowSingle().objects.cableLines.set(id, {
    id,
    start,
    target,
    line: cable,
  });

  scene.add(cable);
};
