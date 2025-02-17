import { IIntervalTask } from '@/interfaces';

class IntervalTaskRunner {
  private taskIntervals: Map<string, number> = new Map(); // Stores active intervals

  constructor(private tasks: IIntervalTask[]) {
    this.tasks = tasks;
  }

  start(): () => void {
    this.tasks.forEach((task) => this.scheduleTask(task));
    return () => this.stopAllTasks();
  }

  stopTask(taskId: string): void {
    if (!this.taskIntervals.has(taskId)) {
      return;
    }

    clearInterval(this.taskIntervals.get(taskId)!);
    this.taskIntervals.delete(taskId);

    const task = this.getTaskById(taskId);
    if (task) {
      task.enabled = false;
    }
  }

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

  private getTaskById(taskId: string): IIntervalTask | undefined {
    return this.tasks.find((task) => task.id === taskId);
  }

  private removeTask(taskId: string): void {
    this.stopTask(taskId);
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }

  private isTaskExpired(task: IIntervalTask): boolean {
    return task.expireAt < Date.now();
  }
}

export default IntervalTaskRunner;
