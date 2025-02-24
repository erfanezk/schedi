import { ITask } from '@/interfaces';

class BaseRunner<T extends ITask> {
  protected _tasks: T[];
  protected isRunning = false;
  protected timers: Map<string, NodeJS.Timeout> = new Map(); //taskId -> timeout

  constructor(tasks: T[]) {
    this._tasks = tasks;
  }

  /**
   * Stops a specific task by its ID.
   * @param {string} taskId - The unique identifier of the task.
   */
  removeTask(taskId: string): void {
    if (this.isTaskScheduled(taskId)) {
      this.clearTaskTimer(taskId);
    }

    this._tasks = this._tasks.filter((task) => task.id !== taskId);
  }

  updateTask<Y extends Partial<T>>(id: string, data: Y): T | undefined {
    const index = this._tasks.findIndex((task) => task.id === id);

    if (index >= 0) {
      const newTaskToSchedule = {
        ...this._tasks[index],
        ...data,
      };
      this._tasks[index] = newTaskToSchedule;
      this.removeTimer(id);
      return newTaskToSchedule;
    }

    return undefined;
  }

  protected isTaskEnabled(task: T): boolean {
    if (typeof task.enabled === 'function' && !task.enabled()) {
      return false;
    }

    return !(typeof task.enabled === 'boolean' && !task.enabled);
  }

  protected isTaskForFuture(task: T): boolean {
    return task.startAt > Date.now();
  }

  protected canScheduleTask(task: T) {
    return this.isTaskEnabled(task) && !this.isTaskExpired(task) && !this.isTaskScheduled(task.id);
  }

  protected removeTimer(taskId: string) {
    this.clearTaskTimer(taskId);
  }

  protected isTaskExpired(task: T): boolean {
    return task.expireAt < Date.now();
  }

  private isTaskScheduled(taskId: string): boolean {
    return this.timers.has(taskId);
  }

  private clearTaskTimer(taskId: string): void {
    if (this.timers.has(taskId)) {
      clearTimeout(this.timers.get(taskId)!);
      this.timers.delete(taskId);
    }
  }
}

export default BaseRunner;
