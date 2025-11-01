import { BaseRunner } from '@/runners/base-runner'
import type {
	OneTimeTask,
	OneTimeTaskCreatePayload,
	OneTimeTaskRunnerConfig
} from '@/types'
import { generateUniqueId } from '@/utils/ids'

export class OneTimeTaskRunner extends BaseRunner<OneTimeTask> {
	constructor(tasks: OneTimeTask[] = [], config?: OneTimeTaskRunnerConfig) {
		super(tasks, config)
	}

	start() {
		super.start()
		this.tasks.forEach((task) => {
			this.scheduleTask(task)
		})
	}

	addTask<T>(data: OneTimeTaskCreatePayload<T>): OneTimeTask<T> {
		const newTask: OneTimeTask<T> = {
			...data,
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
		data: Partial<OneTimeTaskCreatePayload<T>>
	): OneTimeTask<T> | undefined {
		const updatedTask = super.updateTask(id, data)

		if (updatedTask) {
			this.scheduleTask(updatedTask)
		}

		return updatedTask
	}

	private scheduleTask<T>(task: OneTimeTask<T>): void {
		if (!this.canScheduleTask(task)) {
			return
		}

		const delay = Math.max(0, task.startAt - Date.now())
		const timeout = setTimeout(() => this.executeTask(task), delay)

		this.addTimer(task.id, timeout)
	}

	private executeTask<T>(task: OneTimeTask<T>): void {
		if (this.isTaskExpired(task)) {
			this.removeTask(task.id)
			return
		}

		task.callback()

		this.removeTask(task.id)
	}
}
