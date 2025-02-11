import { IIntervalTask } from '@/interfaces';
import { TaskDatabaseService } from '@/services';

class IntervalTimerManager {
  private intervalTimers: Map<string, number> = new Map(); // Map taskId -> intervalId
  private taskDatabaseService: TaskDatabaseService;

  constructor(taskDatabaseService: TaskDatabaseService) {
    this.taskDatabaseService = taskDatabaseService;
  }

  get timers() {
    return this.intervalTimers;
  }

  startTimer(task: IIntervalTask) {
    const intervalId = window.setInterval(async () => {
      try {
        task.callback();
        await this.taskDatabaseService.updateIntervalTask(task.id, {
          lastRunAt: Date.now(),
          totalRunCount: task.totalRunCount + 1,
        });
      } catch (error) {
        console.error(`❌ Error running task ${task.name}:`, error);
      }
    }, task.interval);

    this.intervalTimers.set(task.id, intervalId);
  }

  stopTimer(taskId: string) {
    const intervalId = this.intervalTimers.get(taskId);
    if (intervalId) {
      clearInterval(intervalId);
      this.intervalTimers.delete(taskId);
      console.log(`🛑 Stopped timer for task: ${taskId}`);
    }
  }

  stopAllTimers() {
    this.intervalTimers.forEach((intervalId, taskId) => {
      clearInterval(intervalId);
      console.log(`🛑 Stopped timer for task: ${taskId}`);
    });
    this.intervalTimers.clear();
  }

  getRunningTimers(): string[] {
    return Array.from(this.intervalTimers.keys());
  }

  isTimerRunning(taskId: string): boolean {
    return this.intervalTimers.has(taskId);
  }
}

export default IntervalTimerManager;
