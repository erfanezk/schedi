import taskService from '@/services/tasks';
import { liveQuery } from 'dexie';
import { IIntervalTask } from '@/interfaces';

class IntervalTaskRunner {
  private intervalTasks: IIntervalTask[] = [];
  private intervalTimers: Map<string, number> = new Map(); // Store setInterval references

  start() {
    console.log('🔍 Listening for changes in IndexedDB...');

    liveQuery(async () => {
      console.log('🔄 Checking for new interval tasks...');
      this.intervalTasks = (await taskService.getAllIntervalTasks()) ?? [];
      this.syncIntervalTasks();
    }).subscribe({
      next: () => console.log('✅ Listening for IndexedDB changes...'),
      error: (err) => console.error('❌ Error listening to IndexedDB:', err),
    });
  }

  stopAllTasks() {
    console.log('🛑 Stopping all interval tasks...');
    this.intervalTimers.forEach((timerId, taskId) => {
      clearInterval(timerId);
      console.log(`🛑 Stopped interval task: ${taskId}`);
    });
    this.intervalTimers.clear();
  }

  private syncIntervalTasks() {
    const currentTaskIds = new Set(this.intervalTasks.map((task) => task.id));

    // Stop tasks that are no longer in IndexedDB
    this.intervalTimers.forEach((timerId, taskId) => {
      if (!currentTaskIds.has(taskId)) {
        clearInterval(timerId);
        this.intervalTimers.delete(taskId);
        console.log(`🛑 Stopped removed interval task: ${taskId}`);
      }
    });

    this.runIntervalTasks();
  }

  private runIntervalTasks() {
    this.intervalTasks.forEach((task) => {
      if (this.intervalTimers.has(task.id)) {
        return; // Task is already running
      }

      console.log(`⏲️ Scheduling interval task: ${task.name} (Runs every ${task.interval} ms)`);

      const timerId = window.setInterval(async () => {
        try {
          console.log(`▶️ Running interval task: ${task.name}`);

          task.callback();

          await taskService.updateIntervalTask(task.id, {
            lastRunAt: new Date().getTime(),
            totalRunCount: task.totalRunCount + 1,
          });

          console.log(`✅ Interval task completed: ${task.name}`);
        } catch (error) {
          console.error(`❌ Error executing interval task ${task.name}:`, error);
        }
      }, task.interval);

      // Store interval reference
      this.intervalTimers.set(task.id, timerId);
    });
  }
}

export const intervalTaskRunner = new IntervalTaskRunner();
