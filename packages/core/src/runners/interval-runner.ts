import { BaseRunner } from './base-runner'
import type {
	IntervalTask,
	IntervalTaskCreatePayload,
	IntervalTaskRunnerConfig
} from '../types'
import { generateUniqueId } from '@/utils/ids'

/**
 * Runner for managing interval tasks that execute repeatedly at specified intervals.
 *
 * Extends BaseRunner to provide functionality for scheduling tasks that run
 * continuously at regular intervals. Tasks can be scheduled to start in the future
 * and will automatically expire when their expiration time is reached.
 *
 * @example
 * ```ts
 * const runner = new IntervalTaskRunner();
 *
 * // Add a task that runs every 1 second
 * runner.addTask({
 *   interval: 1000,
 *   startAt: Date.now(),
 *   callback: () => console.log('Tick')
 * });
 *
 * runner.start();
 * ```
 */
export class IntervalTaskRunner extends BaseRunner<IntervalTask> {
	/**
	 * Creates a new IntervalTaskRunner instance.
	 *
	 * @param tasks - Array of interval tasks to manage (default: empty array)
	 * @param config - Optional configuration object
	 * @param config.start - Whether to start the runner immediately (default: false)
	 */
	constructor(tasks: IntervalTask[] = [], config?: IntervalTaskRunnerConfig) {
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
	 * Adds a new interval task to the runner.
	 *
	 * The task will be automatically assigned a unique ID and created timestamp.
	 * If the runner is currently running, the task will be scheduled immediately.
	 *
	 * @template T - The type parameter for the task callback
	 * @param data - The task creation payload
	 * @param data.interval - The interval in milliseconds between executions
	 * @param data.startAt - The timestamp when the task should start executing
	 * @param data.callback - The function to execute at each interval
	 * @param data.name - Optional name for the task
	 * @param data.enabled - Whether the task is enabled (default: true)
	 * @param data.expireAt - Optional expiration timestamp (default: Infinity)
	 * @param data.onRemove - Optional callback when the task is removed
	 * @returns The created interval task
	 *
	 * @example
	 * ```ts
	 * const task = runner.addTask({
	 *   interval: 5000,
	 *   startAt: Date.now(),
	 *   callback: () => console.log('Running every 5 seconds')
	 * });
	 * ```
	 */
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

	/**
	 * Updates an existing interval task.
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
