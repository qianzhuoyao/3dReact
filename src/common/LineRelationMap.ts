import { createSingle } from "./createSingle";
import * as THREE from "three";

export const LineRelationMap = createSingle(() => {
    return {
      relation: new Map<string, THREE.Object3D>(),
    };
  });
  