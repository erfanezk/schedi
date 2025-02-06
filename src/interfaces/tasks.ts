enum TaskType {
  CRON = 'cron',
  PERIODIC = 'periodic',
  INTERVAL = 'interval',
}

interface ITask {
  id: string;
  name: string;
  createdAt: number;
  enabled: boolean;
  dateChanged: number;
}

interface ICronTask extends ITask {
  schedule: string;
  lastRunAt: number;
  totalRunCount: number;
}

interface IOnceTimeTask extends ITask {
  runAt: number;
}

interface IIntervalTask extends ITask {
  interval: number;
  lastRunAt: number;
  totalRunCount: number;
}

interface ITaskDatabase {
  addCronTask(task: Omit<ICronTask, 'id'>): Promise<ICronTask>;

  addOnceTimeTask(task: Omit<IOnceTimeTask, 'id'>): Promise<IOnceTimeTask>;

  addIntervalTask(task: Omit<IIntervalTask, 'id'>): Promise<IIntervalTask>;

  getAllCronTasks(): Promise<ICronTask[]>;

  getAllOnceTimeTasks(): Promise<IOnceTimeTask[]>;

  getAllIntervalTasks(): Promise<IIntervalTask[]>;

  getCronTaskById(id: string): Promise<ICronTask | undefined>;

  getOnceTimeTaskById(id: string): Promise<IOnceTimeTask | undefined>;

  getIntervalTaskById(id: string): Promise<IIntervalTask | undefined>;

  updateCronTask(id: string, updates: Partial<ICronTask>): Promise<void>;

  updateOnceTimeTask(id: string, updates: Partial<IOnceTimeTask>): Promise<void>;

  updateIntervalTask(id: string, updates: Partial<IIntervalTask>): Promise<void>;

  deleteCronTask(id: string): Promise<void>;

  deleteOnceTimeTask(id: string): Promise<void>;

  deleteIntervalTask(id: string): Promise<void>;
}

export type { ITask, ITaskDatabase, ICronTask, IIntervalTask, IOnceTimeTask };

export { TaskType };
