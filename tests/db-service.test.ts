import TaskService from '@/services/tasks';
import { ICreateIntervalTaskPayload } from '@/interfaces';
import { TaskDatabaseService } from '@/services';

const mockTask1: ICreateIntervalTaskPayload = {
  name: 'Mock Task 1',
  startAt: new Date().getTime() + 100000,
  interval: 3000,
  callback: () => console.log('✅ Executed Mock Task 1'),
  expireAt: new Date().getTime() + 500000,
};

describe('TaskService', () => {
  describe('Interval database', () => {
    test('should add task to db', async () => {
      const databaseService = new TaskDatabaseService();

      const createdTask = await databaseService.addIntervalTask(mockTask1);
      const intervals = await databaseService.getAllIntervalTasks();

      expect(intervals?.length).toBe(1);
      expect(createdTask).toBeTruthy();
    });

    test('should clear all tasks', async () => {
      const taskService = new TaskService();
      await taskService.addIntervalTask(mockTask1);
      await taskService.addIntervalTask(mockTask1);
      await taskService.clearAllIntervalTasks();
      const intervals = await taskService.getAllIntervalTasks();

      expect(intervals?.length).toBe(0);
    });

    test('should delete task', async () => {
      const databaseService = new TaskDatabaseService();

      const addedTask = await databaseService.addIntervalTask(mockTask1);
      if (addedTask) {
        await databaseService.deleteIntervalTask(addedTask.id);
      }

      const intervals = await databaseService.getAllIntervalTasks();

      expect(intervals?.length).toBe(0);
    });

    test('should update task', async () => {
      const databaseService = new TaskDatabaseService();

      const addedTask = await databaseService.addIntervalTask(mockTask1);
      if (addedTask) {
        await databaseService.updateIntervalTask(addedTask.id, {
          interval: 10000,
        });
        const updatedTask = await databaseService.getIntervalTaskById(addedTask.id);

        expect(updatedTask?.interval).toBe(10000);
      }
    });
  });
});
