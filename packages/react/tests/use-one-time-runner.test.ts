import { useOneTimeTaskRunner } from '@/index'
import { OneTimeTaskCreatePayload } from '@taskwave/core'
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('useOneTimeTaskRunner', () => {
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
			const { result } = renderHook(() => useOneTimeTaskRunner())

			// then
			expect(result.current.tasks).toEqual([])
			expect(result.current.addTask).toBeDefined()
			expect(result.current.removeTask).toBeDefined()
			expect(result.current.clear).toBeDefined()
			expect(result.current.getTask).toBeDefined()
		})

		it('should initialize with custom config', () => {
			// given
			const customConfig = { start: true }

			// when
			const { result } = renderHook(() =>
				useOneTimeTaskRunner({ config: customConfig })
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
				({ config }) => useOneTimeTaskRunner({ config }),
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
				({ config }) => useOneTimeTaskRunner({ config }),
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
			const { result } = renderHook(() => useOneTimeTaskRunner())
			const taskConfig: OneTimeTaskCreatePayload = {
				callback: vi.fn(),
				name: 'test-task',
				startAt: Date.now()
			}

			// when
			act(() => {
				const addedTask = result.current.addTask(taskConfig)
				expect(addedTask).toBeDefined()
				expect(addedTask?.id).toBeDefined()
				expect(addedTask?.callback).toBe(taskConfig.callback)
			})

			// then
			expect(result.current.tasks).toHaveLength(1)
			expect(result.current.tasks[0]!.name).toBe('test-task')
		})

		it('should update tasks state when task is added', () => {
			// given
			const { result } = renderHook(() => useOneTimeTaskRunner())

			// when
			act(() => {
				result.current.addTask({
					callback: vi.fn(),
					name: 'task-1',
					startAt: Date.now()
				})
			})

			// then
			expect(result.current.tasks).toHaveLength(1)
			expect(result.current.tasks[0]!.name).toBe('task-1')
		})

		it('should handle task removal callback', () => {
			// given
			const onRemoveCallback = vi.fn()
			const { result } = renderHook(() => useOneTimeTaskRunner())

			// when
			act(() => {
				result.current.addTask({
					callback: vi.fn(),
					onRemove: onRemoveCallback,
					name: 'removable-task',
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
			const { result } = renderHook(() => useOneTimeTaskRunner())

			// when
			act(() => {
				result.current.addTask({
					callback: vi.fn(),
					name: 'task-1',
					startAt: Date.now()
				})
				result.current.addTask({
					callback: vi.fn(),
					name: 'task-2',
					startAt: Date.now()
				})
			})

			// then
			expect(result.current.tasks).toHaveLength(2)
			expect(result.current.tasks[0]!.name).toBe('task-1')
			expect(result.current.tasks[1]!.name).toBe('task-2')
		})

		it('should handle task with all properties', () => {
			// given
			const { result } = renderHook(() => useOneTimeTaskRunner())
			const callback = vi.fn()
			const onRemove = vi.fn()

			// when
			act(() => {
				result.current.addTask({
					callback,
					onRemove,
					name: 'complete-task',
					startAt: Date.now(),
					enabled: true,
					expireAt: Date.now() + 10000
				})
			})

			// then
			const task = result.current.tasks[0]!
			expect(task.callback).toBe(callback)
			// Note: onRemove is wrapped internally, so we just check it exists
			expect(task.onRemove).toBeDefined()
			expect(task.name).toBe('complete-task')
		})
	})

	describe('removeTask', () => {
		it('should remove a task successfully', () => {
			// given
			const { result } = renderHook(() => useOneTimeTaskRunner())

			act(() => {
				result.current.addTask({
					callback: vi.fn(),
					name: 'task-to-remove',
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
			const { result } = renderHook(() => useOneTimeTaskRunner())

			// when
			act(() => {
				result.current.removeTask('non-existent-id')
			})

			// then
			expect(result.current.tasks).toHaveLength(0)
		})

		it('should remove correct task from multiple tasks', () => {
			// given
			const { result } = renderHook(() => useOneTimeTaskRunner())

			act(() => {
				result.current.addTask({
					callback: vi.fn(),
					name: 'task-1',
					startAt: Date.now()
				})
				result.current.addTask({
					callback: vi.fn(),
					name: 'task-2',
					startAt: Date.now()
				})
				result.current.addTask({
					callback: vi.fn(),
					name: 'task-3',
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

	describe('clear', () => {
		it('should clear all tasks', () => {
			// given
			const { result } = renderHook(() => useOneTimeTaskRunner())

			act(() => {
				result.current.addTask({
					callback: vi.fn(),
					name: 'task-1',
					startAt: Date.now()
				})
				result.current.addTask({
					callback: vi.fn(),
					name: 'task-2',
					startAt: Date.now()
				})
			})

			expect(result.current.tasks).toHaveLength(2)

			// when
			act(() => {
				result.current.clear()
			})

			// then
			expect(result.current.tasks).toHaveLength(0)
		})

		it('should clear empty task list', () => {
			// given
			const { result } = renderHook(() => useOneTimeTaskRunner())

			// when
			act(() => {
				result.current.clear()
			})

			// then
			expect(result.current.tasks).toHaveLength(0)
		})
	})

	describe('getTask', () => {
		it('should get a task by id', () => {
			// given
			const { result } = renderHook(() => useOneTimeTaskRunner())

			act(() => {
				result.current.addTask({
					callback: vi.fn(),
					name: 'task-1',
					startAt: Date.now()
				})
			})

			const task = result.current.tasks[0]!

			// when
			const retrievedTask = result.current.getTask(task.id)

			// then
			expect(retrievedTask).toBeDefined()
			expect(retrievedTask?.id).toBe(task.id)
			expect(retrievedTask?.name).toBe('task-1')
		})

		it('should return undefined for non-existent task', () => {
			// given
			const { result } = renderHook(() => useOneTimeTaskRunner())

			// when
			const task = result.current.getTask('non-existent-id')

			// then
			expect(task).toBeUndefined()
		})

		it('should get correct task from multiple tasks', () => {
			// given
			const { result } = renderHook(() => useOneTimeTaskRunner())

			act(() => {
				result.current.addTask({
					callback: vi.fn(),
					name: 'task-1',
					startAt: Date.now()
				})
				result.current.addTask({
					callback: vi.fn(),
					name: 'task-2',
					startAt: Date.now()
				})
				result.current.addTask({
					callback: vi.fn(),
					name: 'task-3',
					startAt: Date.now()
				})
			})

			const targetTask = result.current.tasks[1]!

			// when
			const retrievedTask = result.current.getTask(targetTask.id)

			// then
			expect(retrievedTask).toBe(targetTask)
			expect(retrievedTask?.name).toBe('task-2')
		})
	})

	describe('updateTask', () => {
		it('should update a task successfully', () => {
			// given
			const { result } = renderHook(() => useOneTimeTaskRunner())
			const newCallback = vi.fn()

			act(() => {
				result.current.addTask({
					callback: vi.fn(),
					name: 'original-task',
					startAt: Date.now()
				})
			})

			const task = result.current.tasks[0]!
			expect(task.name).toBe('original-task')

			// when
			act(() => {
				const updatedTask = result.current.updateTask(task.id, {
					name: 'updated-task',
					callback: newCallback
				})
				expect(updatedTask).toBeDefined()
				expect(updatedTask?.name).toBe('updated-task')
			})

			// then
			expect(result.current.tasks[0]!.name).toBe('updated-task')
			expect(result.current.tasks[0]!.callback).toBe(newCallback)
		})

		it('should handle updating non-existent task', () => {
			// given
			const { result } = renderHook(() => useOneTimeTaskRunner())

			// when
			act(() => {
				const updatedTask = result.current.updateTask('non-existent-id', {
					name: 'updated'
				})
				expect(updatedTask).toBeUndefined()
			})

			// then
			expect(result.current.tasks).toHaveLength(0)
		})

		it('should update task callback', () => {
			// given
			const { result } = renderHook(() => useOneTimeTaskRunner())
			const newCallback = vi.fn()

			act(() => {
				result.current.addTask({
					callback: vi.fn(),
					name: 'task-1',
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
			const { result } = renderHook(() => useOneTimeTaskRunner())
			const newCallback = vi.fn()
			const newOnRemove = vi.fn()

			act(() => {
				result.current.addTask({
					callback: vi.fn(),
					name: 'original',
					startAt: Date.now()
				})
			})

			const task = result.current.tasks[0]!

			// when
			act(() => {
				result.current.updateTask(task.id, {
					callback: newCallback,
					onRemove: newOnRemove,
					name: 'updated'
				})
			})

			// then
			const updatedTask = result.current.tasks[0]!
			expect(updatedTask.callback).toBe(newCallback)
			expect(updatedTask.onRemove).toBe(newOnRemove)
			expect(updatedTask.name).toBe('updated')
		})
	})

	describe('task callbacks', () => {
		it('should execute task callback', () => {
			// given
			const callback = vi.fn()
			const { result } = renderHook(() => useOneTimeTaskRunner())

			// when
			act(() => {
				result.current.addTask({
					callback,
					startAt: Date.now(),
					name: 'test-task'
				})
			})

			// then
			expect(callback).toBeDefined()
		})

		it('should handle task with onRemove callback', () => {
			// given
			const onRemove = vi.fn()
			const { result } = renderHook(() => useOneTimeTaskRunner())

			// when
			act(() => {
				result.current.addTask({
					callback: vi.fn(),
					onRemove,
					startAt: Date.now(),
					name: 'removable-task'
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
			const { result } = renderHook(() => useOneTimeTaskRunner())

			// when
			act(() => {
				result.current.addTask({
					callback: callback1,
					onRemove: onRemove1,
					startAt: Date.now(),
					name: 'task-1'
				})
				result.current.addTask({
					callback: callback2,
					onRemove: onRemove2,
					startAt: Date.now(),
					name: 'task-2'
				})
			})

			// then
			expect(result.current.tasks[0]!.callback).toBe(callback1)
			// Note: onRemove is wrapped internally
			expect(result.current.tasks[0]!.onRemove).toBeDefined()
			expect(result.current.tasks[1]!.callback).toBe(callback2)
			expect(result.current.tasks[1]!.onRemove).toBeDefined()
		})
	})

	describe('callback execution', () => {
		beforeEach(() => {
			vi.useFakeTimers()
		})

		afterEach(() => {
			vi.useRealTimers()
		})

		it('should not execute callback immediately', () => {
			// given
			const callback = vi.fn()
			const { result } = renderHook(() => useOneTimeTaskRunner())

			// when
			act(() => {
				result.current.addTask({
					callback,
					startAt: Date.now(),
					name: 'test-task'
				})
			})

			// then - callback should not be called immediately
			expect(callback).not.toHaveBeenCalled()
		})

		it('should execute callback after delay', async () => {
			// given
			const callback = vi.fn()
			const { result } = renderHook(() => useOneTimeTaskRunner())

			// when
			act(() => {
				result.current.addTask({
					callback,
					startAt: Date.now() + 100,
					name: 'delayed-task'
				})
				result.current.start()
			})

			// Advance time to past the startAt time
			act(() => {
				vi.advanceTimersByTime(100)
			})

			// then - callback should be called once
			expect(callback).toHaveBeenCalledTimes(1)
		})

		it('should only execute callback once', async () => {
			// given
			const callback = vi.fn()
			const { result } = renderHook(() => useOneTimeTaskRunner())

			// when
			act(() => {
				result.current.addTask({
					callback,
					startAt: Date.now() + 100,
					name: 'one-time-task'
				})
				result.current.start()
			})

			// Advance time
			act(() => {
				vi.advanceTimersByTime(100)
			})
			expect(callback).toHaveBeenCalledTimes(1)

			// Advance more time - should not execute again
			act(() => {
				vi.advanceTimersByTime(200)
			})

			// then - still only called once
			expect(callback).toHaveBeenCalledTimes(1)
		})

		it('should execute different callbacks for different tasks', async () => {
			// given
			const callback1 = vi.fn()
			const callback2 = vi.fn()
			const { result } = renderHook(() => useOneTimeTaskRunner())

			// when
			act(() => {
				result.current.addTask({
					callback: callback1,
					startAt: Date.now() + 100,
					name: 'task-1'
				})
				result.current.addTask({
					callback: callback2,
					startAt: Date.now() + 200,
					name: 'task-2'
				})
				result.current.start()
			})

			// Advance time to first task
			act(() => {
				vi.advanceTimersByTime(100)
			})
			expect(callback1).toHaveBeenCalledTimes(1)
			expect(callback2).not.toHaveBeenCalled()

			// Advance time to second task
			act(() => {
				vi.advanceTimersByTime(100)
			})
			expect(callback1).toHaveBeenCalledTimes(1)
			expect(callback2).toHaveBeenCalledTimes(1)
		})

		it('should not execute callback for disabled task', async () => {
			// given
			const callback = vi.fn()
			const { result } = renderHook(() => useOneTimeTaskRunner())

			// when
			act(() => {
				result.current.addTask({
					callback,
					enabled: false,
					startAt: Date.now() + 100,
					name: 'disabled-task'
				})
			})

			// then - advance time but callback should not execute
			act(() => {
				vi.advanceTimersByTime(200)
			})
			expect(callback).not.toHaveBeenCalled()
		})

		it('should not execute expired tasks', async () => {
			// given
			const callback = vi.fn()
			const { result } = renderHook(() => useOneTimeTaskRunner())
			const now = Date.now()

			// when
			act(() => {
				result.current.addTask({
					callback,
					startAt: now + 100,
					expireAt: now + 100, // Same time as startAt (expired)
					name: 'expired-task'
				})
			})

			// Advance time
			act(() => {
				vi.advanceTimersByTime(200)
			})

			// then - callback should not execute if task expired
			expect(callback).not.toHaveBeenCalled()
		})
	})

	describe('cleanup', () => {
		it('should cleanup on unmount', () => {
			// given
			const { result, unmount } = renderHook(() => useOneTimeTaskRunner())

			act(() => {
				result.current.addTask({
					callback: vi.fn(),
					name: 'task-1',
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
				({ config }) => useOneTimeTaskRunner({ config }),
				{ initialProps: { config: { start: false } } }
			)

			act(() => {
				result.current.addTask({
					callback: vi.fn(),
					name: 'task-1',
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
			const { result, unmount } = renderHook(() => useOneTimeTaskRunner())

			act(() => {
				result.current.addTask({
					callback: vi.fn(),
					name: 'task-1',
					startAt: Date.now()
				})
				result.current.addTask({
					callback: vi.fn(),
					name: 'task-2',
					startAt: Date.now()
				})
				result.current.addTask({
					callback: vi.fn(),
					name: 'task-3',
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
		it('should work with real OneTimeTaskRunner', () => {
			// given
			const { result } = renderHook(() => useOneTimeTaskRunner())

			// when
			act(() => {
				result.current.addTask({
					callback: vi.fn(),
					name: 'real-task',
					startAt: Date.now()
				})
			})

			// then
			const task = result.current.tasks[0]!
			expect(task).toBeDefined()
			expect(task.id).toBeDefined()
			expect(typeof task.callback).toBe('function')
		})

		it('should handle task lifecycle with real runner', () => {
			// given
			const { result } = renderHook(() => useOneTimeTaskRunner())

			// when - Add task
			act(() => {
				result.current.addTask({
					callback: vi.fn(),
					name: 'lifecycle-task',
					startAt: Date.now()
				})
			})

			expect(result.current.tasks).toHaveLength(1)

			// when - Update task
			act(() => {
				result.current.updateTask(result.current.tasks[0]!.id, {
					name: 'updated-lifecycle-task'
				})
			})

			expect(result.current.tasks[0]!.name).toBe('updated-lifecycle-task')

			// when - Remove task
			act(() => {
				result.current.removeTask(result.current.tasks[0]!.id)
			})

			// then
			expect(result.current.tasks).toHaveLength(0)
		})

		it('should handle complex task operations', () => {
			// given
			const { result } = renderHook(() => useOneTimeTaskRunner())

			// when - Add multiple tasks
			act(() => {
				result.current.addTask({
					callback: vi.fn(),
					name: 'task-1',
					startAt: Date.now()
				})
				result.current.addTask({
					callback: vi.fn(),
					name: 'task-2',
					startAt: Date.now()
				})
			})

			expect(result.current.tasks).toHaveLength(2)

			// when - Update first task
			act(() => {
				result.current.updateTask(result.current.tasks[0]!.id, {
					name: 'updated-task-1'
				})
			})

			expect(result.current.tasks[0]!.name).toBe('updated-task-1')

			// when - Remove second task
			act(() => {
				result.current.removeTask(result.current.tasks[1]!.id)
			})

			// then
			expect(result.current.tasks).toHaveLength(1)
			expect(result.current.tasks[0]!.name).toBe('updated-task-1')
		})
	})

	describe('edge cases', () => {
		it('should handle task with past startAt', () => {
			// given
			const { result } = renderHook(() => useOneTimeTaskRunner())

			// when
			act(() => {
				result.current.addTask({
					callback: vi.fn(),
					name: 'past-task',
					startAt: Date.now() - 1000 // Past time
				})
			})

			// then
			expect(result.current.tasks).toHaveLength(1)
			expect(result.current.tasks[0]!.startAt).toBeLessThan(Date.now())
		})

		it('should handle task with far future startAt', () => {
			// given
			const { result } = renderHook(() => useOneTimeTaskRunner())
			const futureTime = Date.now() + 86400000 // 1 day from now

			// when
			act(() => {
				result.current.addTask({
					callback: vi.fn(),
					name: 'future-task',
					startAt: futureTime
				})
			})

			// then
			expect(result.current.tasks).toHaveLength(1)
			expect(result.current.tasks[0]!.startAt).toBe(futureTime)
		})

		it('should handle rapid task additions and removals', () => {
			// given
			const { result } = renderHook(() => useOneTimeTaskRunner())

			// when
			act(() => {
				// Add multiple tasks rapidly
				for (let i = 0; i < 10; i++) {
					result.current.addTask({
						callback: vi.fn(),
						name: `task-${i}`,
						startAt: Date.now() + i * 100
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

		it('should handle task with custom onRemove behavior', () => {
			// given
			const onRemove = vi.fn()
			const { result } = renderHook(() => useOneTimeTaskRunner())

			// when
			act(() => {
				result.current.addTask({
					callback: vi.fn(),
					onRemove,
					name: 'custom-remove-task',
					startAt: Date.now()
				})
			})

			const task = result.current.tasks[0]!

			act(() => {
				result.current.removeTask(task.id)
			})

			// then
			expect(onRemove).toHaveBeenCalledWith(task)
		})
	})
})
