import { useEffect } from "react";
import { useEvent } from "./useEvent";
import { getWindowSingle } from "../window/windowSingle";
import * as THREE from "three";
import { findModelByCondition } from "../common/findModelByCondition";
import { useNavigate } from "react-router-dom";

export const useClickModel = (width: number, height: number) => {
  const navigate = useNavigate();
  const { upSubscribe } = useEvent();
  useEffect(() => {
    const subscription = upSubscribe(window, (e) => e).subscribe((e) => {
      console.log(e, "点击了:wqeq");
      if (e && e.button === 0) {
        getWindowSingle().threeMouse.x = (e.clientX / width) * 2 - 1;
        getWindowSingle().threeMouse.y = -(e.clientY / height) * 2 + 1;

        if (getWindowSingle().threeIntersection.length > 0) {
          const selectedObject = getWindowSingle().threeIntersection[0]
            .object as THREE.Mesh;
          const parentGroup = findModelByCondition((userData) => {
            if (typeof userData?.name === "string") {
              return userData?.name.indexOf("JG") > -1;
            }
            return false;
          }, selectedObject);
          console.log("点击了:", parentGroup);
          if (parentGroup?.name) {
            navigate("/ModelDetail/" + parentGroup?.name);
          }
        }
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [height, navigate, upSubscribe, width]);
};
