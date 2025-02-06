import Dexie from 'dexie';
import { ICronTask, IIntervalTask, IOnceTimeTask, ITaskDatabase } from '@/interfaces';
import { CommonUtils } from '@/utils';

const DB_VERSION = 1;

class TaskDatabase extends Dexie implements ITaskDatabase {
  cronTasks!: Dexie.Table<ICronTask, string>;
  onceTimeTasks!: Dexie.Table<IOnceTimeTask, string>;
  intervalTasks!: Dexie.Table<IIntervalTask, string>;

  constructor() {
    super('TaskSchedulerDB');
    this.version(DB_VERSION).stores({
      cronTasks: 'id, name, createdAt, enabled, dateChanged, schedule, lastRunAt, totalRunCount',
      onceTimeTasks: 'id, name, createdAt, enabled, dateChanged, runAt',
      intervalTasks:
        'id, name, createdAt, enabled, dateChanged, interval, lastRunAt, totalRunCount',
    });

    this.cronTasks = this.table('cronTasks');
    this.onceTimeTasks = this.table('onceTimeTasks');
    this.intervalTasks = this.table('intervalTasks');
  }

  async addCronTask(task: Omit<ICronTask, 'id'>): Promise<ICronTask> {
    const id = await this.cronTasks.add({
      ...task,
      createdAt: new Date().getTime(),
      id: CommonUtils.generateUniqueId(),
    });
    return { id, ...task };
  }

  async addIntervalTask(task: Omit<IIntervalTask, 'id'>): Promise<IIntervalTask> {
    const id = await this.intervalTasks.add({
      ...task,
      createdAt: new Date().getTime(),
      id: CommonUtils.generateUniqueId(),
    });
    return { id, ...task };
  }

  async addOnceTimeTask(task: Omit<IOnceTimeTask, 'id'>): Promise<IOnceTimeTask> {
    const id = await this.onceTimeTasks.add({
      ...task,
      createdAt: new Date().getTime(),
      id: CommonUtils.generateUniqueId(),
    });
    return { id, ...task };
  }

  async getAllCronTasks(): Promise<ICronTask[]> {
    return this.cronTasks.toArray();
  }

  async getAllIntervalTasks(): Promise<IIntervalTask[]> {
    return this.intervalTasks.toArray();
  }

  async getAllOnceTimeTasks(): Promise<IOnceTimeTask[]> {
    return this.onceTimeTasks.toArray();
  }

  async getCronTaskById(id: string): Promise<ICronTask | undefined> {
    return this.cronTasks.get(id);
  }

  async getIntervalTaskById(id: string): Promise<IIntervalTask | undefined> {
    return this.intervalTasks.get(id);
  }

  async getOnceTimeTaskById(id: string): Promise<IOnceTimeTask | undefined> {
    return this.onceTimeTasks.get(id);
  }

  async updateCronTask(id: string, updates: Partial<ICronTask>): Promise<void> {
    await this.cronTasks.update(id, updates);
  }

  async updateIntervalTask(id: string, updates: Partial<IIntervalTask>): Promise<void> {
    await this.intervalTasks.update(id, updates);
  }

  async updateOnceTimeTask(id: string, updates: Partial<IOnceTimeTask>): Promise<void> {
    await this.onceTimeTasks.update(id, updates);
  }

  async deleteCronTask(id: string): Promise<void> {
    await this.cronTasks.delete(id);
  }

  async deleteIntervalTask(id: string): Promise<void> {
    await this.intervalTasks.delete(id);
  }

  async deleteOnceTimeTask(id: string): Promise<void> {
    await this.onceTimeTasks.delete(id);
  }
}

export const taskDatabase = new TaskDatabase();
