enum TaskType {
  CRON = 'cron',
  PERIODIC = 'periodic',
  INTERVAL = 'interval',
}

interface ITask {
  id: string;
}

interface ICronTask extends ITask {}

interface ITaskDatabase {
  addCronTask(task: Omit<ICronTask, 'id'>): Promise<ICronTask>;

  addPeriodicTask(task: Omit<ITask, 'id'>): Promise<ITask>;

  addIntervalTask(task: Omit<ITask, 'id'>): Promise<ITask>;

  getAllCronTasks(): Promise<ITask[]>;

  getAllPeriodicTasks(): Promise<ITask[]>;

  getAllIntervalTasks(): Promise<ITask[]>;
}

export type { ITask, ITaskDatabase, ICronTask };

export { TaskType };
