import { IIntervalTask, IOneTimeTask } from '@/interfaces';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function secondsToMilliseconds(seconds: number) {
  return seconds * 1000;
}

const generateIntervalMockTask = (overrides: Partial<IIntervalTask> = {}): IIntervalTask => ({
  id: `task-${Math.random()}`,
  interval: 1000,
  startAt: Date.now(),
  expireAt: Infinity,
  callback: jest.fn(),
  name: 'task',
  createdAt: Date.now(),
  totalRunCount: 0,
  lastRunAt: undefined,
  enabled: true,
  ...overrides,
});

const generateOneTimeMockTask = (overrides: Partial<IOneTimeTask> = {}): IOneTimeTask => ({
  id: `task-${Math.random()}`,
  startAt: Date.now(),
  expireAt: Infinity,
  callback: jest.fn(),
  name: 'task',
  createdAt: Date.now(),
  enabled: true,
  ...overrides,
});

export { wait, secondsToMilliseconds, generateOneTimeMockTask, generateIntervalMockTask };
