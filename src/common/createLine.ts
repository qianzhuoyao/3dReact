import { getWindowSingle } from "../window/windowSingle";
import * as THREE from "three";
import {
  Line2,
  LineGeometry,
  LineMaterial,
} from "three/examples/jsm/Addons.js";

export const createLine = (
  scene: THREE.Group,
  id: string,
  from: THREE.Vector3,
  target: THREE.Vector3,
  fromName: string,
  targetName: string
) => {
  // Line2 ( LineGeometry, LineMaterial )

  // const from = new THREE.Vector3(-1, 0, 0);
  // const target = new THREE.Vector3(1, 1, 1);

  const geometry = new LineGeometry();
  geometry.setPositions([
    from.x,
    from.y,
    from.z,
    from.x,
    from.y + 0.1,
    from.z,
    target.x,
    target.y + 0.1,
    target.z,
    target.x,
    target.y,
    target.z,
  ]);

  const matLine = new LineMaterial({
    linewidth: 5,
    color: 0x00ff00,
    dashed: false,
  });

  const line = new Line2(geometry, matLine);
  line.scale.set(1,1,1);

  getWindowSingle().objects.cableLines.set(id, {
    id,
    fromName,
    targetName,
    from,
    target,
    line,
  });

  scene.add(line);
};
