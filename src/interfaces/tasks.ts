type ICallback = <T>() => void | Promise<T>;

interface ITask {
  id: string;
  name: string;
  createdAt: number;
  callback: ICallback;
  enabled?: boolean;
}

interface IOneTimeTask extends ITask {
  expireAt: number;
  startAt: number;
}

interface IIntervalTask extends ITask {
  interval: number;
  lastRunAt: number | undefined;
  totalRunCount: number;
  startAt: number;
  expireAt: number;
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
