import { ICreateIntervalTaskPayload, IIntervalTask, ITaskDatabase } from '@/interfaces';
import { TaskDatabase } from '@/db';

type ErrorHandler = (error: unknown) => void;

class TaskDatabaseService implements ITaskDatabase {
  constructor(private taskDatabase: TaskDatabase) {
    this.taskDatabase = taskDatabase;
  }

  async addIntervalTask(
    task: Omit<ICreateIntervalTaskPayload, 'id'>,
    onError?: ErrorHandler,
  ): Promise<IIntervalTask | undefined> {
    try {
      return await this.taskDatabase.addIntervalTask(task);
    } catch (error) {
      this.logError('addIntervalTask', error);
      onError?.(error);
      return undefined;
    }
  }

  async getAllIntervalTasks(onError?: ErrorHandler): Promise<IIntervalTask[] | undefined> {
    try {
      return await this.taskDatabase.getAllIntervalTasks();
    } catch (error) {
      this.logError('getAllIntervalTasks', error);
      onError?.(error);
      return undefined;
    }
  }

  async deleteIntervalTask(id: string, onError?: ErrorHandler): Promise<void> {
    try {
      await this.taskDatabase.deleteIntervalTask(id);
    } catch (error) {
      this.logError('deleteIntervalTask', error, id);
      onError?.(error);
    }
  }

  async getIntervalTaskById(
    id: string,
    onError?: ErrorHandler,
  ): Promise<IIntervalTask | undefined> {
    try {
      return await this.taskDatabase.getIntervalTaskById(id);
    } catch (error) {
      this.logError('getIntervalTaskById', error, id);
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
      await this.taskDatabase.updateIntervalTask(id, updates);
    } catch (error) {
      this.logError('updateIntervalTask', error, id);
      onError?.(error);
      return undefined;
    }
  }

  async clearAllIntervalTasks(onError?: ErrorHandler): Promise<void> {
    try {
      await this.taskDatabase.clearAllIntervalTasks();
    } catch (error) {
      this.logError('clearAllIntervalTasks', error);
      onError?.(error);
    }
  }

  private logError(method: string, error: unknown, taskId?: string) {
    console.error(
      `❌ [TaskService] Error in ${method} ${taskId ? `for task ID: ${taskId}` : ''}:`,
      error,
    );
  }
}

export default TaskDatabaseService;
