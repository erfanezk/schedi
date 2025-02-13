import { IntervalTaskRunner } from '@/runners';
import { TaskDatabaseService } from '@/services';
import { TaskDatabase } from '@/db';
import { ICreateIntervalTaskPayload } from '@/interfaces';
import { secondsToMilliseconds } from './utils';

describe('Interval task runner', () => {
  let taskDatabase: TaskDatabase;
  let taskDatabaseService: TaskDatabaseService;
  let intervalTaskRunner: IntervalTaskRunner;

  beforeEach(() => {
    jest.useFakeTimers({
      legacyFakeTimers: true,
    });

    taskDatabase = new TaskDatabase();
    taskDatabaseService = new TaskDatabaseService(taskDatabase);
    intervalTaskRunner = new IntervalTaskRunner(taskDatabaseService);
  });

  afterEach(async () => {
    jest.useRealTimers();

    await taskDatabase.clearAllIntervalTasks();
  });

  it('should sync tasks from the database on start', async () => {
    const mockTask: ICreateIntervalTaskPayload = {
      startAt: Date.now(),
      interval: 1000,
      callback: () => {},
      expireAt: Date.now() - 1000,
      name: 'task-1',
    };

    await taskDatabase.addIntervalTask(mockTask);
    await intervalTaskRunner.start();

    expect(intervalTaskRunner.tasks.length).toBe(1);
    expect(intervalTaskRunner.timers.size).toBe(1);
  });

  it('should delete expired task', async () => {
    const mockTask: ICreateIntervalTaskPayload = {
      startAt: Date.now(),
      interval: 1000,
      callback: () => {},
      expireAt: Date.now() - 1000,
      name: 'task-1',
    };

    await taskDatabase.addIntervalTask(mockTask);
    await intervalTaskRunner.start();
    jest.advanceTimersByTime(1100);
    const tasks = await taskDatabaseService.getAllIntervalTasks();

    expect(tasks?.length).toBe(0);
  });

  it('should run task once when adding to db', async () => {
    const mockCallback = jest.fn();
    const mockTask: ICreateIntervalTaskPayload = {
      startAt: Date.now(),
      interval: 500,
      callback: () => {
        console.log('444');
      },
      expireAt: Date.now() + secondsToMilliseconds(10),
      name: 'task-1',
    };

    await taskDatabase.addIntervalTask(mockTask);
    await intervalTaskRunner.start();
    const tasks = intervalTaskRunner.tasks;
    tasks[0].callback = mockCallback;

    jest.advanceTimersByTime(2000);

    expect(mockCallback).toHaveBeenCalled();
  });
});
