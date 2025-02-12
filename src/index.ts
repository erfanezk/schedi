import { TaskDatabaseService } from '@/services';
import { IntervalTaskRunner } from '@/runners';

const service = new TaskDatabaseService();
const schedulify = new IntervalTaskRunner(service);

export default schedulify;
