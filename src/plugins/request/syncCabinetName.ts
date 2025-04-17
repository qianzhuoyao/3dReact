import { getWindowSingle } from "../../window/windowSingle";
import { setModelUserDataId } from "./setModelId";

export const syncCabinetName = async () => {

   if (!getWindowSingle().state.currentLoadImportModels.has("modelA")) {
      return void 0;
    }

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
    code: Symbol("result-default-sync-name-mapping"),
  };
};
