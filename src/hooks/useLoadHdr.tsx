import { useEffect, useMemo } from "react";
import { getWindowSingle } from "../window/windowSingle";
import * as THREE from "three";

export const useLoadHdr = () => {
  const hdr = useMemo(() => {
    return new URL(
      "../assets/环境12.hdr",
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
