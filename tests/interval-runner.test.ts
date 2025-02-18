import { IntervalTaskRunner } from '@/index';
import { generateIntervalMockTask, secondsToMilliseconds } from './utils';

describe('Interval task runner', () => {
  const now = new Date();

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(now);
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should start tasks at minimum interval', () => {
    // given
    const task = generateIntervalMockTask();
    const taskRunner = new IntervalTaskRunner([task]);

    // when
    taskRunner.start();
    jest.advanceTimersByTime(1000);

    // then
    expect(task.callback).toHaveBeenCalledTimes(1);
  });

  it('should not run tasks before startAt', () => {
    // given
    const task = generateIntervalMockTask({ startAt: Date.now() + 2000 });
    const taskRunner = new IntervalTaskRunner([task]);

    // when
    taskRunner.start();
    jest.advanceTimersByTime(1000);

    // then
    expect(task.callback).not.toHaveBeenCalled();
  });

  it('should start task after 2 sec', () => {
    // given
    const task = generateIntervalMockTask({ startAt: Date.now() + 2000 });
    const taskRunner = new IntervalTaskRunner([task]);

    // when
    taskRunner.start();
    jest.advanceTimersByTime(4000);

    // then
    expect(task.callback).toHaveBeenCalledTimes(2);
  });

  it('should remove expired tasks', () => {
    // given
    const task = generateIntervalMockTask({ expireAt: Date.now() + secondsToMilliseconds(2) });
    const taskRunner = new IntervalTaskRunner([task]);

    // when
    taskRunner.start();
    jest.advanceTimersByTime(4000);

    // then
    expect(task.callback).toHaveBeenCalledTimes(2);
  });

  it('should stop all tasks', () => {
    // given
    const task = generateIntervalMockTask({ interval: 1000 });
    const taskRunner = new IntervalTaskRunner([task]);

    // when
    taskRunner.start();
    jest.advanceTimersByTime(1000);
    taskRunner.stopAllTasks();
    jest.advanceTimersByTime(1000);

    // then
    expect(task.callback).toHaveBeenCalledTimes(1);
  });

  it('should stop a specific task', () => {
    // given
    const task1 = generateIntervalMockTask({ id: 'task-1' });
    const task2 = generateIntervalMockTask({ id: 'task-2' });
    const taskRunner = new IntervalTaskRunner([task1, task2]);

    // when
    taskRunner.start();
    jest.advanceTimersByTime(1000);
    taskRunner.removeTask('task-1');
    jest.advanceTimersByTime(1000);

    // then
    expect(task1.callback).toHaveBeenCalledTimes(1);
    expect(task2.callback).toHaveBeenCalledTimes(2);
  });

  it('should execute a single task periodically until expiration', () => {
    // given
    const task = generateIntervalMockTask();
    const taskRunner = new IntervalTaskRunner([task]);

    // when
    taskRunner.start();
    jest.advanceTimersByTime(5000);

    // then
    expect(task.callback).toHaveBeenCalledTimes(5);
  });

  it('should handle multiple tasks with different intervals', () => {
    // given
    const task1 = generateIntervalMockTask({ interval: 1000 });
    const task2 = generateIntervalMockTask({ interval: 2000 });
    const taskRunner = new IntervalTaskRunner([task1, task2]);

    // when
    taskRunner.start();
    jest.advanceTimersByTime(5000);

    // then
    expect(task1.callback).toHaveBeenCalledTimes(5);
    expect(task2.callback).toHaveBeenCalledTimes(2);
  });

  it('should handle tasks with intervals greater than expiration time', () => {
    // given
    const task = generateIntervalMockTask({ interval: 6000, expireAt: Date.now() + 5000 });
    const taskRunner = new IntervalTaskRunner([task]);

    // when
    taskRunner.start();
    jest.advanceTimersByTime(6000);

    // then
    expect(task.callback).not.toHaveBeenCalled();
  });

  it('should not run tasks that expire immediately', () => {
    // given
    const task = generateIntervalMockTask({ startAt: Date.now(), expireAt: Date.now() });
    const taskRunner = new IntervalTaskRunner([task]);

    // when
    taskRunner.start();
    jest.advanceTimersByTime(1000);

    // then
    expect(task.callback).not.toHaveBeenCalled();
  });

  it('should not execute tasks already expired', () => {
    // given
    const task = generateIntervalMockTask({ expireAt: Date.now() - 1000 });
    const taskRunner = new IntervalTaskRunner([task]);

    // when
    taskRunner.start();
    jest.advanceTimersByTime(1000);

    // then
    expect(task.callback).not.toHaveBeenCalled();
  });

  it('should not run disabled tasks', () => {
    // given
    const task = generateIntervalMockTask({ enabled: false });
    const taskRunner = new IntervalTaskRunner([task]);

    // when
    taskRunner.start();
    jest.advanceTimersByTime(1000);

    // then
    expect(task.callback).not.toHaveBeenCalled();
  });

  it('should handle tasks with long execution times', () => {
    // given
    const task = generateIntervalMockTask({
      callback: jest.fn(() => jest.advanceTimersByTime(200)), // Simulate long execution
      interval: 1000,
    });
    const taskRunner = new IntervalTaskRunner([task]);

    // when
    taskRunner.start();
    jest.advanceTimersByTime(3000);

    // then
    expect(task.callback).toHaveBeenCalledTimes(3);
  });

  it('should handle tasks with very long intervals', () => {
    // given
    const task = generateIntervalMockTask({
      interval: 60000,
      expireAt: Date.now() + secondsToMilliseconds(130),
    }); // 1-minute interval
    const taskRunner = new IntervalTaskRunner([task]);

    // when
    taskRunner.start();
    jest.advanceTimersByTime(120000); // Advance by 2 minutes

    // then
    expect(task.callback).toHaveBeenCalledTimes(2);
  });

  it('should handle a large number of tasks efficiently', () => {
    // given
    const tasks = Array.from({ length: 100 }, (_, i) =>
      generateIntervalMockTask({ id: `task-${i}`, interval: 1000 + i * 10 }),
    );
    const taskRunner = new IntervalTaskRunner(tasks);

    // when
    taskRunner.start();
    jest.advanceTimersByTime(2000);

    // then
    tasks.forEach((task, i) => {
      const expectedCalls = Math.floor(2000 / (1000 + i * 10));
      expect(task.callback).toHaveBeenCalledTimes(expectedCalls);
    });
  });

  it('should handle overlapping task intervals correctly', () => {
    // given
    const task1 = generateIntervalMockTask({ interval: 1000 });
    const task2 = generateIntervalMockTask({ interval: 500 });
    const taskRunner = new IntervalTaskRunner([task1, task2]);

    // when
    taskRunner.start();
    jest.advanceTimersByTime(2000);

    // then
    expect(task1.callback).toHaveBeenCalledTimes(2); // Every 1000ms
    expect(task2.callback).toHaveBeenCalledTimes(4); // Every 500ms
  });

  it('should handle multiple tasks starting at the same time', () => {
    // given
    const task1 = generateIntervalMockTask({ startAt: Date.now() });
    const task2 = generateIntervalMockTask({ startAt: Date.now() });
    const taskRunner = new IntervalTaskRunner([task1, task2]);

    // when
    taskRunner.start();
    jest.advanceTimersByTime(1000);

    // then
    expect(task1.callback).toHaveBeenCalledTimes(1);
    expect(task2.callback).toHaveBeenCalledTimes(1);
  });

  it('should handle task expiration during execution', () => {
    // given
    const task = generateIntervalMockTask({ expireAt: Date.now() + 1500 });
    const taskRunner = new IntervalTaskRunner([task]);

    // when
    taskRunner.start();
    jest.advanceTimersByTime(1000); // Task runs once
    jest.advanceTimersByTime(1000); // Task should expire

    // then
    expect(task.callback).toHaveBeenCalledTimes(1);
  });

  it('should handle tasks that are started and stopped at the same time', () => {
    // given
    const task = generateIntervalMockTask();
    const taskRunner = new IntervalTaskRunner([task]);

    // when
    taskRunner.start();
    taskRunner.removeTask(task.id);
    jest.advanceTimersByTime(1000);

    // then
    expect(task.callback).not.toHaveBeenCalled();
  });

  it('should not execute a stopped task again', () => {
    // given
    const task = generateIntervalMockTask({ interval: 1000 });
    const taskRunner = new IntervalTaskRunner([task]);

    // when
    taskRunner.start();
    jest.advanceTimersByTime(1000);
    taskRunner.removeTask(task.id);
    jest.advanceTimersByTime(3000);

    // then
    expect(task.callback).toHaveBeenCalledTimes(1);
  });

  it('should schedule tasks far in the future correctly', () => {
    // given
    const task = generateIntervalMockTask({
      startAt: Date.now() + 60000,
      interval: 1000,
    });
    const taskRunner = new IntervalTaskRunner([task]);

    // when
    taskRunner.start();
    jest.advanceTimersByTime(59000);

    // then
    expect(task.callback).not.toHaveBeenCalled();

    // when
    jest.advanceTimersByTime(2000);

    // then
    expect(task.callback).toHaveBeenCalledTimes(1);
  });

  it('should add a new task and schedule it immediately if startAt is in the past', () => {
    // given
    const taskRunner = new IntervalTaskRunner([]);
    const taskPayload = generateIntervalMockTask({ startAt: Date.now() - 1000 });

    // when
    taskRunner.start();
    taskRunner.addTask(taskPayload);
    jest.advanceTimersByTime(1000);

    // then
    expect(taskPayload.callback).toHaveBeenCalledTimes(1);
  });

  it('should add a new task and schedule it correctly if startAt is in the future', () => {
    // given
    const taskRunner = new IntervalTaskRunner([]);
    const taskPayload = generateIntervalMockTask({ startAt: Date.now() + 3000 });

    // when
    taskRunner.start();
    taskRunner.addTask(taskPayload);
    jest.advanceTimersByTime(2000);

    // then
    expect(taskPayload.callback).not.toHaveBeenCalled(); // Task should not execute yet

    // when
    jest.advanceTimersByTime(2000);

    // then
    expect(taskPayload.callback).toHaveBeenCalledTimes(1);
  });

  it('should execute a newly added task at its defined interval', () => {
    // given
    const taskRunner = new IntervalTaskRunner([]);
    const taskPayload = generateIntervalMockTask({ startAt: Date.now(), interval: 2000 });

    // when
    taskRunner.start();
    taskRunner.addTask(taskPayload);
    jest.advanceTimersByTime(2000);

    // then
    expect(taskPayload.callback).toHaveBeenCalledTimes(1);

    // when
    jest.advanceTimersByTime(2000);

    // then
    expect(taskPayload.callback).toHaveBeenCalledTimes(2);
  });

  it('should not execute a new task if it is expired', () => {
    // given
    const taskRunner = new IntervalTaskRunner([]);
    const taskPayload = generateIntervalMockTask({ expireAt: Date.now() - 1000 });

    // when
    taskRunner.addTask(taskPayload);
    jest.advanceTimersByTime(2000);

    // then
    expect(taskPayload.callback).not.toHaveBeenCalled();
  });

  it('should add multiple tasks and execute them correctly', () => {
    // given
    const taskRunner = new IntervalTaskRunner([]);
    const task1 = generateIntervalMockTask({ startAt: Date.now() + 1000 });
    const task2 = generateIntervalMockTask({ startAt: Date.now() + 2000 });

    // when
    taskRunner.start();
    taskRunner.addTask(task1);
    taskRunner.addTask(task2);
    jest.advanceTimersByTime(2000);

    // then
    expect(task1.callback).toHaveBeenCalledTimes(1);
    expect(task2.callback).not.toHaveBeenCalled();

    // when
    jest.advanceTimersByTime(1000);

    // then
    expect(task2.callback).toHaveBeenCalledTimes(1);
  });

  it('should add a task and remove it before execution', () => {
    // given
    const taskRunner = new IntervalTaskRunner([]);
    const task = generateIntervalMockTask({ startAt: Date.now() + 3000 });

    // when
    taskRunner.start();
    const newTask = taskRunner.addTask(task);
    taskRunner.removeTask(newTask.id);
    jest.advanceTimersByTime(4000);

    // then
    expect(task.callback).not.toHaveBeenCalled();
  });
});
