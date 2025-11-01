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

	const addTask = useCallback(<T>(taskConfig: IntervalTaskCreatePayload<T>) => {
		if (!runnerRef.current) {
			console.warn('IntervalTaskRunner not initialized. Cannot add task.')
			return null
		}
		const newTask = runnerRef.current.addTask<T>(taskConfig)
		setTasks((prevTasks) => [...prevTasks, newTask])
		return newTask
	}, [])

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

	const removeTask = useCallback((taskId: string) => {
		if (!runnerRef.current) {
			console.warn('IntervalTaskRunner not initialized. Cannot remove task.')
			return
		}
		runnerRef.current.removeTask(taskId)
		setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
	}, [])

	const clearRunner = useCallback(() => {
		if (!runnerRef.current) {
			console.warn('IntervalTaskRunner not initialized. Cannot clear tasks.')
			return
		}
		runnerRef.current.clear()
		setTasks([])
	}, [])

	const getTask = useCallback((taskId: string) => {
		if (!runnerRef.current) {
			console.warn('IntervalTaskRunner not initialized. Cannot get task.')
			return undefined
		}
		return runnerRef.current.getTask(taskId)
	}, [])

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
