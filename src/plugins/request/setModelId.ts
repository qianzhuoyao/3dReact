import { getWindowSingle } from "../../window/windowSingle";

const setModelUserDataId = (mappingData: Record<string, string>[]) => {
  const cabinets = getWindowSingle().objects.cabinets;
  mappingData.forEach((data) => {
    const cur = cabinets.get(data?.cabinetCode);
    if (cur) {
      cur.userData.cabinetId = data?.cabinetId;
    }
  });
};

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
      }
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
    code: "default-model-mapping",
  };
};
