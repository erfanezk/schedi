import { IIntervalTaskCreatePayload, IOneTimeTask, IOneTimeTaskCreatePayload } from '@/interfaces';
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
   * Stops all scheduled tasks and clears their timeouts.
   */
  stopAllTasks(): void {
    this.timers.forEach((timeoutId) => clearTimeout(timeoutId));
    this.timers.clear();
    this._tasks = [];
  }

  /**
   * Updates a task in the task list by its ID.
   * If the task with the provided ID is found, it will merge the existing task data with the new `data` object.
   * The updated task is returned. If the task is not found, `undefined` is returned.
   *
   * @param {string} id - The ID of the task to update.
   * @param {Partial<IOneTimeTaskCreatePayload>} data - The data to update the task with. It can be a partial object of the task's payload.
   *
   * @returns {IOneTimeTask | undefined} The updated task if found and updated, otherwise `undefined` if no task was found with the provided ID.
   */
  updateTask(id: string, data: Partial<IIntervalTaskCreatePayload>): IOneTimeTask | undefined {
    const updatedTask = super.updateTask(id, data);

    if (updatedTask) {
      this.scheduleTask(updatedTask);
    }

    return updatedTask;
  }

  private scheduleTask(task: IOneTimeTask): void {
    if (!this.canScheduleTask(task)) {
      return;
    }

    const delay = Math.max(0, task.startAt - Date.now());
    const timeout = setTimeout(() => this.executeTask(task), delay);

    this.timers.set(task.id, timeout);
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
