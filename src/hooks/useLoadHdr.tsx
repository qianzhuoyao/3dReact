import { useEffect, useMemo } from "react";
import { getWindowSingle } from "../window/windowSingle";
import * as THREE from "three";

export const useLoadHdr = () => {
  const hdr = useMemo(() => {
    return new URL(
      "../assets/8988877_d3e48cee78d89278a32831bd57adf496.hdr",
      import.meta.url
    ).href;
  }, []);

  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(
      getWindowSingle().threeRender
    );
    pmremGenerator.compileEquirectangularShader();
    getWindowSingle().threeRgbeLoader.load(hdr, (hdrTexture) => {
      hdrTexture.mapping = THREE.EquirectangularReflectionMapping;
      const envMap = pmremGenerator.fromEquirectangular(hdrTexture).texture;
      getWindowSingle().threeScene.background = envMap;
    //   getWindowSingle().threeScene.environment = envMap;
      hdrTexture.dispose();
      pmremGenerator.dispose();
    });
  }, [hdr]);
};
