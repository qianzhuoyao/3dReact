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
        }) // 调用你的 API 请求
      )
      .subscribe();

    return () => {
      polling$.unsubscribe();
    };
  }, [plugins]);
};
