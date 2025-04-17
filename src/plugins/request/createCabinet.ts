import { getWindowSingle, IDevice } from "../../window/windowSingle";

/**
 * 获取机房信息创建机柜模型
 * @param {AbortController} controller - 用于取消请求的控制器
 * @returns {Promise<{ controller: AbortController; res: unknown; code: symbol }>} - 返回一个包含控制器、响应和代码的 Promise
 * @throws {Error} - 如果请求失败，则抛出错误
 * @description
 * 该函数使用 Fetch API 向指定的 URL 发送 POST 请求以获取机房信息。
 * 请求的内容类型为 JSON。
 * 如果请求成功，函数将返回一个包含控制器、响应和代码的对象。
 * 如果请求失败，则抛出错误。
 */
export const createCabinet = async () => {


  if (!getWindowSingle().state.currentLoadImportModels.has("modelA")) {
    return void 0;
  }

  const controller = new AbortController();
  const signal = controller.signal;

  const res = await fetch("mwapi/cmdb/digitalTwin/getRoomInfo/browse", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal,
  })
    .then((response) => response.json())
    .then((jsonData) => {
      if (jsonData.rtnCode === 200) {
        const JF02 = jsonData?.data?.data?.find(
          (item: Record<string, unknown>) => item?.model === "JF02"
        );

        if (JF02) {
        
          JF02?.cabinets?.forEach(
            (cabinet: { position: string; devices: IDevice[] }) => {
              if (typeof cabinet?.position === "string") {
                getWindowSingle().objects.cabinetDevices.set(
                  cabinet?.position,
                  cabinet.devices
                );
              }
            }
          );
          console.log(getWindowSingle().objects.cabinetDevices, "cabinetDevices");
        }
      }
    })
    .catch((e) => {
      console.error("请求失败:", e);
      console.trace(e);
    });
  return {
    controller,
    res,
    code: Symbol("result-default-cabinet-mapping"),
  };
};
