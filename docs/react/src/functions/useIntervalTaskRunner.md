[**Taskwave API Documentation**](../../../README.md)

***

[Taskwave API Documentation](../../../modules.md) / [react/src](../README.md) / useIntervalTaskRunner

# Function: useIntervalTaskRunner()

> **useIntervalTaskRunner**(`props`): `object`

Defined in: [react/src/runners/use-interval-runner.ts:60](https://github.com/erfanezk/schedi/blob/master/packages/react/src/runners/use-interval-runner.ts#L60)

React hook for managing interval tasks that execute repeatedly at specified intervals.

This hook wraps the `IntervalTaskRunner` class to provide React-friendly task scheduling.
Tasks are automatically cleared when the component unmounts or when the config changes.

## Parameters

### props

`Props` = `DEFAULT_INTERVAL_RUNNER_PROPS`

Hook configuration options

## Returns

An object containing task management functions and the current tasks array

### startRunner()

> **startRunner**: () => `void`

Starts the runner. See [IntervalTaskRunner.start](../../../core/src/classes/IntervalTaskRunner.md#start) for details.

#### Returns

`void`

### getTask()

> **getTask**: (`taskId`) => [`IntervalTask`](../../../core/src/interfaces/IntervalTask.md)\<`unknown`\> \| `undefined`

Gets a specific task by its ID. See [IntervalTaskRunner.getTask](../../../core/src/classes/IntervalTaskRunner.md#gettask) for details.

#### Parameters

##### taskId

`string`

The unique identifier of the task

#### Returns

[`IntervalTask`](../../../core/src/interfaces/IntervalTask.md)\<`unknown`\> \| `undefined`

### clearRunner()

> **clearRunner**: () => `void`

Clears all tasks. See [IntervalTaskRunner.clear](../../../core/src/classes/IntervalTaskRunner.md#clear) for details.

Automatically clears the React state.

#### Returns

`void`

### removeTask()

> **removeTask**: (`taskId`) => `void`

Removes a task by its ID. See [IntervalTaskRunner.removeTask](../../../core/src/classes/IntervalTaskRunner.md#removetask) for details.

Automatically updates React state to remove the task.

#### Parameters

##### taskId

`string`

The unique identifier of the task to remove

#### Returns

`void`

### addTask()

> **addTask**: \<`T`\>(`taskConfig`) => [`IntervalTask`](../../../core/src/interfaces/IntervalTask.md)\<`T`\> \| `null`

Adds a new interval task. See [IntervalTaskRunner.addTask](../../../core/src/classes/IntervalTaskRunner.md#addtask) for details.

Automatically updates React state with the new task.

#### Type Parameters

##### T

`T`

#### Parameters

##### taskConfig

[`IntervalTaskCreatePayload`](../../../core/src/interfaces/IntervalTaskCreatePayload.md)\<`T`\>

#### Returns

[`IntervalTask`](../../../core/src/interfaces/IntervalTask.md)\<`T`\> \| `null`

The created interval task, or null if the runner is not initialized

### updateTask()

> **updateTask**: \<`T`\>(`taskId`, `newConfig`) => [`IntervalTask`](../../../core/src/interfaces/IntervalTask.md)\<`T`\> \| `undefined`

Updates an existing interval task. See [IntervalTaskRunner.updateTask](../../../core/src/classes/IntervalTaskRunner.md#updatetask) for details.

Automatically updates React state when a task is modified.

#### Type Parameters

##### T

`T`

#### Parameters

##### taskId

`string`

The unique identifier of the task to update

##### newConfig

`Partial`\<[`IntervalTaskCreatePayload`](../../../core/src/interfaces/IntervalTaskCreatePayload.md)\<`T`\>\>

#### Returns

[`IntervalTask`](../../../core/src/interfaces/IntervalTask.md)\<`T`\> \| `undefined`

### tasks

> **tasks**: [`IntervalTask`](../../../core/src/interfaces/IntervalTask.md)\<`unknown`\>[]

## Example

```tsx
function MyComponent() {
  const { addTask, tasks, startRunner, removeTask } = useIntervalTaskRunner({
    config: { start: true }
  });

  useEffect(() => {
    const task = addTask({
      interval: 1000,
      startAt: Date.now(),
      callback: () => console.log('Tick')
    });

    return () => {
      if (task) removeTask(task.id);
    };
  }, []);

  return <div>Tasks: {tasks.length}</div>;
}
```
