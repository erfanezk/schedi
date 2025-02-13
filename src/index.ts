import { TaskDatabase } from '@/db';
import { TaskDatabaseService } from '@/services';
import { IntervalTaskRunner } from '@/runners';

const db = new TaskDatabase();
const taskService = new TaskDatabaseService(db);
const schedulify = new IntervalTaskRunner(taskService);

export { schedulify, taskService };
