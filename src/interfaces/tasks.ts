enum TaskType {
  INTERVAL = 'interval',
}

type ICallback = <T>() => void | Promise<T>;

interface ITask {
  id: string;
  name: string;
  createdAt: number;
  callback: ICallback;
  enabled: boolean;
}

interface IIntervalTask extends ITask {
  interval: number;
  lastRunAt: number | undefined;
  totalRunCount: number;
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
  enabled?: boolean;
}

interface ITaskDatabase {
  addIntervalTask(task: Omit<IIntervalTask, 'id'>): Promise<IIntervalTask | undefined>;

  getAllIntervalTasks(): Promise<IIntervalTask[] | undefined>;

  getIntervalTaskById(id: string): Promise<IIntervalTask | undefined>;

  updateIntervalTask(id: string, updates: Partial<IIntervalTask>): Promise<void>;

  deleteIntervalTask(id: string): Promise<void>;

  clearAllIntervalTasks(): Promise<void>;
}

export type {
  ITask,
  ITaskDatabase,
  IIntervalTask,
  ICreateIntervalTaskPayload,
  IIntervalTaskInDB,
  ICallback,
};

export { TaskType };
