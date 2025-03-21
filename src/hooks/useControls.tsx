import { useEffect } from "react";
import { getWindowSingle } from "../window/windowSingle";
import * as THREE from "three";

export const useControls = () => {
  useEffect(() => {
    //限制不允许查看模型下面
    // getWindowSingle().threeOrbitControls.minPolarAngle = Math.PI / 2; // 最小俯仰角
    getWindowSingle().threeOrbitControls.maxPolarAngle = Math.PI / 2; // 最大俯仰角
    getWindowSingle().threeOrbitControls.enablePan = true;
    getWindowSingle().threeOrbitControls.enableDamping = false;
    // getWindowSingle().threeOrbitControls.screenSpacePanning = false; // 确保是"世界空间"而不是屏幕空间
    getWindowSingle().threeOrbitControls.mouseButtons.RIGHT = THREE.MOUSE.PAN; // 右键平移
    getWindowSingle().threeOrbitControls.mouseButtons.LEFT = THREE.MOUSE.ROTATE; // 左键旋转
    getWindowSingle().threeOrbitControls.update();
  }, []);
};
