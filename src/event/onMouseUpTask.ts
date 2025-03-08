import { fromEvent, switchMap } from "rxjs";

export const onMouseUpTask = <T>(
  dom: HTMLElement,
  task: (e: MouseEvent) => Promise<T>
) => {
  return fromEvent<MouseEvent>(dom, "mouseup").pipe(
    switchMap((e) => {
      return task(e);
    })
  );
};
