import type { BaseRunnerConfig, Task } from '../types'

/**
 * Base runner class that manages a collection of tasks.
 *
 * Provides common functionality for task scheduling, including starting, stopping,
 * adding, removing, and updating tasks.
 *
 * @template T - The type of task this runner manages, must extend Task
 *
 * @example
 * ```ts
 * const runner = new BaseRunner(tasks, { start: true });
 * runner.start();
 * runner.addTask(newTask);
 * ```
 */
export class BaseRunner<T extends Task<unknown>> {
	private _tasks: T[]
	private _isRunning = false
	private _timers: Map<string, ReturnType<typeof setTimeout>> = new Map() //taskId -> timeout

	/**
	 * Creates a new BaseRunner instance.
	 *
	 * @param tasks - Array of tasks to manage
	 * @param config - Optional configuration object
	 * @param config.start - Whether to start the runner immediately (default: false)
	 */
	constructor(tasks: T[], config?: BaseRunnerConfig) {
		this._tasks = tasks
		this._isRunning = config?.start ?? false
	}

	/**
	 * Gets the array of all tasks managed by this runner.
	 *
	 * @returns Array of tasks
	 */
	get tasks() {
		return this._tasks
	}

	/**
	 * Gets the map of active timers for tasks.
	 *
	 * @returns Map of task IDs to their timer handles
	 */
	get timers() {
		return this._timers
	}

	/**
	 * Gets whether the runner is currently running.
	 *
	 * @returns True if the runner is running, false otherwise
	 */
	get isRunning(): boolean {
		return this._isRunning
	}

	/**
	 * Sets whether the runner is currently running.
	 *
	 * @param value - True to start the runner, false to stop it
	 */
	set isRunning(value: boolean) {
		this._isRunning = value
	}

	/**
	 * Starts the runner, setting the running state to true.
	 *
	 * Note: This method only changes the state. Subclasses should override
	 * this method to actually start scheduling tasks.
	 */
	start(): void {
		this._isRunning = true
	}

	/**
	 * Clears all tasks and stops all active timers.
	 *
	 * This method removes all tasks from the runner and clears
	 * all associated timers (both timeouts and intervals).
	 */
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
	 *
	 * @param taskId - The unique identifier of the task to remove
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

	/**
	 * Gets a specific task by its ID.
	 *
	 * @param taskId - The unique identifier of the task
	 * @returns The task if found, undefined otherwise
	 */
	getTask(taskId: string): T | undefined {
		return this._tasks.find((task) => task.id === taskId)
	}

	/**
	 * Gets all tasks managed by this runner.
	 *
	 * @returns Array of all tasks
	 */
	getTasks(): T[] {
		return this._tasks
	}

	/**
	 * Updates a task with new data.
	 *
	 * @param id - The unique identifier of the task to update
	 * @param data - Partial task data to merge with the existing task
	 * @returns The updated task if found, undefined otherwise
	 */
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
