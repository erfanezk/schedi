import { ITask } from '@/interfaces';

class BaseRunner<T extends ITask> {
  protected _tasks: T[];
  protected isRunning = false;
  protected timers: Map<string, number> = new Map(); //taskId -> timerId

  constructor(tasks: T[]) {
    this._tasks = tasks;
  }

  protected isTaskEnabled(task: T): boolean {
    if (typeof task.enabled === 'function' && !task.enabled()) return false;

    return !(typeof task.enabled === 'boolean' && !task.enabled);
  }

  protected isTaskForFuture(task: T): boolean {
    return task.startAt > Date.now();
  }

  protected isTaskExpired(task: T): boolean {
    return task.expireAt < Date.now();
  }

  protected isTaskScheduled(task: T): boolean {
    return this.timers.has(task.id);
  }
}

export default BaseRunner;
