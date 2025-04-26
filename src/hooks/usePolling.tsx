import { useCallback } from "react";
import { mergeMap, timer, merge, of } from "rxjs";
import { genPolling } from "../common/genPolling";

export const usePolling = (
  plugins: (() => Promise<unknown> | void)[],
  period?: number
) => {
  const cutomPolling = useCallback(() => {
    const queue = genPolling(period || 5000);
    return queue(plugins);
  }, [period, plugins]);

  const runPolling = useCallback(
    (subscribe?: () => void) => {
      return timer(0, period || 5000)
        .pipe(
          mergeMap(() => {
            const observables = plugins.map((fn) => of(fn()));
            return merge(...observables);
          })
        )
        .subscribe(subscribe);
    },
    [period, plugins]
  );

  return {
    runPolling,
    cutomPolling,
  };
};
