import { changeObject } from "../../common/changeModelByObject";
import { alertSelectTag } from "../../common/constant";
import { createSingle } from "../../common/createSingle";
import { getWindowSingle } from "../../window/windowSingle";
import * as THREE from "three";

const warn = new URL('../../assets/warning_00042.png',import.meta.url).href

export const Alert = createSingle(() => {
  return {
    alertCabintList: new Set<string>(),
  };
});

export const asyncAlert = () => {
  return fetch("/mwapi/alert/thirdAlert/thirdCurrent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: "待处理",
      instanceIdList: ["221496750324580352"],
      pageNum: 1,
      pageSize: 9999999,
    }),
  })
    .then((res) => res.json())
    .then((jsonData) => {
      console.log(jsonData, "jsonData");
      if (jsonData.rtnCode === 200) {
        jsonData?.data?.record?.forEach((item: Record<string, unknown>) => {
          if (
            typeof item === "object" &&
            typeof item?.instanceId === "string"
          ) {
            Alert()?.alertCabintList.add(item.instanceId);
          }
        });

        getWindowSingle().objects.CSS3DObjects.forEach((cssObj) => {
          if (cssObj.element.firstElementChild instanceof HTMLDivElement) {
            if (cssObj.userData.mixBy === "JF02_JG05") {
              cssObj.userData.tipType = "alert";
              // cssObj.element.firstElementChild.style.backgroundImage = `url(${alertSelectTag})`;
              cssObj.element.innerHTML = ` <div class="tag-content-alert" style="
                   background-image: url(${alertSelectTag});
                    "> 
                    <img  class="tag-alert-icon" src="${warn}">
                    <div class="tag-alert-text">${cssObj.userData.mixBy}</div>
                    </div>`;
              console.log(cssObj, "cssObj");
              changeObject(cssObj.userData.mixObject, (t) => {
                console.log(t, "ukwedfef");
                const material = t.material;
                if (material instanceof THREE.MeshStandardMaterial) {
                  const cloneMaterial = material.clone();
                  const cloneMaterial2 = material.clone();
                  if (!t.userData.originalCableOriginMaterial) {
                    t.userData.originalCableOriginMaterial = cloneMaterial;
                  }
                  t.material = cloneMaterial2;
                  cloneMaterial2.emissive.set(0xff0000);
                  // 创建光晕 Mesh
                  console.log(cloneMaterial2, "cloneMaterial2");
                  // const glowMesh = new THREE.Mesh(cloneMaterial2., glowShader);

                  cloneMaterial2.userData.materialType = "alert";
                  t.userData.clonedCableOriginMaterial = cloneMaterial2;
                }
              });
            } else {
              cssObj.element.firstElementChild.style.backgroundImage =
                cssObj.userData.originMaterialImage;
            }
          }
        });
      }
    })
    .catch((e) => {
      console.trace(e);
    });
};
