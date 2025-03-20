import * as THREE from "three";

export const changeObject = (
  object: THREE.Object3D,
  setter: (obj: THREE.Mesh) => void
): void => {
  object.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (mesh.material) {
        setter(mesh);
      }
    }
  });
};
