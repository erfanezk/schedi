import Dexie from 'dexie';
import {
  ICreateIntervalTaskPayload,
  IIntervalTask,
  IIntervalTaskInDB,
  ITaskDatabase,
} from '@/interfaces';
import { CommonUtils } from '@/utils';
import functionSerializer from '@/utils/function';

const DB_VERSION = 1;

class TaskDatabase extends Dexie implements ITaskDatabase {
  intervalTasks!: Dexie.Table<IIntervalTaskInDB, string>;

  constructor() {
    super('TaskSchedulerDB');
    this.version(DB_VERSION).stores({
      intervalTasks:
        'id, name, createdAt, change, type, callback, interval, lastRunAt, totalRunCount, startAt, expireAt',
    });

    this.intervalTasks = this.table('intervalTasks');
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
      enabled: false,
    };
    await this.intervalTasks.add({
      ...task,
    });

    return { ...task, callback: payload.callback };
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

  async updateIntervalTask(id: string, updates: Partial<IIntervalTask>): Promise<void> {
    await this.intervalTasks.update(id, {
      ...updates,
      callback: updates.callback
        ? functionSerializer.functionToString(updates.callback)
        : undefined,
    });
  }

  async deleteIntervalTask(id: string): Promise<void> {
    await this.intervalTasks.delete(id);
  }

  async clearAllIntervalTasks(): Promise<void> {
    await this.intervalTasks.clear();
  }
}

export default TaskDatabase;
