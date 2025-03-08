import * as THREE from "three";

export function getAllMaterials(scene: THREE.Scene) {
  let materials: THREE.Object3D[] = [];

  // 遍历场景中的每个对象
  scene.traverse((object) => {
    if (object instanceof THREE.Object3D) {
      // 如果对象是 Mesh，获取它的材质
      if (Array.isArray(object)) {
        // 如果是多个材质（比如 multi-material）
        materials = materials.concat(object);
      } else {
        // 如果是单个材质
        materials.push(object);
      }
    }
  });

  return materials;
}
