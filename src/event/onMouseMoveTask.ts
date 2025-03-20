import { fromEvent, switchMap } from "rxjs";

export const onMouseMoveTask = <T>(
  dom: HTMLElement|Window,
  task: (e: MouseEvent) => Promise<T>
) => {
  return fromEvent<MouseEvent>(dom, "mousemove")
    .pipe(
      switchMap((e) => {
        return task(e);
      })
    )
};
