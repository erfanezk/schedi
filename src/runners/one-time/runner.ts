import { IOnceTimeTaskCreatePayload, IOneTimeTask } from '@/interfaces';
import { CommonUtils } from '@/utils';

/**
 * Class for managing one-time tasks.
 * Tasks are scheduled to execute once at a specific time and are then removed.
 */
class OneTimeTaskRunner {
  private taskTimeouts: Map<string, number> = new Map(); //taskId timeoutId

  /**
   * Creates an instance of OneTimeTaskRunner.
   * @param {IOneTimeTask[]} tasks - List of one-time tasks to be managed.
   */
  constructor(public tasks: IOneTimeTask[]) {
    this.tasks = tasks;
  }

  /**
   * Starts all scheduled one-time tasks and returns a function to stop them.
   * @returns {() => void} Function to stop all scheduled tasks.
   */
  start(): () => void {
    this.tasks.forEach((task) => this.scheduleTask(task));
    return () => this.stopAllTasks();
  }

  /**
   * Adds a new one-time task and schedules it.
   * @param {IOnceTimeTaskCreatePayload} data - The task configuration.
   * @returns {IOneTimeTask} The newly created and scheduled task.
   */
  addTask(data: IOnceTimeTaskCreatePayload): IOneTimeTask {
    const newTask: IOneTimeTask = {
      ...data,
      id: CommonUtils.generateUniqueId(),
      createdAt: Date.now(),
      enabled: data.enabled ?? true,
    };
    this.tasks.push(newTask);
    this.scheduleTask(newTask);
    return newTask;
  }

  /**
   * Removes a specific task by its ID.
   * @param {string} taskId - The unique identifier of the task.
   */
  removeTask(taskId: string): void {
    if (!this.taskTimeouts.has(taskId)) {
      return;
    }

    clearTimeout(this.taskTimeouts.get(taskId)!);
    this.taskTimeouts.delete(taskId);

    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }

  /**
   * Stops all scheduled tasks and clears their timeouts.
   */
  stopAllTasks(): void {
    this.taskTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    this.taskTimeouts.clear();
    this.tasks = [];
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
    this.taskTimeouts.set(task.id, timeoutId);
  }

  private executeTask(task: IOneTimeTask): void {
    if (this.isTaskExpired(task)) {
      this.removeTask(task.id);
      return;
    }

    task.callback();

    this.removeTask(task.id);
  }

  private isTaskScheduled(task: IOneTimeTask): boolean {
    return this.taskTimeouts.has(task.id);
  }

  private isTaskExpired(task: IOneTimeTask): boolean {
    return task.expireAt < Date.now();
  }
}

export default OneTimeTaskRunner;
