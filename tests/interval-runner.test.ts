import { IntervalTaskRunner } from '@/runners';
import { TaskDatabaseService } from '@/services';
import { secondsToMilliseconds, wait } from './utils';

const databaseService = new TaskDatabaseService();

describe('Interval task runner', () => {
  beforeEach(async () => {
    await databaseService.clearAllIntervalTasks();
  });

  it('should create timer for task', async () => {
    // Spy on console.log
    const mockTask1 = {
      name: 'Mock Task 1',
      startAt: Date.now(),
      interval: secondsToMilliseconds(0.5),
      callback: () => {},
      expireAt: Date.now() + secondsToMilliseconds(1000),
    };

    await databaseService.addIntervalTask(mockTask1);
    const intervalTaskRunner = new IntervalTaskRunner(databaseService);
    await intervalTaskRunner.start();

    await wait(600);

    expect(intervalTaskRunner.timers.size).toBe(1);
  });

  it('should remove expired tasks after 3sec', async () => {
    const expiredTask = {
      name: 'Mock Task 1',
      startAt: Date.now(),
      interval: 500,
      callback: () => {},
      expireAt: Date.now() - 1000,
    };

    const intervalTaskRunner = new IntervalTaskRunner(databaseService);
    await databaseService.addIntervalTask(expiredTask);
    await intervalTaskRunner.start();

    expect(intervalTaskRunner.getTasks().length).toBe(1);

    await wait(3100);

    expect(intervalTaskRunner.getTasks().length).toBe(0);
  });

  it('should sync tasks from db to runner', async () => {
    const mock = {
      name: 'Mock Task 1',
      startAt: Date.now(),
      interval: 500,
      callback: () => {},
      expireAt: Date.now() - secondsToMilliseconds(1),
    };
    await databaseService.addIntervalTask(mock);
    await databaseService.addIntervalTask(mock);
    await databaseService.addIntervalTask(mock);

    const intervalTaskRunner = new IntervalTaskRunner(databaseService);
    await intervalTaskRunner.start();

    expect(intervalTaskRunner.getTasks().length).toBe(3);
  });
});
