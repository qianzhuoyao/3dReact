import {
  BufferGeometry,
  Material,
  Mesh,
  NormalBufferAttributes,
  Object3DEventMap,
} from "three";

export const findGroup = (
  mesh: Mesh<
    BufferGeometry<NormalBufferAttributes>,
    Material | Material[],
    Object3DEventMap
  >
) => {
  let parent = mesh.parent;
  while (parent) {
    if (parent.type === "Group") {
      return parent; // 找到 Group 返回
    }
    parent = parent.parent; // 继续向上查找
  }
  return null; // 没找到 Group
};
