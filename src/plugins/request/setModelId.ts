import { unSelectedTag } from "../../common/constant";
import { getWindowSingle } from "../../window/windowSingle";

export const setModelUserDataId = (mappingData: Record<string, string>[]) => {
  mappingData.forEach((data) => {
    getWindowSingle().objects.cabinets.set(data.cabinetCode, data);
  });
  getWindowSingle().objects.CSS3DObjects.forEach((cssObj) => {
    cssObj.userData.mappingInfo = mappingData.find(
      (i) => i.cabinetCode === cssObj.userData.mixObject.userData.name
    )
    cssObj.element.innerHTML = ` <div class="tag-content" style="
         background-image: url(${unSelectedTag});
          "> 
          <div class="tag-text">${
            cssObj.userData.mappingInfo?.cabinetName
          }</div>
          </div>`;
  });
};

export const ModelIdResult = Symbol("result-default-model-mapping");

export const setModelId = async () => {
  const controller = new AbortController();
  const signal = controller.signal;

  const res = await fetch("mwapi/cmdb/digitalTwin/getCabinetInfosBYLSJY", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal,
  })
    .then((response) => response.json())
    .then((res) => {
      if (res.rtnCode === 200) {
        //设置模型里的机柜 ，设置上id
        setModelUserDataId(res.data);
        return res?.data || [];
      }
      return [];
    })
    .catch((err) => {
      if (err.name === "AbortError") {
        console.log("请求已取消");
      } else {
        console.error("请求失败:", err);
      }
    });

  return {
    controller,
    res,
    code: ModelIdResult,
  };
};
