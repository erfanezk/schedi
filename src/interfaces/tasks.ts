type ICallback = <T>() => void | Promise<T>;

interface ITask {
  id: string;
  name: string;
  createdAt: number;
  callback: ICallback;
  enabled: boolean;
}

interface IOneTimeTask extends ITask {
  expireAt: number;
  startAt: number;
}

interface IOneTimeTaskCreatePayload {
  name: string;
  callback: <T>() => void | Promise<T>;
  startAt: number;
  expireAt: number;
  enabled?: boolean;
}

interface IIntervalTask extends ITask {
  interval: number;
  lastRunAt: number | undefined;
  totalRunCount: number;
  startAt: number;
  expireAt: number;
}

interface ICreateIntervalTaskPayload {
  name: string;
  callback: <T>() => void | Promise<T>;
  interval: number;
  startAt: number;
  expireAt: number;
  enabled?: boolean;
}

export type {
  ITask,
  IIntervalTask,
  ICreateIntervalTaskPayload,
  ICallback,
  IOneTimeTask,
  IOneTimeTaskCreatePayload,
};
