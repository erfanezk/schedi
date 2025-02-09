import taskService from '@/services/tasks';
import { ICreateIntervalTaskPayload } from '@/interfaces';

describe('IntervalTaskRunner', () => {
  test('should be able to add task to db', async () => {
    const mockTask1: ICreateIntervalTaskPayload = {
      name: 'Mock Task 1',
      interval: 3000,
      callback: () => console.log('✅ Executed Mock Task 1'),
    };

    await taskService.addIntervalTask(mockTask1);
    const intervals = await taskService.getAllIntervalTasks();

    expect(intervals?.length).toBe(1);
  });
});
