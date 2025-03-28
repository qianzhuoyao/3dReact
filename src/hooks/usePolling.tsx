import { useEffect } from "react";
import { interval, switchMap } from "rxjs";

export const usePolling = (
  plugins: (() => Promise<void>)[],
  period?: number
) => {
  useEffect(() => {
    const polling$ = interval(period || 5000)
      .pipe(
        switchMap(() => {
          return plugins.map((task) => {
            return task();
          });
        })
      )
      .subscribe();

    return () => {
      polling$.unsubscribe();
    };
  }, [period, plugins]);
};
