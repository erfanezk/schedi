import type { BaseRunnerConfig, Task } from '../types'

export class BaseRunner<T extends Task<unknown>> {
	private _tasks: T[]
	private _isRunning = false
	private _timers: Map<string, ReturnType<typeof setTimeout>> = new Map() //taskId -> timeout

	constructor(tasks: T[], config?: BaseRunnerConfig) {
		this._tasks = tasks
		this._isRunning = config?.start ?? false
	}

	get tasks() {
		return this._tasks
	}

	get timers() {
		return this._timers
	}

	get isRunning(): boolean {
		return this._isRunning
	}

	set isRunning(value: boolean) {
		this._isRunning = value
	}

	start(): void {
		this._isRunning = true
	}

	clear() {
		this._tasks = []
		this._isRunning = false
		this._timers.forEach((timer) => {
			clearTimeout(timer)
			clearInterval(timer)
		})
		this._timers = new Map()
	}

	/**
	 * Stops a specific task by its ID.
	 * @param {string} taskId - The unique identifier of the task.
	 */
	removeTask(taskId: string): void {
		if (this.hasTaskTimer(taskId)) {
			this.removeTimer(taskId)
		}

		const taskToRemove = this._tasks.find((task) => task.id === taskId)
		if (taskToRemove) {
			taskToRemove.onRemove?.(taskToRemove)
		}
		this._tasks = this._tasks.filter((task) => task.id !== taskId)
	}

	getTask(taskId: string): T | undefined {
		return this._tasks.find((task) => task.id === taskId)
	}

	getTasks(): T[] {
		return this._tasks
	}

	updateTask(id: string, data: Partial<T>): T | undefined {
		const taskIndex = this._tasks.findIndex((task) => task.id === id)
		if (taskIndex !== -1) {
			const oldTask = this._tasks[taskIndex]
			const updatedTask = { ...oldTask, ...data } as T
			this._tasks[taskIndex] = updatedTask
			this.removeTimer(id)
			return updatedTask
		}
		return undefined
	}

	protected isTaskEnabled(task: T): boolean {
		if (typeof task.enabled === 'function') {
			return task.enabled()
		}
		return task.enabled
	}

	protected isTaskForFuture(task: T): boolean {
		return task.startAt > Date.now()
	}

	protected canScheduleTask(task: T) {
		return (
			this.isTaskEnabled(task) &&
			!this.isTaskExpired(task) &&
			!this.hasTaskTimer(task.id)
		)
	}

	protected isTaskExpired(task: T): boolean {
		return task.expireAt < Date.now()
	}

	protected addTimer(
		taskId: string,
		timer: ReturnType<typeof setTimeout>
	): void {
		this._timers.set(taskId, timer)
	}

	private hasTaskTimer(taskId: string): boolean {
		return this._timers.has(taskId)
	}

	private removeTimer(taskId: string): void {
		if (this._timers.has(taskId)) {
			const timer = this._timers.get(taskId)
			if (!timer) {
				return
			}
			clearTimeout(timer)
			clearInterval(timer)
			this._timers.delete(taskId)
		}
	}
}
