import { fromEventPattern } from "rxjs";

export const onDomResize = (target: HTMLElement) => {
  const resize$ = fromEventPattern<ResizeObserverEntry[]>(
    (handler) => {
      const observer = new ResizeObserver(handler);
      if (target) observer.observe(target);

      return observer;
    },
    (_, observer) => observer.disconnect()
  );

  return { resize$ };
};
