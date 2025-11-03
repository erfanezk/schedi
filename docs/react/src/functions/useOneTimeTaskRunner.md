[**Taskwave API Documentation**](../../../README.md)

***

[Taskwave API Documentation](../../../modules.md) / [react/src](../README.md) / useOneTimeTaskRunner

# Function: useOneTimeTaskRunner()

> **useOneTimeTaskRunner**(`props`): `object`

Defined in: [react/src/runners/use-one-timer-runner.ts:61](https://github.com/erfanezk/schedi/blob/master/packages/react/src/runners/use-one-timer-runner.ts#L61)

React hook for managing one-time tasks that execute once at a specified time.

This hook wraps the `OneTimeTaskRunner` class to provide React-friendly task scheduling.
Tasks are automatically cleared when the component unmounts or when the config changes.
Tasks are automatically removed after execution.

## Parameters

### props

`Props` = `DEFAULT_ONE_TIME_RUNNER_PROPS`

Hook configuration options

## Returns

An object containing task management functions and the current tasks array

### tasks

> **tasks**: [`OneTimeTask`](../../../core/src/interfaces/OneTimeTask.md)\<`unknown`\>[]

### addTask()

> **addTask**: \<`T`\>(`taskConfig`) => [`OneTimeTask`](../../../core/src/interfaces/OneTimeTask.md)\<`T`\> \| `null`

Adds a new one-time task. See [OneTimeTaskRunner.addTask](../../../core/src/classes/OneTimeTaskRunner.md#addtask) for details.

Automatically updates React state with the new task. The task will be removed from
state after execution.

#### Type Parameters

##### T

`T`

#### Parameters

##### taskConfig

[`OneTimeTaskCreatePayload`](../../../core/src/interfaces/OneTimeTaskCreatePayload.md)\<`T`\>

#### Returns

[`OneTimeTask`](../../../core/src/interfaces/OneTimeTask.md)\<`T`\> \| `null`

The created one-time task, or null if the runner is not initialized

### updateTask()

> **updateTask**: \<`T`\>(`taskId`, `newConfig`) => [`OneTimeTask`](../../../core/src/interfaces/OneTimeTask.md)\<`T`\> \| `undefined`

Updates an existing one-time task. See [OneTimeTaskRunner.updateTask](../../../core/src/classes/OneTimeTaskRunner.md#updatetask) for details.

Automatically updates React state when a task is modified.

#### Type Parameters

##### T

`T`

#### Parameters

##### taskId

`string`

The unique identifier of the task to update

##### newConfig

`Partial`\<[`OneTimeTaskCreatePayload`](../../../core/src/interfaces/OneTimeTaskCreatePayload.md)\<`T`\>\>

#### Returns

[`OneTimeTask`](../../../core/src/interfaces/OneTimeTask.md)\<`T`\> \| `undefined`

### removeTask()

> **removeTask**: (`taskId`) => `void`

Removes a task by its ID. See [OneTimeTaskRunner.removeTask](../../../core/src/classes/OneTimeTaskRunner.md#removetask) for details.

Note: Unlike the core class, this doesn't automatically update React state since
tasks are removed from state after execution via the onRemove callback.

#### Parameters

##### taskId

`string`

The unique identifier of the task to remove

#### Returns

`void`

### clear()

> **clear**: () => `void`

Clears all tasks. See [OneTimeTaskRunner.clear](../../../core/src/classes/OneTimeTaskRunner.md#clear) for details.

Automatically clears the React state.

#### Returns

`void`

### getTask()

> **getTask**: (`taskId`) => [`OneTimeTask`](../../../core/src/interfaces/OneTimeTask.md)\<`unknown`\> \| `undefined`

Gets a specific task by its ID. See [OneTimeTaskRunner.getTask](../../../core/src/classes/OneTimeTaskRunner.md#gettask) for details.

#### Parameters

##### taskId

`string`

The unique identifier of the task

#### Returns

[`OneTimeTask`](../../../core/src/interfaces/OneTimeTask.md)\<`unknown`\> \| `undefined`

### start()

> **start**: () => `void`

Starts the runner. See [OneTimeTaskRunner.start](../../../core/src/classes/OneTimeTaskRunner.md#start) for details.

#### Returns

`void`

## Example

```tsx
function MyComponent() {
  const { addTask, tasks, start, removeTask } = useOneTimeTaskRunner({
    config: { start: true }
  });

  useEffect(() => {
    const task = addTask({
      startAt: Date.now() + 5000,
      callback: () => console.log('Executed once after 5 seconds')
    });

    return () => {
      if (task) removeTask(task.id);
    };
  }, []);

  return <div>Pending tasks: {tasks.length}</div>;
}
```
