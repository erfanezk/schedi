import _ from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'

import {
	OneTimeTask,
	OneTimeTaskCreatePayload,
	OneTimeTaskRunner,
	OneTimeTaskRunnerConfig
} from '@taskwave/core'

interface Props {
	config: OneTimeTaskRunnerConfig
}

const DEFAULT_ONE_TIME_RUNNER_PROPS: Props = {
	config: { start: false }
}

/**
 * React hook for managing one-time tasks that execute once at a specified time.
 *
 * This hook wraps the `OneTimeTaskRunner` class to provide React-friendly task scheduling.
 * Tasks are automatically cleared when the component unmounts or when the config changes.
 * Tasks are automatically removed after execution.
 *
 * @param props - Hook configuration options
 * @param props.config - Configuration for the one-time task runner
 * @param props.config.start - Whether to start the runner immediately (default: false)
 *
 * @returns An object containing task management functions and the current tasks array
 * @returns {OneTimeTask[]} returns.tasks - Array of all current tasks
 * @returns {Function} returns.addTask - Function to add a new one-time task
 * @returns {Function} returns.updateTask - Function to update an existing task
 * @returns {Function} returns.removeTask - Function to remove a task by ID
 * @returns {Function} returns.clear - Function to clear all tasks
 * @returns {Function} returns.getTask - Function to get a task by ID
 * @returns {Function} returns.start - Function to start the runner
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { addTask, tasks, start, removeTask } = useOneTimeTaskRunner({
 *     config: { start: true }
 *   });
 *
 *   useEffect(() => {
 *     const task = addTask({
 *       startAt: Date.now() + 5000,
 *       callback: () => console.log('Executed once after 5 seconds')
 *     });
 *
 *     return () => {
 *       if (task) removeTask(task.id);
 *     };
 *   }, []);
 *
 *   return <div>Pending tasks: {tasks.length}</div>;
 * }
 * ```
 */
function useOneTimeTaskRunner({
	config
}: Props = DEFAULT_ONE_TIME_RUNNER_PROPS) {
	const runnerRef = useRef<OneTimeTaskRunner | null>(
		new OneTimeTaskRunner([], config)
	)
	const prevConfig = useRef(config)
	const [tasks, setTasks] = useState<OneTimeTask[]>([])

	useEffect(() => {
		if (_.isEqual(prevConfig.current, config)) {
			return
		}

		const newRunner = new OneTimeTaskRunner([], config)
		runnerRef.current = newRunner

		return () => {
			newRunner.clear()
			runnerRef.current = null
		}
	}, [config])

	/**
	 * Adds a new one-time task. See {@link OneTimeTaskRunner.addTask} for details.
	 *
	 * Automatically updates React state with the new task. The task will be removed from
	 * state after execution.
	 *
	 * @returns The created one-time task, or null if the runner is not initialized
	 */
	const addTask = useCallback(<T>(taskConfig: OneTimeTaskCreatePayload<T>) => {
		if (!runnerRef.current) {
			console.warn('OneTimeTaskRunner not initialized. Cannot add task.')
			return null
		}

		const newTask = runnerRef.current.addTask<T>({
			...taskConfig,
			onRemove(removedTask: OneTimeTask<T>) {
				setTasks((prevTasks) =>
					prevTasks.filter((task) => task.id !== removedTask.id)
				)
				taskConfig.onRemove?.(removedTask)
			}
		})
		setTasks((prevTasks) => [...prevTasks, newTask])
		return newTask
	}, [])

	/**
	 * Updates an existing one-time task. See {@link OneTimeTaskRunner.updateTask} for details.
	 *
	 * Automatically updates React state when a task is modified.
	 *
	 * @param taskId - The unique identifier of the task to update
	 */
	const updateTask = useCallback(
		<T>(taskId: string, newConfig: Partial<OneTimeTaskCreatePayload<T>>) => {
			if (!runnerRef.current) {
				console.warn('OneTimeTaskRunner not initialized. Cannot update task.')
				return undefined
			}

			const updatedTask = runnerRef.current.updateTask<T>(taskId, newConfig)
			if (updatedTask) {
				setTasks((prevTasks) =>
					prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
				)
			}
			return updatedTask
		},
		[]
	)

	/**
	 * Removes a task by its ID. See {@link OneTimeTaskRunner.removeTask} for details.
	 *
	 * Note: Unlike the core class, this doesn't automatically update React state since
	 * tasks are removed from state after execution via the onRemove callback.
	 *
	 * @param taskId - The unique identifier of the task to remove
	 */
	const removeTask = useCallback((taskId: string) => {
		if (!runnerRef.current) {
			console.warn('OneTimeTaskRunner not initialized. Cannot remove task.')
			return
		}
		runnerRef.current.removeTask(taskId)
	}, [])

	/**
	 * Clears all tasks. See {@link OneTimeTaskRunner.clear} for details.
	 *
	 * Automatically clears the React state.
	 */
	const clear = useCallback(() => {
		if (!runnerRef.current) {
			console.warn('OneTimeTaskRunner not initialized. Cannot clear tasks.')
			return
		}
		runnerRef.current.clear()
		setTasks([])
	}, [])

	/**
	 * Gets a specific task by its ID. See {@link OneTimeTaskRunner.getTask} for details.
	 *
	 * @param taskId - The unique identifier of the task
	 */
	const getTask = useCallback((taskId: string) => {
		if (!runnerRef.current) {
			console.warn('OneTimeTaskRunner not initialized. Cannot get task.')
			return undefined
		}
		return runnerRef.current.getTask(taskId)
	}, [])

	/**
	 * Starts the runner. See {@link OneTimeTaskRunner.start} for details.
	 */
	const start = useCallback(() => {
		runnerRef.current?.start()
	}, [])

	return {
		tasks,
		addTask,
		updateTask,
		removeTask,
		clear,
		getTask,
		start
	}
}

export { useOneTimeTaskRunner }
