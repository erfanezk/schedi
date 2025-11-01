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

	const removeTask = useCallback((taskId: string) => {
		if (!runnerRef.current) {
			console.warn('OneTimeTaskRunner not initialized. Cannot remove task.')
			return
		}
		runnerRef.current.removeTask(taskId)
	}, [])

	const clear = useCallback(() => {
		if (!runnerRef.current) {
			console.warn('OneTimeTaskRunner not initialized. Cannot clear tasks.')
			return
		}
		runnerRef.current.clear()
		setTasks([])
	}, [])

	const getTask = useCallback((taskId: string) => {
		if (!runnerRef.current) {
			console.warn('OneTimeTaskRunner not initialized. Cannot get task.')
			return undefined
		}
		return runnerRef.current.getTask(taskId)
	}, [])

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
