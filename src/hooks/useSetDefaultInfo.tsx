import { useCallback, useRef } from "react";
import { from, mergeMap, of } from "rxjs";
import { createSingle } from "../common/createSingle";

export const defaultInfo = createSingle(() => {
  return {
    info: new Map<string, unknown>(),
  };
});

type IPlgins = (() => Promise<{
  controller?: AbortController;
  res: unknown;
  code: string;
}>)[];
/**
 * 绑定id与name
 */
export const useSetDefaultInfo = () => {
  const ref = useRef<{
    plugins: IPlgins;
    execution: boolean;
  }>({
    plugins: [],
    execution: false,
  });

  const run = useCallback(() => {
    return of(...ref.current.plugins)
      .pipe(mergeMap((fn) => from(fn())))
      .subscribe({
        next: (data) => {
          defaultInfo()?.info.set(data.code, data.res);
       
        },
        error: (err) => console.error("发生错误:", err),
        complete: () => {},
      });
  }, []);

  const setInitSetDefaultInfoPlugins = useCallback((p: IPlgins) => {
    ref.current.plugins = p;
  }, []);

  return {
    run,
    setInitSetDefaultInfoPlugins,
  };
};
