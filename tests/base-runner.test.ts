import BaseRunner from '@/runners/base/runner';
import { ITask } from '@/interfaces';

describe('BaseRunner', () => {
  let mockTask: ITask;
  let runner: BaseRunner<ITask>;

  beforeEach(() => {
    jest.useFakeTimers();
    mockTask = {
      name: 'mock',
      id: '1',
      startAt: Date.now(),
      enabled: true,
      expireAt: Infinity,
      callback: jest.fn(),
      createdAt: Date.now(),
    };
    runner = new BaseRunner<ITask>([mockTask]);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('Initialization', () => {
    it('should initialize with given tasks', () => {
      expect(runner['_tasks']).toEqual([mockTask]);
    });
  });

  describe('Task Removal', () => {
    it('should remove a task by ID', () => {
      runner.removeTask(mockTask.id);

      expect(runner['_tasks']).toHaveLength(0);
    });

    it('should clear timer when removing a task', () => {
      runner['timers'].set(
        mockTask.id,
        setTimeout(() => {}, 1000),
      );
      runner.removeTask(mockTask.id);

      expect(runner['timers'].has(mockTask.id)).toBe(false);
    });
  });

  describe('Task Update', () => {
    it('should update a task by ID', () => {
      const updatedTask = runner.updateTask(mockTask.id, { name: 'updated' });

      expect(updatedTask?.name).toBe('updated');
    });

    it('should not update a non-existing task', () => {
      const updatedTask = runner.updateTask('non-existing-id', { name: 'updated' });

      expect(updatedTask).toBeUndefined();
    });
  });

  describe('Task Scheduling', () => {
    it('should not schedule expired tasks', () => {
      const expiredTask = { ...mockTask, expireAt: Date.now() - 1000 };
      runner = new BaseRunner<ITask>([expiredTask]);

      expect(runner['canScheduleTask'](expiredTask)).toBe(false);
    });

    it('should not schedule disabled tasks', () => {
      const disabledTask = { ...mockTask, enabled: false };
      runner = new BaseRunner<ITask>([disabledTask]);

      expect(runner['canScheduleTask'](disabledTask)).toBe(false);
    });

    it('should schedule tasks that are enabled and not expired', () => {
      expect(runner['canScheduleTask'](mockTask)).toBe(true);
    });
  });

  describe('Task Timer Management', () => {
    it('should clear task timer', () => {
      runner['timers'].set(
        mockTask.id,
        setTimeout(() => {}, 1000),
      );
      runner['clearTaskTimer'](mockTask.id);

      expect(runner['timers'].has(mockTask.id)).toBe(false);
    });

    it('should check if a task is scheduled', () => {
      runner['timers'].set(
        mockTask.id,
        setTimeout(() => {}, 1000),
      );

      expect(runner['isTaskScheduled'](mockTask.id)).toBe(true);
    });
  });

  describe('Task Properties', () => {
    it('should check if a task is enabled', () => {
      expect(runner['isTaskEnabled'](mockTask)).toBe(true);
    });

    it('should check if a task is for the future', () => {
      const futureTask = { ...mockTask, startAt: Date.now() + 1000 };
      expect(runner['isTaskForFuture'](futureTask)).toBe(true);
    });

    it('should check if a task is expired', () => {
      const expiredTask = { ...mockTask, expireAt: Date.now() - 1000 };
      expect(runner['isTaskExpired'](expiredTask)).toBe(true);
    });
  });
});
