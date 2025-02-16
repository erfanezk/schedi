import { ICreateIntervalTaskPayload, IIntervalTask } from '@/interfaces';
import { CommonUtils } from '@/utils';

class IntervalTaskRunner {
  tasks: IIntervalTask[];
  private taskTimeouts: Map<string, number> = new Map(); // Map taskId -> timeoutId

  constructor(tasks: IIntervalTask[]) {
    this.tasks = tasks;
  }

  start(): () => void {
    this.tasks.forEach((task) => {
      this.tryScheduleTask(task);
    });

    return () => this.stopAllTasks();
  }

  stopAllTasks(): void {
    this.taskTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    this.taskTimeouts.clear();
  }

  addTask(_task: ICreateIntervalTaskPayload) {
    const creationTime = Date.now();
    const task: IIntervalTask = {
      ..._task,
      callback: _task.callback,
      id: CommonUtils.generateUniqueId(),
      createdAt: creationTime,
      lastRunAt: undefined,
      totalRunCount: 0,
      enabled: _task.enabled ?? true,
    };

    this.tasks.push(task);
    this.tryScheduleTask(task);
  }

  stopTask(taskId: string): void {
    const timeoutId = this.taskTimeouts.get(taskId);
    const task = this.tasks.find((task) => task.id === taskId);
    if (timeoutId !== undefined && task) {
      clearTimeout(timeoutId);
      this.taskTimeouts.delete(taskId);
      task.enabled = false;
    }
  }

  private tryScheduleTask(task: IIntervalTask): void {
    if (!this.isTaskExpired(task) && task.enabled) {
      this.scheduleTask(task);
    }
  }

  private scheduleTask(task: IIntervalTask): void {
    const timeout = task.startAt > Date.now() ? task.startAt - Date.now() : task.interval;

    const timeoutId = window.setTimeout(() => {
      if (this.isTaskExpired(task)) {
        this.removeTask(task.id);
        return;
      }

      task.callback();
      task.lastRunAt = Date.now();
      task.totalRunCount += 1;
      this.scheduleTask(task);
    }, timeout);

    this.taskTimeouts.set(task.id, timeoutId);
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
