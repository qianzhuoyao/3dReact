import { changeObject } from "../../common/changeModelByObject";
import { alertSelectTag } from "../../common/constant";
import { defaultInfo } from "../../hooks/useSetDefaultInfo";
import { getWindowSingle } from "../../window/windowSingle";
import * as THREE from "three";
import { ModelIdResult } from "./setModelId";

const warn = new URL("../../assets/warning_00042.png", import.meta.url).href;

export const asyncAlert = () => {


  if (!getWindowSingle().state.currentLoadImportModels.has("modelA")) {
    return void 0;
  }

  const modelData = defaultInfo()?.info.get(ModelIdResult);

  console.log(modelData, "modelData");

  if (Array.isArray(modelData)) {
    return fetch("/mwapi/alert/thirdAlert/thirdCurrent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "待处理",
        //instanceIdList: ["221496750324580352"],
        instanceIdList: modelData.map((model) => model.cabinetId),
        pageNum: 1,
        pageSize: 9999999,
      }),
    })
      .then((res) => res.json())
      .then((jsonData) => {
        console.log(jsonData, "item");
        if (jsonData.rtnCode === 200) {
          jsonData?.data?.records?.forEach((item: Record<string, unknown>) => {
            if (
              typeof item === "object" &&
              typeof item?.instanceId === "string"
            ) {
              getWindowSingle().objects?.alertCabintList.add(item.instanceId);
            }
          });

          getWindowSingle().objects.CSS3DObjects.forEach((cssObj) => {
            if (cssObj.element.firstElementChild instanceof HTMLDivElement) {
              if (
                getWindowSingle().objects?.alertCabintList.has(
                  getWindowSingle().objects.cabinets.get(
                    cssObj.userData.mixObject.userData.name
                  ) as string
                )
              ) {
                cssObj.userData.tipType = "alert";
                // cssObj.element.firstElementChild.style.backgroundImage = `url(${alertSelectTag})`;
                cssObj.element.innerHTML = ` <div class="tag-content-alert" style="
                     background-image: url(${alertSelectTag});
                      "> 
                      <img  class="tag-alert-icon" src="${warn}">
                      <div class="tag-alert-text">${
                        cssObj.userData.mappingInfo?.cabinetName ||
                        cssObj.userData.mixObject.userData.name
                      }</div>
                      </div>`;

                changeObject(cssObj.userData.mixObject, (t) => {
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
  }
};
