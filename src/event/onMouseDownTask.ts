import { fromEvent, switchMap } from "rxjs";

export const onMouseDownTask = <T>(
  dom: HTMLElement|Window,
  task: (e: MouseEvent) => Promise<T>
) => {
  return fromEvent<MouseEvent>(dom, "mousedown").pipe(
    switchMap((e) => {
      return task(e);
    })
  );
};
