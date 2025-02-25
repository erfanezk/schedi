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

  updateTask(id: string, data: Partial<T>): T | undefined {
    const index = this._tasks.findIndex((task) => task.id === id);
    if (index >= 0) {
      const updatedTask = { ...this._tasks[index], ...data };
      this._tasks[index] = updatedTask;
      this.removeTimer(id);
      return updatedTask;
    }
    return undefined;
  }

  protected isTaskEnabled(task: T): boolean {
    if (typeof task.enabled === 'function') {
      return task.enabled();
    }
    return task.enabled;
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
