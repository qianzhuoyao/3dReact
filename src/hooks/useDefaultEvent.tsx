import { useEffect } from "react";
import { useEvent } from "./useEvent";
import { useWindowSize } from "react-use";
import { getWindowSingle } from "../window/windowSingle";
import { combineLatestWith, filter, map, merge, of, tap } from "rxjs";
import { PAUSE_INTERSECTION, RESUME_INTERSECTION } from "../common/constant";

export interface IEventPlugins {
  defaultMovePlugins?: (() => void)[];
  defaultUpPlugins?: (() => void)[];
  defaultDownPlugins?: (() => void)[];
}

export const useDefaultEvent = (plugins?: IEventPlugins) => {
  const { width, height } = useWindowSize();
  const { moveSubscribe, downSubscribe, upSubscribe } = useEvent();
  useEffect(() => {
    const defaultIntersectionSubscription = moveSubscribe(
      document.body,
      (e) => {
        return e;
      }
    )
      .pipe(
        combineLatestWith(
          merge(
            of(RESUME_INTERSECTION),
            downSubscribe(document.body, (e) => e).pipe(
              tap(() => {
                plugins?.defaultDownPlugins?.forEach((plugin) => {
                  plugin();
                });
              }),
              map(() => PAUSE_INTERSECTION)
            ),
            upSubscribe(document.body, (e) => e).pipe(
              tap(() => {
                plugins?.defaultUpPlugins?.forEach((plugin) => {
                  plugin();
                });
              }),
              map(() => RESUME_INTERSECTION)
            )
          )
        ),
        tap((v) => {
          getWindowSingle().state.intersectionAble = v[1];
        }),
        filter((v) => {
          return v[1] === RESUME_INTERSECTION;
        })
      )
      .subscribe((res) => {
        if (res[0]) {
          getWindowSingle().threeMouse.x = (res[0].clientX / width) * 2 - 1;
          getWindowSingle().threeMouse.y = -(res[0].clientY / height) * 2 + 1;

          plugins?.defaultMovePlugins?.forEach((plugin) => {
            plugin();
          });
        }
      });
    return () => {
      defaultIntersectionSubscription.unsubscribe();
    };
  }, [
    downSubscribe,
    height,
    moveSubscribe,
    plugins?.defaultDownPlugins,
    plugins?.defaultMovePlugins,
    plugins?.defaultUpPlugins,
    upSubscribe,
    width,
  ]);
};
