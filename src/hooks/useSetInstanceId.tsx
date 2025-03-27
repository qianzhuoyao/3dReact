import { useEffect } from "react";

/**
 * 绑定id与name
 */
export const useSetInstanceId = () => {
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch("mwapi/cmdb/modelManage/getCabinetinfosBYLSJY", { signal })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("请求已取消");
        } else {
          console.error("请求失败:", err);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);
};
