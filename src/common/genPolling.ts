/**
 *
 *
 * 每1000ms 执行一次
 * const intervalUpdateQueue = genPolling(1000);
 *
 * 任务队列，merge的形式(task),concat的形式(sequentiallyTask)
 * task 合并执行任务
 * sequentiallyTask 依次执行任务
 *
 * const {task,sequentiallyTask} = intervalUpdateQueue([
 *  task0,
 *  task1
 * ])
 *
 *
 *
 * 执行100次，不穿参数则为无限循环
 * execute 执行
 * const {execute} =task(100) // void 0 repeat
 * const {execute} =sequentiallyTask(100) // void 0 repeat
 *
 */

import {
  from,
  mergeMap,
  of,
  scan,
  Observer,
  switchMap,
  take,
  timer,
  Observable,
} from "rxjs";

type ITask<T> = T | undefined;
type IQueue<T> = ((pre: ITask<T>) => ITask<T>)[];

const taskResult = <T>(oberver: Observable<T>) => {
  return {
    execute: (subscribe: Partial<Observer<T>>) => {
      const subscription = oberver.subscribe(subscribe);
      return {
        destory: () => {
          subscription.unsubscribe();
        },
      };
    },
  };
};

export const genPolling = (time: number) => {
  return <T>(queue: IQueue<T>) => {
    const createIntervalOberver = () => {
      return timer(0, time).pipe(scan((acc) => acc + 1, 0));
    };

    return {
      task: (count?: number) => {
        const oberver = createIntervalOberver().pipe(
          take(count ? count : Infinity),
          switchMap((index) => {
            from(queue).pipe(mergeMap((taskFn) => of(taskFn(undefined))));
            return of(index);
          })
        );
        return taskResult(oberver);
      },
      sequentiallyTask: (count?: number) => {
        const oberver = createIntervalOberver().pipe(
          take(count ? count : Infinity),
          switchMap((index) => {
            from(queue).pipe(scan((acc, fn) => fn(acc), undefined as ITask<T>));
            return of(index);
          })
        );
        return taskResult(oberver);
      },
    };
  };
};
