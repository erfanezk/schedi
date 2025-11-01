import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest'
import type { IntervalTask } from '@/types'
import { generateIntervalMockTask, secondsToMilliseconds } from './utils'
import { IntervalTaskRunner } from '@/index'

describe('Interval task runner', () => {
	const now = new Date()

	beforeEach(() => {
		vi.useFakeTimers()
		vi.setSystemTime(now)
	})

	afterEach(() => {
		vi.runOnlyPendingTimers()
		vi.useRealTimers()
	})

	describe('Task Scheduling', () => {
		it('should start a task after the minimum interval has passed', () => {
			// given
			const task = generateIntervalMockTask()
			const taskRunner = new IntervalTaskRunner([task])

			// when
			taskRunner.start()
			vi.advanceTimersByTime(1000)

			// then
			expect(task.callback).toHaveBeenCalledTimes(1)
		})

		it('should not execute tasks before their startAt time', () => {
			// given
			const task = generateIntervalMockTask({ startAt: Date.now() + 2000 })
			const taskRunner = new IntervalTaskRunner([task])

			// when
			taskRunner.start()
			vi.advanceTimersByTime(1000)

			// then
			expect(task.callback).not.toHaveBeenCalled()
		})

		it('should execute a task after its startAt time has passed', () => {
			// given
			const task = generateIntervalMockTask({ startAt: Date.now() + 2000 })
			const taskRunner = new IntervalTaskRunner([task])

			// when
			taskRunner.start()
			vi.advanceTimersByTime(4000)

			// then
			expect(task.callback).toHaveBeenCalledTimes(2)
		})
	})

	describe('Task Removal and Expiration', () => {
		it('should execute only non-expired tasks and remove expired ones', () => {
			// given
			const task = generateIntervalMockTask({
				expireAt: Date.now() + secondsToMilliseconds(2)
			})
			const taskRunner = new IntervalTaskRunner([task])

			// when
			taskRunner.start()
			vi.advanceTimersByTime(4000)

			// then
			expect(task.callback).toHaveBeenCalledTimes(2)
		})

		it('should not execute tasks that expire immediately upon start', () => {
			// given
			const task = generateIntervalMockTask({
				startAt: Date.now(),
				expireAt: Date.now()
			})
			const taskRunner = new IntervalTaskRunner([task])

			// when
			taskRunner.start()
			vi.advanceTimersByTime(1000)

			// then
			expect(task.callback).not.toHaveBeenCalled()
		})

		it('should stop all tasks from executing when stopped', () => {
			// given
			const task = generateIntervalMockTask({ interval: 1000 })
			const taskRunner = new IntervalTaskRunner([task])

			// when
			taskRunner.start()
			vi.advanceTimersByTime(1000)
			taskRunner.clear()
			vi.advanceTimersByTime(1000)

			// then
			expect(task.callback).toHaveBeenCalledTimes(1)
		})

		it('should stop a specific task while allowing others to continue', () => {
			// given
			const task1 = generateIntervalMockTask({ id: 'task-1' })
			const task2 = generateIntervalMockTask({ id: 'task-2' })
			const taskRunner = new IntervalTaskRunner([task1, task2])

			// when
			taskRunner.start()
			vi.advanceTimersByTime(1000)
			taskRunner.removeTask('task-1')
			vi.advanceTimersByTime(1000)

			// then
			expect(task1.callback).toHaveBeenCalledTimes(1)
			expect(task2.callback).toHaveBeenCalledTimes(2)
		})

		it('should not execute tasks that have already expired', () => {
			// given
			const task = generateIntervalMockTask({ expireAt: Date.now() - 1000 })
			const taskRunner = new IntervalTaskRunner([task])

			// when
			taskRunner.start()
			vi.advanceTimersByTime(1000)

			// then
			expect(task.callback).not.toHaveBeenCalled()
		})

		it('should not execute tasks that are disabled', () => {
			// given
			const task = generateIntervalMockTask({ enabled: false })
			const taskRunner = new IntervalTaskRunner([task])

			// when
			taskRunner.start()
			vi.advanceTimersByTime(1000)

			// then
			expect(task.callback).not.toHaveBeenCalled()
		})

		it('should stop tasks once expired, even if executing', () => {
			// given
			const task = generateIntervalMockTask({ expireAt: Date.now() + 1500 })
			const taskRunner = new IntervalTaskRunner([task])

			// when
			taskRunner.start()
			vi.advanceTimersByTime(1000) // Task runs once
			vi.advanceTimersByTime(1000) // Task should expire

			// then
			expect(task.callback).toHaveBeenCalledTimes(1)
		})

		it('should not execute a newly added task if it is expired', () => {
			// given
			const taskRunner = new IntervalTaskRunner([])
			const taskPayload = generateIntervalMockTask({
				expireAt: Date.now() - 1000
			})

			// when
			taskRunner.addTask(taskPayload)
			vi.advanceTimersByTime(2000)

			// then
			expect(taskPayload.callback).not.toHaveBeenCalled()
		})
	})

	describe('Task Execution', () => {
		it('should execute a task periodically until it expires', () => {
			// given
			const task = generateIntervalMockTask()
			const taskRunner = new IntervalTaskRunner([task])

			// when
			taskRunner.start()
			vi.advanceTimersByTime(5000)

			// then
			expect(task.callback).toHaveBeenCalledTimes(5)
		})

		it('should handle multiple tasks with different execution intervals', () => {
			// given
			const task1 = generateIntervalMockTask({ interval: 1000 })
			const task2 = generateIntervalMockTask({ interval: 2000 })
			const taskRunner = new IntervalTaskRunner([task1, task2])

			// when
			taskRunner.start()
			vi.advanceTimersByTime(5000)

			// then
			expect(task1.callback).toHaveBeenCalledTimes(5)
			expect(task2.callback).toHaveBeenCalledTimes(2)
		})

		it('should handle tasks with long execution durations without missing intervals', () => {
			// given
			const task = generateIntervalMockTask({
				callback: vi.fn(() => vi.advanceTimersByTime(200)), // Simulate long execution
				interval: 1000
			})
			const taskRunner = new IntervalTaskRunner([task])

			// when
			taskRunner.start()
			vi.advanceTimersByTime(3000)

			// then
			expect(task.callback).toHaveBeenCalledTimes(3)
		})

		it('should execute a newly added task at its defined interval', () => {
			// given
			const taskRunner = new IntervalTaskRunner([])
			const taskPayload = generateIntervalMockTask({
				startAt: Date.now(),
				interval: 2000
			})

			// when
			taskRunner.start()
			taskRunner.addTask(taskPayload)
			vi.advanceTimersByTime(2000)

			// then
			expect(taskPayload.callback).toHaveBeenCalledTimes(1)

			// when
			vi.advanceTimersByTime(2000)

			// then
			expect(taskPayload.callback).toHaveBeenCalledTimes(2)
		})

		it('should correctly schedule tasks that start far in the future', () => {
			// given
			const task = generateIntervalMockTask({
				startAt: Date.now() + 60000,
				interval: 1000
			})
			const taskRunner = new IntervalTaskRunner([task])

			// when
			taskRunner.start()
			vi.advanceTimersByTime(59000)

			// then
			expect(task.callback).not.toHaveBeenCalled()

			// when
			vi.advanceTimersByTime(2000)

			// then
			expect(task.callback).toHaveBeenCalledTimes(1)
		})

		it('should not execute a task once it has been removed', () => {
			// given
			const task = generateIntervalMockTask({ interval: 1000 })
			const taskRunner = new IntervalTaskRunner([task])

			// when
			taskRunner.start()
			vi.advanceTimersByTime(1000)
			taskRunner.removeTask(task.id)
			vi.advanceTimersByTime(3000)

			// then
			expect(task.callback).toHaveBeenCalledTimes(1)
		})

		it('should not execute disabled tasks', () => {
			// given
			const task = generateIntervalMockTask({ enabled: false })
			const taskRunner = new IntervalTaskRunner([task])

			// when
			taskRunner.start()
			vi.advanceTimersByTime(1000)

			// then
			expect(task.callback).not.toHaveBeenCalled()
		})
	})

	describe('Task Scheduling with Large Numbers and Long Intervals', () => {
		it('should handle tasks with very long intervals', () => {
			// given
			const task = generateIntervalMockTask({
				interval: 60000,
				expireAt: Date.now() + secondsToMilliseconds(130)
			}) // 1-minute interval
			const taskRunner = new IntervalTaskRunner([task])

			// when
			taskRunner.start()
			vi.advanceTimersByTime(120000) // Advance by 2 minutes

			// then
			expect(task.callback).toHaveBeenCalledTimes(2)
		})

		it('should handle a large number of tasks efficiently', () => {
			// given
			const tasks = Array.from({ length: 100 }, (_, i) =>
				generateIntervalMockTask({ id: `task-${i}`, interval: 1000 + i * 10 })
			)
			const taskRunner = new IntervalTaskRunner(tasks)

			// when
			taskRunner.start()
			vi.advanceTimersByTime(2000)

			// then
			tasks.forEach((task, i) => {
				const expectedCalls = Math.floor(2000 / (1000 + i * 10))
				expect(task.callback).toHaveBeenCalledTimes(expectedCalls)
			})
		})
	})

	describe('Overlapping Intervals and Task Management', () => {
		it('should correctly handle overlapping task intervals', () => {
			// given
			const task1 = generateIntervalMockTask({ interval: 1000 })
			const task2 = generateIntervalMockTask({ interval: 500 })
			const taskRunner = new IntervalTaskRunner([task1, task2])

			// when
			taskRunner.start()
			vi.advanceTimersByTime(2000)

			// then
			expect(task1.callback).toHaveBeenCalledTimes(2) // Every 1000ms
			expect(task2.callback).toHaveBeenCalledTimes(4) // Every 500ms
		})

		it('should execute multiple tasks starting at the same time', () => {
			// given
			const task1 = generateIntervalMockTask({ startAt: Date.now() })
			const task2 = generateIntervalMockTask({ startAt: Date.now() })
			const taskRunner = new IntervalTaskRunner([task1, task2])

			// when
			taskRunner.start()
			vi.advanceTimersByTime(1000)

			// then
			expect(task1.callback).toHaveBeenCalledTimes(1)
			expect(task2.callback).toHaveBeenCalledTimes(1)
		})

		it('should stop tasks that are removed during execution', () => {
			// given
			const task = generateIntervalMockTask()
			const taskRunner = new IntervalTaskRunner([task])

			// when
			taskRunner.start()
			taskRunner.removeTask(task.id)
			vi.advanceTimersByTime(1000)

			// then
			expect(task.callback).not.toHaveBeenCalled()
		})

		it('should correctly add multiple tasks and execute them in sequence', () => {
			// given
			const taskRunner = new IntervalTaskRunner([])
			const task1 = generateIntervalMockTask({ startAt: Date.now() + 1000 })
			const task2 = generateIntervalMockTask({ startAt: Date.now() + 2000 })

			// when
			taskRunner.start()
			taskRunner.addTask(task1)
			taskRunner.addTask(task2)
			vi.advanceTimersByTime(2000)

			// then
			expect(task1.callback).toHaveBeenCalledTimes(1)
			expect(task2.callback).not.toHaveBeenCalled()

			// when
			vi.advanceTimersByTime(1000)

			// then
			expect(task2.callback).toHaveBeenCalledTimes(1)
		})

		it('should not execute tasks whose intervals exceed their expiration time', () => {
			// given
			const task = generateIntervalMockTask({
				interval: 6000,
				expireAt: Date.now() + 5000
			})
			const taskRunner = new IntervalTaskRunner([task])

			// when
			taskRunner.start()
			vi.advanceTimersByTime(6000)

			// then
			expect(task.callback).not.toHaveBeenCalled()
		})
	})

	describe('Task Addition and Removal', () => {
		it('should immediately execute tasks scheduled in the past', () => {
			// given
			const taskRunner = new IntervalTaskRunner([])
			const taskPayload = generateIntervalMockTask({
				startAt: Date.now() - 1000
			})

			// when
			taskRunner.start()
			taskRunner.addTask(taskPayload)
			vi.advanceTimersByTime(1000)

			// then
			expect(taskPayload.callback).toHaveBeenCalledTimes(1)
		})

		it('should schedule tasks correctly when startAt is in the future', () => {
			// given
			const taskRunner = new IntervalTaskRunner([])
			const taskPayload = generateIntervalMockTask({
				startAt: Date.now() + 3000
			})

			// when
			taskRunner.start()
			taskRunner.addTask(taskPayload)
			vi.advanceTimersByTime(2000)

			// then
			expect(taskPayload.callback).not.toHaveBeenCalled() // Task should not execute yet

			// when
			vi.advanceTimersByTime(2000)

			// then
			expect(taskPayload.callback).toHaveBeenCalledTimes(1)
		})

		it('should not execute tasks that are expired when added', () => {
			// given
			const taskRunner = new IntervalTaskRunner([])
			const taskPayload = generateIntervalMockTask({
				expireAt: Date.now() - 1000
			})

			// when
			taskRunner.addTask(taskPayload)
			vi.advanceTimersByTime(2000)

			// then
			expect(taskPayload.callback).not.toHaveBeenCalled()
		})

		it('should add and remove a task before it executes', () => {
			// given
			const taskRunner = new IntervalTaskRunner([])
			const task = generateIntervalMockTask({ startAt: Date.now() + 3000 })

			// when
			taskRunner.start()
			const newTask = taskRunner.addTask(task)
			taskRunner.removeTask(newTask.id)
			vi.advanceTimersByTime(4000)

			// then
			expect(task.callback).not.toHaveBeenCalled()
		})
	})

	describe('Task Update', () => {
		const initialTask: IntervalTask = {
			id: '1',
			interval: 1000,
			startAt: Date.now(),
			enabled: true,
			expireAt: Infinity,
			callback: vi.fn(),
			createdAt: Date.now(),
			name: 'task-1',
			totalRunCount: 0,
			lastRunAt: undefined
		}

		it('should update an existing task successfully', () => {
			// given
			const taskRunner = new IntervalTaskRunner([initialTask])
			const updatedData = { interval: 2000 }

			// when
			taskRunner.start()
			const updatedTask = taskRunner.updateTask('1', updatedData)

			// then
			expect(updatedTask).toBeDefined()
			expect(updatedTask?.id).toBe('1')
			expect(updatedTask?.interval).toBe(2000)
			expect(updatedTask?.startAt).toBe(initialTask.startAt) // Ensure other properties remain the same
		})

		it('should return undefined when the task does not exist', () => {
			// given
			const taskRunner = new IntervalTaskRunner([initialTask])

			// when
			taskRunner.start()
			const updatedTask = taskRunner.updateTask('non-existing-id', {
				interval: 3000
			})

			// then
			expect(updatedTask).toBeUndefined()
		})

		it('should update only provided fields and leave others unchanged', () => {
			// given
			const updatedData = { interval: 3000 }
			const taskRunner = new IntervalTaskRunner([initialTask])

			// when
			taskRunner.start()
			const updatedTask = taskRunner.updateTask('1', updatedData)

			// then
			expect(updatedTask).toBeDefined()
			expect(updatedTask?.id).toBe('1')
			expect(updatedTask?.interval).toBe(3000)
			expect(updatedTask?.startAt).toBe(initialTask.startAt) // Ensure the `startAt` was not modified
		})

		it('should not modify the task if no data is provided', () => {
			// given
			const taskRunner = new IntervalTaskRunner([initialTask])

			// when
			taskRunner.start()
			const updatedTask = taskRunner.updateTask('1', {})

			// then
			expect(updatedTask).toBeDefined()
			expect(updatedTask?.id).toBe('1')
			expect(updatedTask?.interval).toBe(initialTask.interval)
			expect(updatedTask?.startAt).toBe(initialTask.startAt)
		})

		it('should update an already updated task', () => {
			// given
			const taskRunner = new IntervalTaskRunner([initialTask])
			const firstUpdate = { interval: 1500 }
			const secondUpdate = { startAt: Date.now() + 1000 }

			// when
			taskRunner.start()
			taskRunner.updateTask('1', firstUpdate)
			const updatedTask = taskRunner.updateTask('1', secondUpdate)

			// then
			expect(updatedTask).toBeDefined()
			expect(updatedTask?.id).toBe('1')
			expect(updatedTask?.startAt).toBeGreaterThan(initialTask.startAt) // Check that `startAt` was updated
			expect(updatedTask?.interval).toBe(1500) // First update remains
		})
	})
})
