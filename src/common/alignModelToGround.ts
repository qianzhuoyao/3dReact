import * as THREE from "three";

export function alignModelToGround(object: THREE.Object3D, groundY = 0) {
  // 计算包围盒
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  // 计算底部 Y 轴位置
  const bottomY = center.y - size.y / 2;

  // 调整模型位置，让底部贴地
  object.position.y += groundY - bottomY;
}
