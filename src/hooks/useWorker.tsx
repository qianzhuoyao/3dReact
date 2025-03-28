import { useCallback, useEffect } from "react";
import { createSingle } from "../common/createSingle";
import { getWindowSingle } from "../window/windowSingle";

const workerComputedResult = createSingle(() => {
  return {
    intersectionCurrentParentGroup: null,
  };
});

export const useWorker = () => {
  const findMeshGroupsInWorker = useCallback(() => {
    return new Promise((resolve, reject) => {
      getWindowSingle().worker.computedWorker.onmessage = function (event) {
     
        const res = workerComputedResult();
        if (res) {
          res.intersectionCurrentParentGroup = event.data;
          resolve(event.data); // 解析返回的 Group 结果
        } else {
          reject("workerComputedResult undefinded");
        }
      };
    });
  }, []);

  const clearWorker = useCallback(() => {
    getWindowSingle().worker.computedWorker.terminate();
  }, []);

  useEffect(() => {
    findMeshGroupsInWorker();

    window.addEventListener("beforeunload", clearWorker, false);

    return () => {
      window.removeEventListener("beforeunload", clearWorker, false);
    };
  }, [clearWorker, findMeshGroupsInWorker]);
};
