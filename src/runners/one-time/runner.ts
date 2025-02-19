import { IOneTimeTask, IOneTimeTaskCreatePayload } from '@/interfaces';
import { CommonUtils } from '@/utils';
import BaseRunner from '@/runners/base/runner.ts';

/**
 * Class for managing one-time tasks.
 * Tasks are scheduled to execute once at a specific time and are then removed.
 */
class OneTimeTaskRunner extends BaseRunner<IOneTimeTask> {
  /**
   * Creates an instance of OneTimeTaskRunner.
   * @param {IOneTimeTask[]} tasks - List of one-time tasks to be managed.
   */
  constructor(tasks: IOneTimeTask[] = []) {
    super(tasks);
  }

  get tasks() {
    return this._tasks;
  }

  /**
   * Starts all scheduled one-time tasks and returns a function to stop them.
   * @returns {() => void} Function to stop all scheduled tasks.
   */
  start(): () => void {
    this.isRunning = true;
    this._tasks.forEach((task) => this.scheduleTask(task));
    return () => this.stopAllTasks();
  }

  /**
   * Adds a new one-time task and schedules it.
   * @param {IOneTimeTaskCreatePayload} data - The task configuration.
   * @returns {IOneTimeTask} The newly created and scheduled task.
   */
  addTask(data: IOneTimeTaskCreatePayload): IOneTimeTask {
    const newTask: IOneTimeTask = {
      ...data,
      id: CommonUtils.generateUniqueId(),
      createdAt: Date.now(),
      enabled: data.enabled ?? true,
      expireAt: data.expireAt ?? Infinity,
    };

    this.tasks.push(newTask);

    if (this.isRunning) {
      this.scheduleTask(newTask);
    }

    return newTask;
  }

  /**
   * Removes a specific task by its ID.
   * @param {string} taskId - The unique identifier of the task.
   */
  removeTask(taskId: string): void {
    if (!this.timers.has(taskId)) {
      return;
    }

    clearTimeout(this.timers.get(taskId)!);
    this.timers.delete(taskId);

    this._tasks = this.tasks.filter((task) => task.id !== taskId);
  }

  /**
   * Stops all scheduled tasks and clears their timeouts.
   */
  stopAllTasks(): void {
    this.timers.forEach((timeoutId) => clearTimeout(timeoutId));
    this.timers.clear();
    this._tasks = [];
  }

  private scheduleTask(task: IOneTimeTask): void {
    if (this.isTaskExpired(task) || !task.enabled) {
      return;
    }

    if (this.isTaskScheduled(task)) {
      return;
    }

    const delay = Math.max(0, task.startAt - Date.now());

    const timeoutId = window.setTimeout(() => this.executeTask(task), delay);
    this.timers.set(task.id, timeoutId);
  }

  private executeTask(task: IOneTimeTask): void {
    if (this.isTaskExpired(task)) {
      this.removeTask(task.id);
      return;
    }

    task.callback();

    this.removeTask(task.id);
  }
}

export default OneTimeTaskRunner;
