import { getWindowSingle } from "../../window/windowSingle";

export const getLinks = async () => {
  if (!getWindowSingle().state.currentLoadImportModels.has("modelA")) {
    return void 0;
  }

  const controller = new AbortController();
  const signal = controller.signal;

  const res = await fetch("mwapi/cmdb/digitalTwin/getLinkInfo/browse", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal,
  })
    .then((response) => response.json())
    .catch((e) => {
      console.error("请求失败:", e);
      console.trace(e);
    });
  return {
    controller,
    res,
    code: Symbol("result-default-link-mapping"),
  };
};
