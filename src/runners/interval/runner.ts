import { IIntervalTask, IIntervalTaskCreatePayload } from '@/interfaces';
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
  addTask(data: IIntervalTaskCreatePayload): IIntervalTask {
    const newTask: IIntervalTask = this.createTask(data);
    this._tasks.push(newTask);

    if (this.isRunning) {
      this.scheduleTask(newTask);
    }

    return newTask;
  }

  /**
   * Stops all running tasks and clears their intervals.
   */
  stopAllTasks(): void {
    this.timers.forEach((intervalId) => clearInterval(intervalId));
    this.timers.clear();
  }

  /**
   * Updates a task in the task list by its ID.
   * If the task with the provided ID is found, it will merge the existing task data with the new `data` object.
   * The updated task is returned. If the task is not found, `undefined` is returned.
   *
   * @param {string} id - The ID of the task to update.
   * @param {Partial<IIntervalTaskCreatePayload>} data - The data to update the task with. It can be a partial object of the task's payload.
   *
   * @returns {IIntervalTask | undefined} The updated task if found and updated, otherwise `undefined` if no task was found with the provided ID.
   */
  updateTask(id: string, data: Partial<IIntervalTaskCreatePayload>): IIntervalTask | undefined {
    const updatedTask = super.updateTask(id, data);

    if (updatedTask) {
      this.scheduleTask(updatedTask);
    }

    return updatedTask;
  }

  private createTask(data: IIntervalTaskCreatePayload): IIntervalTask {
    return {
      ...data,
      lastRunAt: undefined,
      totalRunCount: 0,
      id: CommonUtils.generateUniqueId(),
      createdAt: Date.now(),
      enabled: data.enabled ?? true,
      expireAt: data.expireAt ?? Infinity,
    };
  }

  private scheduleTask(task: IIntervalTask): void {
    if (this.canScheduleTask(task)) {
      if (this.isTaskForFuture(task)) {
        this.scheduleTaskForFuture(task);
      } else {
        this.startInterval(task);
      }
    }
  }

  private scheduleTaskForFuture(task: IIntervalTask): void {
    const delay = Math.max(0, task.startAt - Date.now());
    const timeout = setTimeout(() => this.startInterval(task), delay);
    this.timers.set(task.id, timeout);
  }

  private startInterval(task: IIntervalTask): void {
    const interval = setInterval(() => this.executeTask(task), task.interval);
    this.timers.set(task.id, interval);
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
