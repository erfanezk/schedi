import { ICreateIntervalTaskPayload } from '@/interfaces';
import { TaskDatabaseService } from '@/services';
import { TaskDatabase } from '@/db';

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
      const taskDatabase = new TaskDatabase();
      const databaseService = new TaskDatabaseService(taskDatabase);

      const createdTask = await databaseService.addIntervalTask(mockTask1);
      const intervals = await databaseService.getAllIntervalTasks();

      expect(intervals?.length).toBe(1);
      expect(createdTask).toBeTruthy();
    });

    test('should clear all tasks', async () => {
      const taskDatabase = new TaskDatabase();
      const databaseService = new TaskDatabaseService(taskDatabase);
      await databaseService.addIntervalTask(mockTask1);
      await databaseService.addIntervalTask(mockTask1);
      await databaseService.clearAllIntervalTasks();
      const intervals = await databaseService.getAllIntervalTasks();

      expect(intervals?.length).toBe(0);
    });

    test('should delete task', async () => {
      const taskDatabase = new TaskDatabase();
      const databaseService = new TaskDatabaseService(taskDatabase);

      const addedTask = await databaseService.addIntervalTask(mockTask1);
      if (addedTask) {
        await databaseService.deleteIntervalTask(addedTask.id);
      }

      const intervals = await databaseService.getAllIntervalTasks();

      expect(intervals?.length).toBe(0);
    });

    test('should update task', async () => {
      const taskDatabase = new TaskDatabase();
      const databaseService = new TaskDatabaseService(taskDatabase);

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
