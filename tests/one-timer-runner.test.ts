import { generateOneTimeMockTask } from './utils';
import { OneTimeTaskRunner } from '@/runners';

describe('One time task runner', () => {
  const now = new Date();

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(now);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should execute a time task at the correct time', () => {
    // given
    const task = generateOneTimeMockTask({ startAt: Date.now() + 2000 });
    const taskRunner = new OneTimeTaskRunner([task]);

    // when
    taskRunner.start();
    jest.advanceTimersByTime(2000);

    // then
    expect(task.callback).toHaveBeenCalledTimes(1);
  });

  it('should not execute an expired task', () => {
    // given
    const task = generateOneTimeMockTask({ expireAt: Date.now() - 1000 });
    const taskRunner = new OneTimeTaskRunner([task]);

    // when
    taskRunner.start();
    jest.advanceTimersByTime(1000);

    // then
    expect(task.callback).not.toHaveBeenCalled();
  });

  it('should remove a task after execution', () => {
    // given
    const task = generateOneTimeMockTask({ startAt: Date.now() + 1000 });
    const taskRunner = new OneTimeTaskRunner([task]);

    // when
    taskRunner.start();
    jest.advanceTimersByTime(2000);

    // then
    expect(taskRunner.tasks.length).toBe(0);
  });

  it('should not execute task after removing', () => {
    // given
    const task = generateOneTimeMockTask({ startAt: Date.now() + 2000 });
    const taskRunner = new OneTimeTaskRunner([task]);

    // when
    taskRunner.start();
    taskRunner.removeTask(task.id);
    jest.advanceTimersByTime(3000);

    // then
    expect(task.callback).not.toHaveBeenCalled();
  });

  it('should stop all tasks before execution', () => {
    // given
    const task1 = generateOneTimeMockTask({ startAt: Date.now() + 2000 });
    const task2 = generateOneTimeMockTask({ startAt: Date.now() + 3000 });
    const taskRunner = new OneTimeTaskRunner([task1, task2]);

    // when
    taskRunner.start();
    taskRunner.stopAllTasks();
    jest.advanceTimersByTime(4000);

    // then
    expect(task1.callback).not.toHaveBeenCalled();
    expect(task2.callback).not.toHaveBeenCalled();
  });

  it('should not schedule a disabled task', () => {
    // given
    const task = generateOneTimeMockTask({ enabled: false });
    const taskRunner = new OneTimeTaskRunner([task]);

    // when
    taskRunner.start();
    jest.advanceTimersByTime(1000);

    // then
    expect(task.callback).not.toHaveBeenCalled();
  });

  it('should handle multiple tasks executing at different times', () => {
    // given
    const task1 = generateOneTimeMockTask({ startAt: Date.now() + 1000 });
    const task2 = generateOneTimeMockTask({ startAt: Date.now() + 3000 });
    const taskRunner = new OneTimeTaskRunner([task1, task2]);

    // when
    taskRunner.start();
    jest.advanceTimersByTime(4000);

    // then
    expect(task1.callback).toHaveBeenCalledTimes(1);
    expect(task2.callback).toHaveBeenCalledTimes(1);
  });

  it('should prevent expired tasks from being scheduled', () => {
    // given
    const task = generateOneTimeMockTask({ expireAt: Date.now() - 500 });
    const taskRunner = new OneTimeTaskRunner([task]);

    // when
    taskRunner.start();
    jest.advanceTimersByTime(1000);

    // then
    expect(task.callback).not.toHaveBeenCalled();
  });

  it('should execute task immediately if startAt is in the past', () => {
    // given
    const task = generateOneTimeMockTask({ startAt: Date.now() - 1000 });
    const taskRunner = new OneTimeTaskRunner([task]);

    // when
    taskRunner.start();
    jest.advanceTimersByTime(10);

    // then
    expect(task.callback).toHaveBeenCalledTimes(1);
  });

  it('should handle a large number of tasks efficiently', () => {
    // given
    const tasks = Array.from({ length: 100 }, (_, i) =>
      generateOneTimeMockTask({ id: `task-${i}`, startAt: Date.now() + i * 10 }),
    );
    const taskRunner = new OneTimeTaskRunner(tasks);

    // when
    taskRunner.start();
    jest.advanceTimersByTime(1000);

    // then
    tasks.forEach((task) => {
      expect(task.callback).toHaveBeenCalledTimes(1);
    });
  });

  it('should execute tasks in correct order', () => {
    // given
    const callbackOrder: string[] = [];
    const task1 = generateOneTimeMockTask({
      id: 'task1',
      startAt: Date.now() + 1000,
      callback: () => {
        callbackOrder.push('task1');
      },
    });
    const task2 = generateOneTimeMockTask({
      id: 'task2',
      startAt: Date.now() + 2000,
      callback: () => {
        callbackOrder.push('task2');
      },
    });
    const taskRunner = new OneTimeTaskRunner([task1, task2]);

    // when
    taskRunner.start();
    jest.advanceTimersByTime(3000);

    // then
    expect(callbackOrder).toEqual(['task1', 'task2']);
  });

  it('should execute multiple tasks with same startAt', () => {
    // given
    const task1 = generateOneTimeMockTask({ startAt: Date.now() + 2000 });
    const task2 = generateOneTimeMockTask({ startAt: Date.now() + 2000 });
    const taskRunner = new OneTimeTaskRunner([task1, task2]);

    // when
    taskRunner.start();
    jest.advanceTimersByTime(2000);

    // then
    expect(task1.callback).toHaveBeenCalledTimes(1);
    expect(task2.callback).toHaveBeenCalledTimes(1);
  });
});
