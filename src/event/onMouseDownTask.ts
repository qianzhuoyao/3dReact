import { fromEvent, switchMap } from "rxjs";

export const onMouseDownTask = <T>(
  dom: HTMLElement,
  task: (e: MouseEvent) => Promise<T>
) => {
  return fromEvent<MouseEvent>(dom, "mousedown").pipe(
    switchMap((e) => {
      return task(e);
    })
  );
};
