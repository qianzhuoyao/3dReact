import {
  BufferGeometry,
  Material,
  Mesh,
  NormalBufferAttributes,
  Object3DEventMap,
} from "three";

export const findModelByCondition = (
  condition: (userData: Record<string, unknown>) => boolean,
  mesh: Mesh<
    BufferGeometry<NormalBufferAttributes>,
    Material | Material[],
    Object3DEventMap
  >
) => {
  let parent = mesh.parent;
  while (parent) {
    if (condition(parent.userData)) {
      return parent; // 找到 Group 返回
    }
    parent = parent.parent; // 继续向上查找
  }
  return null; // 没找到 Group
};
