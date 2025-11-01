import { BaseRunner } from './base-runner'
import type {
	IntervalTask,
	IntervalTaskCreatePayload,
	IntervalTaskRunnerConfig
} from '../types'
import { generateUniqueId } from '@/utils/ids'

export class IntervalTaskRunner extends BaseRunner<IntervalTask> {
	constructor(tasks: IntervalTask[] = [], config?: IntervalTaskRunnerConfig) {
		super(tasks, config)
	}

	start() {
		super.start()
		this.tasks.forEach((task) => {
			this.scheduleTask(task)
		})
	}

	addTask<T>(data: IntervalTaskCreatePayload<T>): IntervalTask<T> {
		const newTask: IntervalTask<T> = {
			...data,
			lastRunAt: undefined,
			totalRunCount: 0,
			id: generateUniqueId(),
			createdAt: Date.now(),
			enabled: data.enabled ?? true,
			expireAt: data.expireAt ?? Infinity
		}

		this.tasks.push(newTask)

		if (this.isRunning) {
			this.scheduleTask(newTask)
		}

		return newTask
	}

	updateTask<T>(
		id: string,
		data: Partial<IntervalTaskCreatePayload<T>>
	): IntervalTask<T> | undefined {
		const updatedTask = super.updateTask(id, data)

		if (updatedTask) {
			this.scheduleTask(updatedTask)
		}

		return updatedTask
	}

	private scheduleTask<T>(task: IntervalTask<T>): void {
		if (this.canScheduleTask(task)) {
			if (this.isTaskForFuture(task)) {
				this.scheduleTaskForFuture(task)
			} else {
				this.startInterval(task)
			}
		}
	}

	private scheduleTaskForFuture<T>(task: IntervalTask<T>): void {
		const delay = Math.max(0, task.startAt - Date.now())
		const timeout = setTimeout(() => this.startInterval(task), delay)
		this.addTimer(task.id, timeout)
	}

	private startInterval<T>(task: IntervalTask<T>): void {
		const interval = setInterval(() => this.executeTask(task), task.interval)
		this.addTimer(task.id, interval)
	}

	private executeTask<T>(task: IntervalTask<T>): void {
		if (this.isTaskExpired(task)) {
			this.removeTask(task.id)
			return
		}

		task.callback()
		task.lastRunAt = Date.now()
		task.totalRunCount += 1
	}
}
