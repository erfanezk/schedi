import IntervalTimerManager from '@/runners/interval/timer-manager';
import { TaskDatabaseService } from '@/services';
import { IIntervalTask } from '@/interfaces';
import { liveQuery } from 'dexie';

class IntervalTaskRunner {
  private timerManager: IntervalTimerManager;

  private intervalTasks: IIntervalTask[] = [];
  private periodicCheckTimer: number | null = null;
  private intervalChecker: number;

  constructor(private taskDatabaseService: TaskDatabaseService) {
    this.timerManager = new IntervalTimerManager(taskDatabaseService);
    this.intervalChecker = 1000;
  }

  get timers() {
    return this.timerManager.timers;
  }

  static isTaskReadyToStart(task: IIntervalTask): boolean {
    return !task.startAt || task.startAt <= Date.now();
  }

  static isTaskExpired(task: IIntervalTask): boolean {
    return task.expireAt <= Date.now();
  }

  async start() {
    try {
      await this.syncTasksFromDB();
      this.listenToTaskChanges();
      this.startPeriodicCheck();
    } catch (error) {
      console.error('❌ IntervalTaskRunner failed to start:', error);
    }
  }

  stopAllTasks() {
    this.timerManager.stopAllTimers();
    if (this.periodicCheckTimer) {
      clearInterval(this.periodicCheckTimer);
      this.periodicCheckTimer = null;
    }
  }

  getTasks(): IIntervalTask[] {
    return this.intervalTasks;
  }

  async deleteExpiredTask(taskId: string) {
    try {
      this.intervalTasks = this.intervalTasks.filter((task) => task.id !== taskId);
      await this.taskDatabaseService.deleteIntervalTask(taskId);
      this.updateIntervalChecker();
    } catch (error) {
      console.error(`❌ Error deleting task ${taskId}:`, error);
    }
  }

  private listenToTaskChanges() {
    liveQuery(() => this.taskDatabaseService.getAllIntervalTasks()).subscribe({
      next: (tasks) => {
        this.intervalTasks = tasks ?? [];
        this.syncTasks();
        this.updateIntervalChecker();
      },
      error: (err) => console.error('❌ Error listening to task changes:', err),
    });
  }

  private async syncTasksFromDB() {
    try {
      this.intervalTasks = (await this.taskDatabaseService.getAllIntervalTasks()) ?? [];
      this.syncTasks();
      this.updateIntervalChecker();
    } catch (error) {
      console.error('❌ Error syncing tasks from database:', error);
    }
  }

  private startPeriodicCheck() {
    if (this.periodicCheckTimer) {
      return;
    } // Prevent multiple intervals

    this.periodicCheckTimer = window.setInterval(async () => {
      for (const task of this.intervalTasks) {
        if (IntervalTaskRunner.isTaskExpired(task)) {
          console.log('expired', task);
          this.timerManager.stopTimer(task.id);

          this.deleteExpiredTask(task.id);
        } else if (
          IntervalTaskRunner.isTaskReadyToStart(task) &&
          !this.timerManager.isTimerRunning(task.id)
        ) {
          this.timerManager.startTimer(task);
        }
      }
    }, this.intervalChecker);
  }

  private syncTasks() {
    const runningTimers = this.timerManager.getRunningTimers();

    for (const taskId of runningTimers) {
      if (!this.intervalTasks.some((task) => task.id === taskId)) {
        this.timerManager.stopTimer(taskId);
      }
    }

    for (const task of this.intervalTasks) {
      if (
        IntervalTaskRunner.isTaskReadyToStart(task) &&
        !this.timerManager.isTimerRunning(task.id)
      ) {
        this.timerManager.startTimer(task);
      }
    }
  }

  private updateIntervalChecker() {
    const intervals = this.intervalTasks
      .map((task) => task.interval)
      .filter((interval) => interval != null);

    if (intervals.length > 0) {
      this.intervalChecker = Math.min(...intervals);
      this.restartPeriodicCheck();
    }
  }

  private restartPeriodicCheck() {
    if (this.periodicCheckTimer) {
      clearInterval(this.periodicCheckTimer);
      this.periodicCheckTimer = null;
    }

    this.startPeriodicCheck();
  }
}

export default IntervalTaskRunner;
