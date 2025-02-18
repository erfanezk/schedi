import { ICreateIntervalTaskPayload, IIntervalTask } from '@/interfaces';
import { CommonUtils } from '@/utils';

/**
 * A class for scheduling and managing interval-based tasks.
 */
class IntervalTaskRunner {
  private taskIntervals: Map<string, number> = new Map(); // Stores active intervals

  /**
   * Creates an instance of IntervalTaskRunner.
   * @param {IIntervalTask[]} tasks - An array of interval tasks to be managed.
   */
  constructor(public tasks: IIntervalTask[]) {
    this.tasks = tasks;
  }

  /**
   * Starts all scheduled tasks and returns a function to stop them.
   * @returns {() => void} Function to stop all running tasks.
   */
  start(): () => void {
    this.tasks.forEach((task) => this.scheduleTask(task));
    return () => this.stopAllTasks();
  }

  /**
   * Adds a new interval task and schedules it.
   * @param {ICreateIntervalTaskPayload} task - The task configuration.
   * @returns {IIntervalTask} The newly created and scheduled task.
   */
  addTask(task: ICreateIntervalTaskPayload): IIntervalTask {
    const newTask: IIntervalTask = {
      ...task,
      lastRunAt: undefined,
      totalRunCount: 0,
      id: CommonUtils.generateUniqueId(),
      createdAt: Date.now(),
      enabled: task.enabled ?? true,
    };
    this.tasks.push(newTask);
    this.scheduleTask(newTask);
    return newTask;
  }

  /**
   * Stops a specific task by its ID.
   * @param {string} taskId - The unique identifier of the task.
   */
  removeTask(taskId: string): void {
    if (!this.taskIntervals.has(taskId)) {
      return;
    }

    clearInterval(this.taskIntervals.get(taskId)!);
    this.taskIntervals.delete(taskId);

    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }

  /**
   * Stops all running tasks and clears their intervals.
   */
  stopAllTasks(): void {
    this.taskIntervals.forEach((intervalId) => clearInterval(intervalId));
    this.taskIntervals.clear();
  }

  private scheduleTask(task: IIntervalTask): void {
    if (this.isTaskExpired(task) || !task.enabled) {
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

    this.taskIntervals.set(task.id, timeoutId);
  }

  private startInterval(task: IIntervalTask): void {
    const intervalId = window.setInterval(() => this.executeTask(task), task.interval);
    this.taskIntervals.set(task.id, intervalId);
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

  private isTaskScheduled(task: IIntervalTask): boolean {
    return this.taskIntervals.has(task.id);
  }

  private isTaskForFuture(task: IIntervalTask): boolean {
    return task.startAt > Date.now();
  }

  private isTaskExpired(task: IIntervalTask): boolean {
    return task.expireAt < Date.now();
  }
}

export default IntervalTaskRunner;
