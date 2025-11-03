import {
	IntervalTask,
	IntervalTaskCreatePayload,
	IntervalTaskRunner,
	IntervalTaskRunnerConfig
} from '@taskwave/core'
import { useCallback, useEffect, useRef, useState } from 'react'
import _ from 'lodash'

interface Props {
	config: IntervalTaskRunnerConfig
}

const DEFAULT_INTERVAL_RUNNER_PROPS: Props = {
	config: { start: false }
}

/**
 * React hook for managing interval tasks that execute repeatedly at specified intervals.
 *
 * This hook wraps the `IntervalTaskRunner` class to provide React-friendly task scheduling.
 * Tasks are automatically cleared when the component unmounts or when the config changes.
 *
 * @param props - Hook configuration options
 * @param props.config - Configuration for the interval task runner
 * @param props.config.start - Whether to start the runner immediately (default: false)
 *
 * @returns An object containing task management functions and the current tasks array
 * @returns {Function} returns.addTask - Function to add a new interval task
 * @returns {Function} returns.updateTask - Function to update an existing task
 * @returns {Function} returns.removeTask - Function to remove a task by ID
 * @returns {Function} returns.clearRunner - Function to clear all tasks
 * @returns {Function} returns.getTask - Function to get a task by ID
 * @returns {Function} returns.startRunner - Function to start the runner
 * @returns {IntervalTask[]} returns.tasks - Array of all current tasks
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { addTask, tasks, startRunner, removeTask } = useIntervalTaskRunner({
 *     config: { start: true }
 *   });
 *
 *   useEffect(() => {
 *     const task = addTask({
 *       interval: 1000,
 *       startAt: Date.now(),
 *       callback: () => console.log('Tick')
 *     });
 *
 *     return () => {
 *       if (task) removeTask(task.id);
 *     };
 *   }, []);
 *
 *   return <div>Tasks: {tasks.length}</div>;
 * }
 * ```
 */
function useIntervalTaskRunner({
	config
}: Props = DEFAULT_INTERVAL_RUNNER_PROPS) {
	const runnerRef = useRef<IntervalTaskRunner | null>(
		new IntervalTaskRunner([], config)
	)
	const prevConfig = useRef(config)
	const [tasks, setTasks] = useState<IntervalTask[]>([])

	useEffect(() => {
		if (_.isEqual(prevConfig.current, config)) {
			return
		}

		const newRunner = new IntervalTaskRunner([], config)
		runnerRef.current = newRunner

		return () => {
			newRunner.clear()
			runnerRef.current = null
		}
	}, [config])

	/**
	 * Adds a new interval task. See {@link IntervalTaskRunner.addTask} for details.
	 *
	 * Automatically updates React state with the new task.
	 *
	 * @returns The created interval task, or null if the runner is not initialized
	 */
	const addTask = useCallback(<T>(taskConfig: IntervalTaskCreatePayload<T>) => {
		if (!runnerRef.current) {
			console.warn('IntervalTaskRunner not initialized. Cannot add task.')
			return null
		}
		const newTask = runnerRef.current.addTask<T>(taskConfig)
		setTasks((prevTasks) => [...prevTasks, newTask])
		return newTask
	}, [])

	/**
	 * Updates an existing interval task. See {@link IntervalTaskRunner.updateTask} for details.
	 *
	 * Automatically updates React state when a task is modified.
	 *
	 * @param taskId - The unique identifier of the task to update
	 */
	const updateTask = useCallback(
		<T>(taskId: string, newConfig: Partial<IntervalTaskCreatePayload<T>>) => {
			if (!runnerRef.current) {
				console.warn('IntervalTaskRunner not initialized. Cannot update task.')
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
	 * Removes a task by its ID. See {@link IntervalTaskRunner.removeTask} for details.
	 *
	 * Automatically updates React state to remove the task.
	 *
	 * @param taskId - The unique identifier of the task to remove
	 */
	const removeTask = useCallback((taskId: string) => {
		if (!runnerRef.current) {
			console.warn('IntervalTaskRunner not initialized. Cannot remove task.')
			return
		}
		runnerRef.current.removeTask(taskId)
		setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
	}, [])

	/**
	 * Clears all tasks. See {@link IntervalTaskRunner.clear} for details.
	 *
	 * Automatically clears the React state.
	 */
	const clearRunner = useCallback(() => {
		if (!runnerRef.current) {
			console.warn('IntervalTaskRunner not initialized. Cannot clear tasks.')
			return
		}
		runnerRef.current.clear()
		setTasks([])
	}, [])

	/**
	 * Gets a specific task by its ID. See {@link IntervalTaskRunner.getTask} for details.
	 *
	 * @param taskId - The unique identifier of the task
	 */
	const getTask = useCallback((taskId: string) => {
		if (!runnerRef.current) {
			console.warn('IntervalTaskRunner not initialized. Cannot get task.')
			return undefined
		}
		return runnerRef.current.getTask(taskId)
	}, [])

	/**
	 * Starts the runner. See {@link IntervalTaskRunner.start} for details.
	 */
	const startRunner = useCallback(() => {
		runnerRef.current?.start()
	}, [])

	return {
		startRunner,
		getTask,
		clearRunner,
		removeTask,
		addTask,
		updateTask,
		tasks
	}
}

export { useIntervalTaskRunner }
