import { useCallback } from "react";
import { onMouseMoveTask } from "../event/onMouseMoveTask";
import { Observable } from "rxjs";
import { onMouseDownTask } from "../event/onMouseDownTask";
import { onMouseUpTask } from "../event/onMouseUpTask";

export const useEvent = () => {
  const subscribe = useCallback(
    <T,>(
      taskSubscribe: (
        dom: HTMLElement | Window,
        task: (e: MouseEvent) => Promise<T | void>
      ) => Observable<T>,
      dom: HTMLElement | Window,
      cb?: (e: MouseEvent) => T | void
    ) => {
      return taskSubscribe(dom, (e) => {
        return new Promise<T | void>((resolve) => {
          resolve(cb?.(e));
        });
      });
    },
    []
  );

  const moveSubscribe = useCallback(
    (dom: HTMLElement | Window, cb?: (e: MouseEvent) => void) =>
      subscribe<MouseEvent | void>(onMouseMoveTask, dom, cb),
    [subscribe]
  );

  const upSubscribe = useCallback(
    (dom: HTMLElement | Window, cb?: (e: MouseEvent) => void) =>
      subscribe<MouseEvent | void>(onMouseUpTask, dom, cb),
    [subscribe]
  );

  const downSubscribe = useCallback(
    (dom: HTMLElement | Window, cb?: (e: MouseEvent) => void) =>
      subscribe<MouseEvent | void>(onMouseDownTask, dom, cb),
    [subscribe]
  );

  return {
    moveSubscribe,
    upSubscribe,
    downSubscribe,
  };
};
