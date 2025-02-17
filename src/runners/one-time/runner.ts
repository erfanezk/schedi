import { IOneTimeTask } from '@/interfaces';

class OneTimeTaskRunner {
  private taskTimeouts: Map<string, number> = new Map(); //taskId timeoutId

  constructor(public tasks: IOneTimeTask[]) {
    this.tasks = tasks;
  }

  start(): () => void {
    this.tasks.forEach((task) => this.scheduleTask(task));
    return () => this.stopAllTasks();
  }

  removeTask(taskId: string): void {
    if (!this.taskTimeouts.has(taskId)) {
      return;
    }

    clearTimeout(this.taskTimeouts.get(taskId)!);
    this.taskTimeouts.delete(taskId);

    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }

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
