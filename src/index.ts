import { IntervalTaskRunner, OneTimeTaskRunner } from '@/runners';

const intervalRunner = new IntervalTaskRunner([]);
const schedulify = new OneTimeTaskRunner([]);

export { schedulify, intervalRunner };
