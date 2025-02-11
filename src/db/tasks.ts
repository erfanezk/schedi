import Dexie from 'dexie';
import {
  ICreateIntervalTaskPayload,
  ICronTask,
  IIntervalTask,
  IIntervalTaskInDB,
  IOnceTimeTask,
  ITaskDatabase,
  TaskType,
} from '@/interfaces';
import { CommonUtils } from '@/utils';
import functionSerializer from '@/utils/function';

const DB_VERSION = 1;

class TaskDatabase extends Dexie implements ITaskDatabase {
  cronTasks!: Dexie.Table<ICronTask, string>;
  onceTimeTasks!: Dexie.Table<IOnceTimeTask, string>;
  intervalTasks!: Dexie.Table<IIntervalTaskInDB, string>;

  constructor() {
    super('TaskSchedulerDB');
    this.version(DB_VERSION).stores({
      cronTasks: 'id, name, createdAt, change, type, callback',
      onceTimeTasks: 'id, name, createdAt, change, type, callback, runAt',
      intervalTasks:
        'id, name, createdAt, change, type, callback, interval, lastRunAt, totalRunCount, startAt, expireAt',
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

  async addIntervalTask(payload: ICreateIntervalTaskPayload): Promise<IIntervalTask> {
    const creationTime = new Date().getTime();
    const task: IIntervalTaskInDB = {
      ...payload,
      callback: functionSerializer.functionToString(payload.callback),
      id: CommonUtils.generateUniqueId(),
      createdAt: creationTime,
      lastRunAt: undefined,
      totalRunCount: 0,
      type: TaskType.INTERVAL,
    };
    await this.intervalTasks.add({
      ...task,
    });

    return { ...task, callback: payload.callback };
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

  async getAllIntervalTasks(): Promise<IIntervalTask[] | undefined> {
    const intervals = await this.intervalTasks.toArray();
    if (intervals) {
      return intervals.map((interval) => ({
        ...interval,
        callback: functionSerializer.stringToFunction(interval.callback),
      }));
    }
    return undefined;
  }

  async getAllOnceTimeTasks(): Promise<IOnceTimeTask[]> {
    return this.onceTimeTasks.toArray();
  }

  async getCronTaskById(id: string): Promise<ICronTask | undefined> {
    return this.cronTasks.get(id);
  }

  async getIntervalTaskById(id: string): Promise<IIntervalTask | undefined> {
    const res = await this.intervalTasks.get(id);

    if (res) {
      return {
        ...res,
        callback: functionSerializer.stringToFunction(res.callback),
      };
    }
    return undefined;
  }

  async getOnceTimeTaskById(id: string): Promise<IOnceTimeTask | undefined> {
    return this.onceTimeTasks.get(id);
  }

  async updateCronTask(id: string, updates: Partial<ICronTask>): Promise<void> {
    await this.cronTasks.update(id, updates);
  }

  async updateIntervalTask(id: string, updates: Partial<IIntervalTask>): Promise<void> {
    await this.intervalTasks.update(id, {
      ...updates,
      callback: updates.callback
        ? functionSerializer.functionToString(updates.callback)
        : undefined,
    });
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

  async clearAllIntervalTasks(): Promise<void> {
    await this.intervalTasks.clear();
  }
}

export default TaskDatabase;
