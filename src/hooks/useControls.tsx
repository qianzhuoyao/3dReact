import { useEffect } from "react";
import { getWindowSingle } from "../window/windowSingle";
import * as THREE from "three";

export const useControls = () => {
  useEffect(() => {
    getWindowSingle().threeOrbitControls.target.set(0, 0, 0);
    //限制不允许查看模型下面
    // getWindowSingle().threeOrbitControls.minPolarAngle = Math.PI / 2; // 最小俯仰角
    // getWindowSingle().threeOrbitControls.maxPolarAngle = Math.PI / 2; // 最大俯仰角
    getWindowSingle().threeOrbitControls.enablePan = true;
    getWindowSingle().threeOrbitControls.enableDamping = false;
    getWindowSingle().threeOrbitControls.mouseButtons.RIGHT = THREE.MOUSE.PAN; // 右键平移
    getWindowSingle().threeOrbitControls.mouseButtons.LEFT = THREE.MOUSE.ROTATE; // 左键旋转
  }, []);
};
