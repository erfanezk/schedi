import { ICreateIntervalTaskPayload, IIntervalTask } from '@/interfaces';
import { CommonUtils } from '@/utils';
import BaseRunner from '@/runners/base/runner.ts';

/**
 * A class for scheduling and managing interval-based tasks.
 */
class IntervalTaskRunner extends BaseRunner<IIntervalTask> {
  /**
   * Creates an instance of IntervalTaskRunner.
   * @param {IIntervalTask[]} tasks - An array of interval tasks to be managed.
   */
  constructor(tasks: IIntervalTask[] = []) {
    super(tasks);
  }

  get tasks() {
    return this._tasks;
  }

  /**
   * Starts all scheduled tasks and returns a function to stop them.
   * @returns {() => void} Function to stop all running tasks.
   */
  start(): () => void {
    this.isRunning = true;
    this._tasks.forEach((task) => this.scheduleTask(task));
    return () => this.stopAllTasks();
  }

  /**
   * Adds a new interval task and schedules it.
   * @returns {IIntervalTask} The newly created and scheduled task.
   * @param data
   */
  addTask(data: ICreateIntervalTaskPayload): IIntervalTask {
    const newTask: IIntervalTask = {
      ...data,
      lastRunAt: undefined,
      totalRunCount: 0,
      id: CommonUtils.generateUniqueId(),
      createdAt: Date.now(),
      enabled: data.enabled ?? true,
      expireAt: data.expireAt ?? Infinity,
    };
    this._tasks.push(newTask);

    if (this.isRunning) {
      this.scheduleTask(newTask);
    }

    return newTask;
  }

  /**
   * Stops a specific task by its ID.
   * @param {string} taskId - The unique identifier of the task.
   */
  removeTask(taskId: string): void {
    if (!this.timers.has(taskId)) {
      return;
    }

    clearInterval(this.timers.get(taskId)!);
    this.timers.delete(taskId);

    this._tasks = this._tasks.filter((task) => task.id !== taskId);
  }

  /**
   * Stops all running tasks and clears their intervals.
   */
  stopAllTasks(): void {
    this.timers.forEach((intervalId) => clearInterval(intervalId));
    this.timers.clear();
  }

  private scheduleTask(task: IIntervalTask): void {
    if (this.isTaskExpired(task)) {
      return;
    }

    if (!this.isTaskEnabled(task)) {
      return;
    }

    if (this.isTaskScheduled(task)) {
      return;
    }

    if (this.isTaskForFuture(task)) {
      this.scheduleTaskForFuture(task);
    } else {
      this.startInterval(task);
    }
  }

  private scheduleTaskForFuture(task: IIntervalTask): void {
    const delay = Math.max(0, task.startAt - Date.now());

    const timeoutId = window.setTimeout(() => {
      this.startInterval(task);
    }, delay);

    this.timers.set(task.id, timeoutId);
  }

  private startInterval(task: IIntervalTask): void {
    const intervalId = window.setInterval(() => this.executeTask(task), task.interval);
    this.timers.set(task.id, intervalId);
  }

  private executeTask(task: IIntervalTask): void {
    if (this.isTaskExpired(task)) {
      this.removeTask(task.id);
      return;
    }

    task.callback();
    task.lastRunAt = Date.now();
    task.totalRunCount += 1;
  }
}

export default IntervalTaskRunner;
