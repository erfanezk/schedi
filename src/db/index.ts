import Dexie from 'dexie';
import { ICronTask, ITask, ITaskDatabase } from '@/interfaces';

const DB_VERSION = 1;

class TaskDatabase extends Dexie implements ITaskDatabase {
  cronTasks!: Dexie.Table<ICronTask, number>;
  periodicTasks!: Dexie.Table<ITask, number>;
  intervalTasks!: Dexie.Table<ITask, number>;

  constructor() {
    super('TaskSchedulerDB');
    this.version(DB_VERSION).stores({
      cronTasks: '++id, name, schedule, createdAt, status',
      periodicTasks: '++id, name, schedule, createdAt, status',
      intervalTasks: '++id, name, schedule, createdAt, status',
    });

    this.cronTasks = this.table('cronTasks');
    this.periodicTasks = this.table('periodicTasks');
    this.intervalTasks = this.table('intervalTasks');
  }

  addCronTask(task: Omit<ICronTask, 'id'>): Promise<ICronTask> {
    return new Promise((resolve) => {
      resolve({ id: '1', ...task });
    });
  }
}

export default TaskDatabase;
