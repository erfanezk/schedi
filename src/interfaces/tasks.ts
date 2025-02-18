type ICallback = <T>() => void | Promise<T>;

interface ITask {
  id: string;
  name: string;
  createdAt: number;
  callback: ICallback;
  expireAt: number;
  startAt: number;

  enabled?: boolean;
}

type IOneTimeTask = ITask;

interface IIntervalTask extends ITask {
  interval: number;
  lastRunAt: number | undefined;
  totalRunCount: number;
}

type ICreateIntervalTaskPayload = Omit<
  IIntervalTask,
  'createdAt' | 'id' | 'totalRunCount' | 'lastRunAt'
>;

type IOneTimeTaskCreatePayload = Omit<IOneTimeTask, 'createdAt' | 'id'>;

export type {
  ITask,
  IIntervalTask,
  ICreateIntervalTaskPayload,
  IOneTimeTask,
  IOneTimeTaskCreatePayload,
};
