import { ICronTask, IIntervalTask, IOnceTimeTask, ITaskDatabase, TaskType } from '@/interfaces';
import { taskDatabase } from '@/db';

console.log(TaskType);

type ErrorHandler = (error: unknown) => void;

class TaskService implements ITaskDatabase {
  async addCronTask(
    task: Omit<ICronTask, 'id'>,
    onError?: ErrorHandler,
  ): Promise<ICronTask | undefined> {
    try {
      return await taskDatabase.addCronTask(task);
    } catch (error) {
      this.logError('addCronTask', error);
      onError?.(error);
      return undefined;
    }
  }

  async addIntervalTask(
    task: Omit<IIntervalTask, 'id'>,
    onError?: ErrorHandler,
  ): Promise<IIntervalTask | undefined> {
    try {
      return await taskDatabase.addIntervalTask(task);
    } catch (error) {
      this.logError('addIntervalTask', error);
      onError?.(error);
      return undefined;
    }
  }

  async addOnceTimeTask(
    task: Omit<IOnceTimeTask, 'id'>,
    onError?: ErrorHandler,
  ): Promise<IOnceTimeTask | undefined> {
    try {
      return await taskDatabase.addOnceTimeTask(task);
    } catch (error) {
      this.logError('addOnceTimeTask', error);
      onError?.(error);
      return undefined;
    }
  }

  async getAllCronTasks(onError?: ErrorHandler): Promise<ICronTask[] | undefined> {
    try {
      return await taskDatabase.getAllCronTasks();
    } catch (error) {
      this.logError('getAllCronTasks', error);
      onError?.(error);
      return undefined;
    }
  }

  async getAllIntervalTasks(onError?: ErrorHandler): Promise<IIntervalTask[] | undefined> {
    try {
      return await taskDatabase.getAllIntervalTasks();
    } catch (error) {
      this.logError('getAllIntervalTasks', error);
      onError?.(error);
      return undefined;
    }
  }

  async getAllOnceTimeTasks(onError?: ErrorHandler): Promise<IOnceTimeTask[] | undefined> {
    try {
      return await taskDatabase.getAllOnceTimeTasks();
    } catch (error) {
      this.logError('getAllOnceTimeTasks', error);
      onError?.(error);
      return undefined;
    }
  }

  async deleteCronTask(id: string, onError?: ErrorHandler): Promise<void> {
    try {
      await taskDatabase.deleteCronTask(id);
    } catch (error) {
      this.logError('deleteCronTask', error, id);
      onError?.(error);
    }
  }

  async deleteIntervalTask(id: string, onError?: ErrorHandler): Promise<void> {
    try {
      await taskDatabase.deleteIntervalTask(id);
    } catch (error) {
      this.logError('deleteIntervalTask', error, id);
      onError?.(error);
    }
  }

  async deleteOnceTimeTask(id: string, onError?: ErrorHandler): Promise<void> {
    try {
      await taskDatabase.deleteOnceTimeTask(id);
    } catch (error) {
      this.logError('deleteOnceTimeTask', error, id);
      onError?.(error);
    }
  }

  async getCronTaskById(id: string, onError?: ErrorHandler): Promise<ICronTask | undefined> {
    try {
      return await taskDatabase.getCronTaskById(id);
    } catch (error) {
      this.logError('getCronTaskById', error, id);
      onError?.(error);
      return undefined;
    }
  }

  async getIntervalTaskById(
    id: string,
    onError?: ErrorHandler,
  ): Promise<IIntervalTask | undefined> {
    try {
      return await taskDatabase.getIntervalTaskById(id);
    } catch (error) {
      this.logError('getIntervalTaskById', error, id);
      onError?.(error);
      return undefined;
    }
  }

  async getOnceTimeTaskById(
    id: string,
    onError?: ErrorHandler,
  ): Promise<IOnceTimeTask | undefined> {
    try {
      return await taskDatabase.getOnceTimeTaskById(id);
    } catch (error) {
      this.logError('getOnceTimeTaskById', error, id);
      onError?.(error);
      return undefined;
    }
  }

  async updateCronTask(
    id: string,
    updates: Partial<ICronTask>,
    onError?: ErrorHandler,
  ): Promise<void> {
    try {
      await taskDatabase.updateCronTask(id, updates);
    } catch (error) {
      this.logError('updateCronTask', error, id);
      onError?.(error);
      return undefined;
    }
  }

  async updateIntervalTask(
    id: string,
    updates: Partial<IIntervalTask>,
    onError?: ErrorHandler,
  ): Promise<void> {
    try {
      await taskDatabase.updateIntervalTask(id, updates);
    } catch (error) {
      this.logError('updateIntervalTask', error, id);
      onError?.(error);
      return undefined;
    }
  }

  async updateOnceTimeTask(
    id: string,
    updates: Partial<IOnceTimeTask>,
    onError?: ErrorHandler,
  ): Promise<void> {
    try {
      await taskDatabase.updateOnceTimeTask(id, updates);
    } catch (error) {
      this.logError('updateOnceTimeTask', error, id);
      onError?.(error);
      return undefined;
    }
  }

  private logError(method: string, error: unknown, taskId?: string) {
    console.error(
      `❌ [TaskService] Error in ${method} ${taskId ? `for task ID: ${taskId}` : ''}:`,
      error,
    );
  }
}

const taskService = new TaskService();

export default taskService;
