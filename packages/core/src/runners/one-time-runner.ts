import { BaseRunner } from '@/runners/base-runner'
import type {
	OneTimeTask,
	OneTimeTaskCreatePayload,
	OneTimeTaskRunnerConfig
} from '@/types'
import { generateUniqueId } from '@/utils/ids'

/**
 * Runner for managing one-time tasks that execute once at a specified time.
 *
 * Extends BaseRunner to provide functionality for scheduling tasks that run
 * only once at a specified time. Tasks are automatically removed after execution.
 * Tasks can be scheduled to start in the future and will automatically expire
 * if their expiration time is reached before execution.
 *
 * @example
 * ```ts
 * const runner = new OneTimeTaskRunner();
 *
 * // Add a task that runs once after 5 seconds
 * runner.addTask({
 *   startAt: Date.now() + 5000,
 *   callback: () => console.log('Executed once')
 * });
 *
 * runner.start();
 * ```
 */
export class OneTimeTaskRunner extends BaseRunner<OneTimeTask> {
	/**
	 * Creates a new OneTimeTaskRunner instance.
	 *
	 * @param tasks - Array of one-time tasks to manage (default: empty array)
	 * @param config - Optional configuration object
	 * @param config.start - Whether to start the runner immediately (default: false)
	 */
	constructor(tasks: OneTimeTask[] = [], config?: OneTimeTaskRunnerConfig) {
		super(tasks, config)
	}

	/**
	 * Starts the runner and schedules all existing tasks.
	 *
	 * This method overrides the base class start method to actually schedule
	 * tasks when starting, rather than just setting the running state.
	 */
	start() {
		super.start()
		this.tasks.forEach((task) => {
			this.scheduleTask(task)
		})
	}

	/**
	 * Adds a new one-time task to the runner.
	 *
	 * The task will be automatically assigned a unique ID and created timestamp.
	 * If the runner is currently running, the task will be scheduled immediately.
	 * The task will be automatically removed after execution.
	 *
	 * @template T - The type parameter for the task callback
	 * @param data - The task creation payload
	 * @param data.startAt - The timestamp when the task should execute
	 * @param data.callback - The function to execute when the task runs
	 * @param data.name - Optional name for the task
	 * @param data.enabled - Whether the task is enabled (default: true)
	 * @param data.expireAt - Optional expiration timestamp (default: Infinity)
	 * @param data.onRemove - Optional callback when the task is removed
	 * @returns The created one-time task
	 *
	 * @example
	 * ```ts
	 * const task = runner.addTask({
	 *   startAt: Date.now() + 3000,
	 *   callback: () => console.log('Runs once after 3 seconds')
	 * });
	 * ```
	 */
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

	/**
	 * Updates an existing one-time task.
	 *
	 * If the task is found and updated, it will be re-scheduled with the new
	 * configuration. The task's timer will be cleared and restarted if the runner
	 * is currently running.
	 *
	 * @template T - The type parameter for the task callback
	 * @param id - The unique identifier of the task to update
	 * @param data - Partial task data to merge with the existing task
	 * @returns The updated task if found, undefined otherwise
	 */
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
