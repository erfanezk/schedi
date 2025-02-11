enum TaskType {
  CRON = 'cron',
  ONCE_TIME = 'onceTime',
  INTERVAL = 'interval',
}

type ICallback = <T>() => void | Promise<T>;

interface ITask {
  id: string;
  name: string;
  createdAt: number;
  type: TaskType;
  callback: ICallback;
}

interface ICronTask extends ITask {
  schedule: string;
  lastRunAt: number;
  totalRunCount: number;
  type: TaskType.CRON;
}

interface IOnceTimeTask extends ITask {
  runAt: number;
  type: TaskType.ONCE_TIME;
}

interface IIntervalTask extends ITask {
  interval: number;
  lastRunAt: number | undefined;
  totalRunCount: number;
  type: TaskType.INTERVAL;
  startAt: number;
  expireAt: number;
}

interface IIntervalTaskInDB extends Omit<IIntervalTask, 'callback'> {
  callback: string;
}

interface ICreateIntervalTaskPayload {
  name: string;
  callback: <T>() => void | Promise<T>;
  interval: number;
  startAt: number;
  expireAt: number;
}

interface ITaskDatabase {
  addCronTask(task: Omit<ICronTask, 'id'>): Promise<ICronTask | undefined>;

  addOnceTimeTask(task: Omit<IOnceTimeTask, 'id'>): Promise<IOnceTimeTask | undefined>;

  addIntervalTask(task: Omit<IIntervalTask, 'id'>): Promise<IIntervalTask | undefined>;

  getAllCronTasks(): Promise<ICronTask[] | undefined>;

  getAllOnceTimeTasks(): Promise<IOnceTimeTask[] | undefined>;

  getAllIntervalTasks(): Promise<IIntervalTask[] | undefined>;

  getCronTaskById(id: string): Promise<ICronTask | undefined>;

  getOnceTimeTaskById(id: string): Promise<IOnceTimeTask | undefined>;

  getIntervalTaskById(id: string): Promise<IIntervalTask | undefined>;

  updateCronTask(id: string, updates: Partial<ICronTask>): Promise<void>;

  updateOnceTimeTask(id: string, updates: Partial<IOnceTimeTask>): Promise<void>;

  updateIntervalTask(id: string, updates: Partial<IIntervalTask>): Promise<void>;

  deleteCronTask(id: string): Promise<void>;

  deleteOnceTimeTask(id: string): Promise<void>;

  deleteIntervalTask(id: string): Promise<void>;

  clearAllIntervalTasks(): Promise<void>;
}

export type {
  ITask,
  ITaskDatabase,
  ICronTask,
  IIntervalTask,
  IOnceTimeTask,
  ICreateIntervalTaskPayload,
  IIntervalTaskInDB,
  ICallback,
};

export { TaskType };
