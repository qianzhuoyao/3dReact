import { useEffect } from "react";
import { getWindowSingle } from "../window/windowSingle";
import * as THREE from "three";

export const useLight = () => {
  useEffect(() => {
    console.log(getWindowSingle().threeScene,'654')
    const pointLight = new THREE.PointLight(0xff0000, 1, 100);
    pointLight.position.set(10, 10, 10);
    getWindowSingle().threeAmbientLight.intensity = 5;
    getWindowSingle().threeScene.add(getWindowSingle().threeAmbientLight);
    getWindowSingle().threeScene.add(pointLight);
  }, []);
};
