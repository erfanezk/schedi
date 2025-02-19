type ICallback = <T>() => void | Promise<T>;
type IEnabled = (() => boolean) | boolean;

interface ITask {
  id: string;
  name: string;
  createdAt: number;
  callback: ICallback;
  startAt: number;

  expireAt: number;
  enabled: IEnabled;
}

type IOneTimeTask = ITask;

interface IIntervalTask extends ITask {
  interval: number;
  lastRunAt: number | undefined;
  totalRunCount: number;
}

interface ICreateIntervalTaskPayload
  extends Omit<
    IIntervalTask,
    'createdAt' | 'id' | 'totalRunCount' | 'lastRunAt' | 'enabled' | 'expireAt'
  > {
  enabled?: IEnabled;
  expireAt?: number;
}

interface IOneTimeTaskCreatePayload
  extends Omit<IOneTimeTask, 'createdAt' | 'id' | 'enabled' | 'expireAt'> {
  enabled?: IEnabled;
  expireAt?: number;
}

export type {
  ITask,
  IIntervalTask,
  ICreateIntervalTaskPayload,
  IOneTimeTask,
  IOneTimeTaskCreatePayload,
};
