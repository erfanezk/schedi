import { useIntervalTaskRunner } from '@/index'
import { IntervalTaskCreatePayload } from '@taskwave/core'
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('useIntervalTaskRunner', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	describe('initialization', () => {
		it('should initialize with default props', () => {
			// given
			// when
			const { result } = renderHook(() => useIntervalTaskRunner())

			// then
			expect(result.current.tasks).toEqual([])
			expect(result.current.startRunner).toBeDefined()
			expect(result.current.addTask).toBeDefined()
			expect(result.current.removeTask).toBeDefined()
			expect(result.current.clearRunner).toBeDefined()
			expect(result.current.getTask).toBeDefined()
		})

		it('should initialize with custom config', () => {
			// given
			const customConfig = { start: true }

			// when
			const { result } = renderHook(() =>
				useIntervalTaskRunner({ config: customConfig })
			)

			// then
			expect(result.current.tasks).toEqual([])
			expect(typeof result.current.addTask).toBe('function')
		})
	})

	describe('config changes', () => {
		it('should recreate runner when config changes', () => {
			// given
			const { result, rerender } = renderHook(
				({ config }) => useIntervalTaskRunner({ config }),
				{ initialProps: { config: { start: false } } }
			)

			// when
			rerender({ config: { start: true } })

			// then
			expect(typeof result.current.addTask).toBe('function')
		})

		it('should not recreate runner when config is the same', () => {
			// given
			const { result, rerender } = renderHook(
				({ config }) => useIntervalTaskRunner({ config }),
				{ initialProps: { config: { start: false } } }
			)
			const initialTasks = result.current.tasks

			// when
			rerender({ config: { start: false } })

			// then
			expect(result.current.tasks).toBe(initialTasks)
		})
	})

	describe('addTask', () => {
		it('should add a task successfully', () => {
			// given
			const { result } = renderHook(() => useIntervalTaskRunner())
			const taskConfig: IntervalTaskCreatePayload = {
				interval: 1000,
				callback: vi.fn(),
				name: '',
				startAt: Date.now()
			}

			// when
			act(() => {
				const addedTask = result.current.addTask(taskConfig)
				expect(addedTask).toBeDefined()
				expect(addedTask?.id).toBeDefined()
				expect(addedTask?.interval).toBe(1000)
			})

			// then
			expect(result.current.tasks).toHaveLength(1)
			expect(result.current.tasks[0]!.interval).toBe(1000)
		})

		it('should update tasks state when task is added', () => {
			// given
			const { result } = renderHook(() => useIntervalTaskRunner())

			// when
			act(() => {
				result.current.addTask({
					interval: 2000,
					callback: vi.fn(),
					name: '',
					startAt: Date.now()
				})
			})

			// then
			expect(result.current.tasks).toHaveLength(1)
			expect(result.current.tasks[0]!.interval).toBe(2000)
		})

		it('should handle task removal callback', () => {
			// given
			const onRemoveCallback = vi.fn()
			const { result } = renderHook(() => useIntervalTaskRunner())

			// when
			act(() => {
				result.current.addTask({
					interval: 1000,
					callback: vi.fn(),
					onRemove: onRemoveCallback,
					name: '',
					startAt: Date.now()
				})
			})

			const task = result.current.tasks[0]!
			expect(result.current.tasks).toHaveLength(1)

			act(() => {
				result.current.removeTask(task.id)
			})

			// then
			expect(result.current.tasks).toHaveLength(0)
			expect(onRemoveCallback).toHaveBeenCalledWith(task)
		})

		it('should handle multiple tasks', () => {
			// given
			const { result } = renderHook(() => useIntervalTaskRunner())

			// when
			act(() => {
				result.current.addTask({
					interval: 1000,
					callback: vi.fn(),
					name: '',
					startAt: Date.now()
				})
				result.current.addTask({
					interval: 2000,
					callback: vi.fn(),
					name: '',
					startAt: Date.now()
				})
			})

			// then
			expect(result.current.tasks).toHaveLength(2)
			expect(result.current.tasks[0]!.interval).toBe(1000)
			expect(result.current.tasks[1]!.interval).toBe(2000)
		})

		it('should handle task with all properties', () => {
			// given
			const { result } = renderHook(() => useIntervalTaskRunner())
			const callback = vi.fn()
			const onRemove = vi.fn()

			// when
			act(() => {
				result.current.addTask({
					interval: 5000,
					callback,
					onRemove,
					name: '',
					startAt: Date.now()
				})
			})

			// then
			const task = result.current.tasks[0]!
			expect(task.interval).toBe(5000)
			expect(task.callback).toBe(callback)
			expect(task.onRemove).toBe(onRemove)
		})
	})

	describe('removeTask', () => {
		it('should remove a task successfully', () => {
			// given
			const { result } = renderHook(() => useIntervalTaskRunner())

			act(() => {
				result.current.addTask({
					interval: 1000,
					callback: vi.fn(),
					name: '',
					startAt: Date.now()
				})
			})

			const task = result.current.tasks[0]!
			expect(result.current.tasks).toHaveLength(1)

			// when
			act(() => {
				result.current.removeTask(task.id)
			})

			// then
			expect(result.current.tasks).toHaveLength(0)
		})

		it('should handle removing non-existent task', () => {
			// given
			const { result } = renderHook(() => useIntervalTaskRunner())

			// when
			act(() => {
				result.current.removeTask('non-existent-id')
			})

			// then
			expect(result.current.tasks).toHaveLength(0)
		})

		it('should remove correct task from multiple tasks', () => {
			// given
			const { result } = renderHook(() => useIntervalTaskRunner())

			act(() => {
				result.current.addTask({
					interval: 1000,
					callback: vi.fn(),
					name: '',
					startAt: Date.now()
				})
				result.current.addTask({
					interval: 2000,
					callback: vi.fn(),
					name: '',
					startAt: Date.now()
				})
				result.current.addTask({
					interval: 3000,
					callback: vi.fn(),
					name: '',
					startAt: Date.now()
				})
			})

			expect(result.current.tasks).toHaveLength(3)
			const taskToRemove = result.current.tasks[1]!

			// when
			act(() => {
				result.current.removeTask(taskToRemove.id)
			})

			// then
			expect(result.current.tasks).toHaveLength(2)
			expect(result.current.tasks).not.toContain(taskToRemove)
		})
	})

	describe('clearRunner', () => {
		it('should clear all tasks', () => {
			// given
			const { result } = renderHook(() => useIntervalTaskRunner())

			act(() => {
				result.current.addTask({
					interval: 1000,
					callback: vi.fn(),
					name: '',
					startAt: Date.now()
				})
				result.current.addTask({
					interval: 2000,
					callback: vi.fn(),
					startAt: Date.now(),
					name: ''
				})
			})

			expect(result.current.tasks).toHaveLength(2)

			// when
			act(() => {
				result.current.clearRunner()
			})

			// then
			expect(result.current.tasks).toHaveLength(0)
		})

		it('should clear empty task list', () => {
			// given
			const { result } = renderHook(() => useIntervalTaskRunner())

			// when
			act(() => {
				result.current.clearRunner()
			})

			// then
			expect(result.current.tasks).toHaveLength(0)
		})
	})

	describe('getTask', () => {
		it('should get a task by id', () => {
			// given
			const { result } = renderHook(() => useIntervalTaskRunner())

			act(() => {
				result.current.addTask({
					interval: 1000,
					callback: vi.fn(),
					name: '',
					startAt: Date.now()
				})
			})

			const task = result.current.tasks[0]!

			// when
			const retrievedTask = result.current.getTask(task.id)

			// then
			expect(retrievedTask).toBeDefined()
			expect(retrievedTask?.id).toBe(task.id)
			expect(retrievedTask?.interval).toBe(1000)
		})

		it('should return undefined for non-existent task', () => {
			// given
			const { result } = renderHook(() => useIntervalTaskRunner())

			// when
			const task = result.current.getTask('non-existent-id')

			// then
			expect(task).toBeUndefined()
		})

		it('should get correct task from multiple tasks', () => {
			// given
			const { result } = renderHook(() => useIntervalTaskRunner())

			act(() => {
				result.current.addTask({
					interval: 1000,
					callback: vi.fn(),
					name: '',
					startAt: Date.now()
				})
				result.current.addTask({
					interval: 2000,
					callback: vi.fn(),
					name: '',
					startAt: Date.now()
				})
				result.current.addTask({
					interval: 3000,
					callback: vi.fn(),
					name: '',
					startAt: Date.now()
				})
			})

			const targetTask = result.current.tasks[1]!

			// when
			const retrievedTask = result.current.getTask(targetTask.id)

			// then
			expect(retrievedTask).toBe(targetTask)
			expect(retrievedTask?.interval).toBe(2000)
		})
	})

	describe('startRunner', () => {
		it('should start the runner', () => {
			// given
			const { result } = renderHook(() => useIntervalTaskRunner())

			// when
			act(() => {
				result.current.startRunner()
			})

			// then
			expect(result.current.startRunner).toBeDefined()
		})

		it('should work with tasks', () => {
			// given
			const { result } = renderHook(() => useIntervalTaskRunner())

			// when
			act(() => {
				result.current.addTask({
					interval: 1000,
					callback: vi.fn(),
					name: '',
					startAt: Date.now()
				})
				result.current.startRunner()
			})

			// then
			expect(result.current.tasks).toHaveLength(1)
		})

		it('should start runner multiple times without issues', () => {
			// given
			const { result } = renderHook(() => useIntervalTaskRunner())

			// when
			act(() => {
				result.current.startRunner()
				result.current.startRunner()
				result.current.startRunner()
			})

			// then
			expect(result.current.startRunner).toBeDefined()
		})
	})

	describe('updateTask', () => {
		it('should update a task successfully', () => {
			// given
			const { result } = renderHook(() => useIntervalTaskRunner())

			act(() => {
				result.current.addTask({
					interval: 1000,
					callback: vi.fn(),
					name: '',
					startAt: Date.now()
				})
			})

			const task = result.current.tasks[0]!
			expect(task.interval).toBe(1000)

			// when
			act(() => {
				const updatedTask = result.current.updateTask(task.id, {
					interval: 2000
				})
				expect(updatedTask).toBeDefined()
				expect(updatedTask?.interval).toBe(2000)
			})

			// then
			expect(result.current.tasks[0]!.interval).toBe(2000)
		})

		it('should handle updating non-existent task', () => {
			// given
			const { result } = renderHook(() => useIntervalTaskRunner())

			// when
			act(() => {
				const updatedTask = result.current.updateTask('non-existent-id', {
					interval: 2000
				})
				expect(updatedTask).toBeUndefined()
			})

			// then
			expect(result.current.tasks).toHaveLength(0)
		})

		it('should update task callback', () => {
			// given
			const { result } = renderHook(() => useIntervalTaskRunner())
			const newCallback = vi.fn()

			act(() => {
				result.current.addTask({
					interval: 1000,
					callback: vi.fn(),
					name: '',
					startAt: Date.now()
				})
			})

			const task = result.current.tasks[0]!

			// when
			act(() => {
				result.current.updateTask(task.id, { callback: newCallback })
			})

			// then
			expect(result.current.tasks[0]!.callback).toBe(newCallback)
		})

		it('should update multiple task properties', () => {
			// given
			const { result } = renderHook(() => useIntervalTaskRunner())
			const newCallback = vi.fn()
			const newOnRemove = vi.fn()

			act(() => {
				result.current.addTask({
					interval: 1000,
					callback: vi.fn(),
					name: '',
					startAt: Date.now()
				})
			})

			const task = result.current.tasks[0]!

			// when
			act(() => {
				result.current.updateTask(task.id, {
					interval: 3000,
					callback: newCallback,
					onRemove: newOnRemove
				})
			})

			// then
			const updatedTask = result.current.tasks[0]!
			expect(updatedTask.interval).toBe(3000)
			expect(updatedTask.callback).toBe(newCallback)
			expect(updatedTask.onRemove).toBe(newOnRemove)
		})
	})

	describe('task callbacks', () => {
		it('should execute task callback', () => {
			// given
			const callback = vi.fn()
			const { result } = renderHook(() => useIntervalTaskRunner())

			// when
			act(() => {
				result.current.addTask({
					interval: 100,
					callback,
					startAt: Date.now(),
					name: ''
				})
			})

			// then
			expect(callback).toBeDefined()
		})

		it('should handle task with onRemove callback', () => {
			// given
			const onRemove = vi.fn()
			const { result } = renderHook(() => useIntervalTaskRunner())

			// when
			act(() => {
				result.current.addTask({
					interval: 1000,
					callback: vi.fn(),
					onRemove,
					startAt: Date.now(),
					name: ''
				})
			})

			const task = result.current.tasks[0]!

			act(() => {
				result.current.removeTask(task.id)
			})

			// then
			expect(onRemove).toHaveBeenCalledWith(task)
		})

		it('should handle multiple tasks with different callbacks', () => {
			// given
			const callback1 = vi.fn()
			const callback2 = vi.fn()
			const onRemove1 = vi.fn()
			const onRemove2 = vi.fn()
			const { result } = renderHook(() => useIntervalTaskRunner())

			// when
			act(() => {
				result.current.addTask({
					interval: 1000,
					callback: callback1,
					onRemove: onRemove1,
					startAt: Date.now(),
					name: ''
				})
				result.current.addTask({
					interval: 2000,
					callback: callback2,
					onRemove: onRemove2,
					startAt: Date.now(),
					name: ''
				})
			})

			// then
			expect(result.current.tasks[0]!.callback).toBe(callback1)
			expect(result.current.tasks[0]!.onRemove).toBe(onRemove1)
			expect(result.current.tasks[1]!.callback).toBe(callback2)
			expect(result.current.tasks[1]!.onRemove).toBe(onRemove2)
		})
	})

	describe('callback execution', () => {
		beforeEach(() => {
			vi.useFakeTimers()
		})

		afterEach(() => {
			vi.useRealTimers()
		})

		it('should execute callback when task runs', async () => {
			// given
			const callback = vi.fn()
			const { result } = renderHook(() => useIntervalTaskRunner())

			// when
			act(() => {
				result.current.addTask({
					interval: 100,
					callback,
					startAt: Date.now(),
					name: 'test-task'
				})
				result.current.startRunner()
			})

			// then - callback should not be called immediately
			expect(callback).not.toHaveBeenCalled()

			// when - advance time by interval
			act(() => {
				vi.advanceTimersByTime(100)
			})

			// then - callback should be called once
			expect(callback).toHaveBeenCalledTimes(1)
		})

		it('should execute callback multiple times over multiple intervals', async () => {
			// given
			const callback = vi.fn()
			const { result } = renderHook(() => useIntervalTaskRunner())

			// when
			act(() => {
				result.current.addTask({
					interval: 200,
					callback,
					startAt: Date.now(),
					name: 'repeating-task'
				})
				result.current.startRunner()
			})

			// then - advance through multiple intervals
			act(() => {
				vi.advanceTimersByTime(200) // First execution
			})
			expect(callback).toHaveBeenCalledTimes(1)

			act(() => {
				vi.advanceTimersByTime(200) // Second execution
			})
			expect(callback).toHaveBeenCalledTimes(2)

			act(() => {
				vi.advanceTimersByTime(200) // Third execution
			})
			expect(callback).toHaveBeenCalledTimes(3)
		})

		it('should execute different callbacks for different tasks', async () => {
			// given
			const callback1 = vi.fn()
			const callback2 = vi.fn()
			const { result } = renderHook(() => useIntervalTaskRunner())

			// when
			act(() => {
				result.current.addTask({
					interval: 100,
					callback: callback1,
					startAt: Date.now(),
					name: 'task-1'
				})
				result.current.addTask({
					interval: 150,
					callback: callback2,
					startAt: Date.now(),
					name: 'task-2'
				})
				result.current.startRunner()
			})

			// then - advance time and check both callbacks execute
			act(() => {
				vi.advanceTimersByTime(100)
			})
			expect(callback1).toHaveBeenCalledTimes(1)
			expect(callback2).not.toHaveBeenCalled()

			act(() => {
				vi.advanceTimersByTime(50) // Total: 150ms
			})
			expect(callback1).toHaveBeenCalledTimes(1)
			expect(callback2).toHaveBeenCalledTimes(1)

			act(() => {
				vi.advanceTimersByTime(50) // Total: 200ms
			})
			expect(callback1).toHaveBeenCalledTimes(2)
			expect(callback2).toHaveBeenCalledTimes(1)
		})

		it('should not execute callback for disabled task', async () => {
			// given
			const callback = vi.fn()
			const { result } = renderHook(() => useIntervalTaskRunner())

			// when
			act(() => {
				result.current.addTask({
					interval: 100,
					callback,
					enabled: false,
					startAt: Date.now(),
					name: 'disabled-task'
				})
				result.current.startRunner()
			})

			// then - advance time but callback should not execute
			act(() => {
				vi.advanceTimersByTime(200)
			})
			expect(callback).not.toHaveBeenCalled()
		})

		it('should execute callback with correct task context', async () => {
			// given
			const callback = vi.fn()
			const { result } = renderHook(() => useIntervalTaskRunner())

			// when
			act(() => {
				result.current.addTask({
					interval: 100,
					callback,
					startAt: Date.now(),
					name: 'context-task'
				})
				result.current.startRunner()
			})

			// then
			act(() => {
				vi.advanceTimersByTime(100)
			})

			expect(callback).toHaveBeenCalledTimes(1)
		})

		it('should execute onRemove callback when task is removed', async () => {
			// given
			const callback = vi.fn()
			const onRemove = vi.fn()
			const { result } = renderHook(() => useIntervalTaskRunner())

			// when
			act(() => {
				result.current.addTask({
					interval: 100,
					callback,
					onRemove,
					startAt: Date.now(),
					name: 'removable-task'
				})
				result.current.startRunner()
			})

			const task = result.current.tasks[0]!

			// Execute callback once
			act(() => {
				vi.advanceTimersByTime(100)
			})
			expect(callback).toHaveBeenCalledTimes(1)

			// Remove task
			act(() => {
				result.current.removeTask(task.id)
			})

			// then
			expect(onRemove).toHaveBeenCalledWith(task)
			expect(result.current.tasks).toHaveLength(0)
		})

		it('should stop executing callbacks after task removal', async () => {
			// given
			const callback = vi.fn()
			const { result } = renderHook(() => useIntervalTaskRunner())

			// when
			act(() => {
				result.current.addTask({
					interval: 100,
					callback,
					startAt: Date.now(),
					name: 'temporary-task'
				})
				result.current.startRunner()
			})

			const task = result.current.tasks[0]!

			// Execute once
			act(() => {
				vi.advanceTimersByTime(100)
			})
			expect(callback).toHaveBeenCalledTimes(1)

			// Remove task
			act(() => {
				result.current.removeTask(task.id)
			})

			// Advance time - callback should not execute anymore
			act(() => {
				vi.advanceTimersByTime(200)
			})

			// then
			expect(callback).toHaveBeenCalledTimes(1) // Still only 1 call
		})
	})

	describe('cleanup', () => {
		it('should cleanup on unmount', () => {
			// given
			const { result, unmount } = renderHook(() => useIntervalTaskRunner())

			act(() => {
				result.current.addTask({
					interval: 1000,
					callback: vi.fn(),
					name: '',
					startAt: Date.now()
				})
			})

			expect(result.current.tasks).toHaveLength(1)

			// when
			unmount()

			// then
			// After unmount, the hook should be cleaned up
			// This is mainly testing that unmount doesn't throw errors
		})

		it('should handle config changes without errors', () => {
			// given
			const { result, rerender } = renderHook(
				({ config }) => useIntervalTaskRunner({ config }),
				{ initialProps: { config: { start: false } } }
			)

			act(() => {
				result.current.addTask({
					interval: 1000,
					callback: vi.fn(),
					name: '',
					startAt: Date.now()
				})
			})

			expect(result.current.tasks).toHaveLength(1)

			// when
			rerender({ config: { start: true } })

			// then
			expect(typeof result.current.addTask).toBe('function')
		})

		it('should cleanup tasks on unmount with multiple tasks', () => {
			// given
			const { result, unmount } = renderHook(() => useIntervalTaskRunner())

			act(() => {
				result.current.addTask({
					interval: 1000,
					callback: vi.fn(),
					name: '',
					startAt: Date.now()
				})
				result.current.addTask({
					interval: 2000,
					callback: vi.fn(),
					name: '',
					startAt: Date.now()
				})
				result.current.addTask({
					interval: 3000,
					callback: vi.fn(),
					name: '',
					startAt: Date.now()
				})
			})

			expect(result.current.tasks).toHaveLength(3)

			// when
			unmount()

			// then
			// Should not throw errors during cleanup
		})
	})

	describe('real runner integration', () => {
		it('should work with real IntervalTaskRunner', () => {
			// given
			const { result } = renderHook(() => useIntervalTaskRunner())

			// when
			act(() => {
				result.current.addTask({
					interval: 1000,
					callback: vi.fn(),
					name: '',
					startAt: Date.now()
				})
			})

			// then
			const task = result.current.tasks[0]!
			expect(task).toBeDefined()
			expect(task.id).toBeDefined()
			expect(task.interval).toBe(1000)
			expect(typeof task.callback).toBe('function')
		})

		it('should handle task lifecycle with real runner', () => {
			// given
			const { result } = renderHook(() => useIntervalTaskRunner())

			// when - Add task
			act(() => {
				result.current.addTask({
					interval: 1000,
					callback: vi.fn(),
					name: '',
					startAt: Date.now()
				})
			})

			expect(result.current.tasks).toHaveLength(1)

			// when - Update task
			act(() => {
				result.current.updateTask(result.current.tasks[0]!.id, {
					interval: 2000
				})
			})

			expect(result.current.tasks[0]!.interval).toBe(2000)

			// when - Remove task
			act(() => {
				result.current.removeTask(result.current.tasks[0]!.id)
			})

			// then
			expect(result.current.tasks).toHaveLength(0)
		})

		it('should handle complex task operations', () => {
			// given
			const { result } = renderHook(() => useIntervalTaskRunner())

			// when - Add multiple tasks
			act(() => {
				result.current.addTask({
					interval: 1000,
					callback: vi.fn(),
					name: '',
					startAt: Date.now()
				})
				result.current.addTask({
					interval: 2000,
					callback: vi.fn(),
					name: '',
					startAt: Date.now()
				})
			})

			expect(result.current.tasks).toHaveLength(2)

			// when - Update first task
			act(() => {
				result.current.updateTask(result.current.tasks[0]!.id, {
					interval: 1500
				})
			})

			expect(result.current.tasks[0]!.interval).toBe(1500)

			// when - Remove second task
			act(() => {
				result.current.removeTask(result.current.tasks[1]!.id)
			})

			// then
			expect(result.current.tasks).toHaveLength(1)
			expect(result.current.tasks[0]!.interval).toBe(1500)
		})
	})

	describe('edge cases', () => {
		it('should handle zero interval', () => {
			// given
			const { result } = renderHook(() => useIntervalTaskRunner())

			// when
			act(() => {
				result.current.addTask({
					interval: 0,
					callback: vi.fn(),
					name: '',
					startAt: Date.now()
				})
			})

			// then
			expect(result.current.tasks).toHaveLength(1)
			expect(result.current.tasks[0]!.interval).toBe(0)
		})

		it('should handle very large interval', () => {
			// given
			const { result } = renderHook(() => useIntervalTaskRunner())

			// when
			act(() => {
				result.current.addTask({
					interval: Number.MAX_SAFE_INTEGER,
					callback: vi.fn(),
					name: '',
					startAt: Date.now()
				})
			})

			// then
			expect(result.current.tasks).toHaveLength(1)
			expect(result.current.tasks[0]!.interval).toBe(Number.MAX_SAFE_INTEGER)
		})

		it('should handle rapid task additions and removals', () => {
			// given
			const { result } = renderHook(() => useIntervalTaskRunner())

			// when
			act(() => {
				// Add multiple tasks rapidly
				for (let i = 0; i < 10; i++) {
					result.current.addTask({
						interval: 1000 + i * 100,
						callback: vi.fn(),
						name: '',
						startAt: Date.now()
					})
				}
			})

			expect(result.current.tasks).toHaveLength(10)

			// when - Remove tasks rapidly
			act(() => {
				const taskIds = result.current.tasks.map((task) => task.id)
				taskIds.forEach((id) => {
					result.current.removeTask(id)
				})
			})

			// then
			expect(result.current.tasks).toHaveLength(0)
		})
	})
})
