import { IIntervalTask } from '@/interfaces';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function secondsToMilliseconds(seconds: number) {
  return seconds * 1000;
}

const generateMockTask = (overrides: Partial<IIntervalTask> = {}): IIntervalTask => ({
  id: `task-${Math.random()}`,
  interval: 1000,
  startAt: Date.now(),
  expireAt: Date.now() + secondsToMilliseconds(100),
  callback: jest.fn(),
  name: 'task',
  createdAt: Date.now(),
  totalRunCount: 0,
  lastRunAt: undefined,
  enabled: true,
  ...overrides,
});

export { wait, secondsToMilliseconds, generateMockTask };
