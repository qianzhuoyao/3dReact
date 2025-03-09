import { useEffect } from "react";
import { getWindowSingle } from "../window/windowSingle";

export const useControls = () => {
  useEffect(() => {
   
    getWindowSingle().threeOrbitControls.target.set(0, 0.5, 0);
    //限制不允许查看模型下面
    // getWindowSingle().threeOrbitControls.minPolarAngle = Math.PI / 2; // 最小俯仰角
    getWindowSingle().threeOrbitControls.maxPolarAngle = Math.PI / 2; // 最大俯仰角
    getWindowSingle().threeOrbitControls.enablePan = false;
    getWindowSingle().threeOrbitControls.enableDamping = true;
    getWindowSingle().threeOrbitControls.update();
  }, []);
};
