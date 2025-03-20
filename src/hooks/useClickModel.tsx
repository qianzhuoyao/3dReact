import { useCallback, useEffect, useRef } from "react";
import { useEvent } from "./useEvent";
import { getWindowSingle } from "../window/windowSingle";

export const useClickModel = (width: number, height: number) => {
  const { upSubscribe } = useEvent();
  const ref = useRef<{
    clicked: (e: MouseEvent) => void;
  }>({
    clicked: () => {},
  });

  useEffect(() => {
    const subscription = upSubscribe(window, (e) => e).subscribe((e) => {
      console.log(e, "点击了:wqeq");
      if (e && e.button === 0) {
        getWindowSingle().threeMouse.x = (e.clientX / width) * 2 - 1;
        getWindowSingle().threeMouse.y = -(e.clientY / height) * 2 + 1;

        if (getWindowSingle().threeIntersection.length > 0) {
          ref.current.clicked(e);
        }
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [height, upSubscribe, width]);

  const clicked = useCallback((cb: (e: MouseEvent) => void) => {
    ref.current.clicked = cb;
  }, []);

  return {
    clicked,
  };
};
