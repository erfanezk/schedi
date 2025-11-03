[**Taskwave API Documentation**](../../../README.md)

***

[Taskwave API Documentation](../../../modules.md) / [core/src](../README.md) / BaseRunner

# Class: BaseRunner\<T\>

Defined in: [core/src/runners/base-runner.ts:18](https://github.com/erfanezk/schedi/blob/master/packages/core/src/runners/base-runner.ts#L18)

Base runner class that manages a collection of tasks.

Provides common functionality for task scheduling, including starting, stopping,
adding, removing, and updating tasks.

## Example

```ts
const runner = new BaseRunner(tasks, { start: true });
runner.start();
runner.addTask(newTask);
```

## Extended by

- [`IntervalTaskRunner`](IntervalTaskRunner.md)
- [`OneTimeTaskRunner`](OneTimeTaskRunner.md)

## Type Parameters

### T

`T` *extends* [`Task`](../interfaces/Task.md)\<`unknown`\>

The type of task this runner manages, must extend Task

## Constructors

### Constructor

> **new BaseRunner**\<`T`\>(`tasks`, `config?`): `BaseRunner`\<`T`\>

Defined in: [core/src/runners/base-runner.ts:30](https://github.com/erfanezk/schedi/blob/master/packages/core/src/runners/base-runner.ts#L30)

Creates a new BaseRunner instance.

#### Parameters

##### tasks

`T`[]

Array of tasks to manage

##### config?

[`BaseRunnerConfig`](../interfaces/BaseRunnerConfig.md)

Optional configuration object

#### Returns

`BaseRunner`\<`T`\>

## Accessors

### tasks

#### Get Signature

> **get** **tasks**(): `T`[]

Defined in: [core/src/runners/base-runner.ts:40](https://github.com/erfanezk/schedi/blob/master/packages/core/src/runners/base-runner.ts#L40)

Gets the array of all tasks managed by this runner.

##### Returns

`T`[]

Array of tasks

***

### timers

#### Get Signature

> **get** **timers**(): `Map`\<`string`, `number`\>

Defined in: [core/src/runners/base-runner.ts:49](https://github.com/erfanezk/schedi/blob/master/packages/core/src/runners/base-runner.ts#L49)

Gets the map of active timers for tasks.

##### Returns

`Map`\<`string`, `number`\>

Map of task IDs to their timer handles

***

### isRunning

#### Get Signature

> **get** **isRunning**(): `boolean`

Defined in: [core/src/runners/base-runner.ts:58](https://github.com/erfanezk/schedi/blob/master/packages/core/src/runners/base-runner.ts#L58)

Gets whether the runner is currently running.

##### Returns

`boolean`

True if the runner is running, false otherwise

#### Set Signature

> **set** **isRunning**(`value`): `void`

Defined in: [core/src/runners/base-runner.ts:67](https://github.com/erfanezk/schedi/blob/master/packages/core/src/runners/base-runner.ts#L67)

Sets whether the runner is currently running.

##### Parameters

###### value

`boolean`

True to start the runner, false to stop it

##### Returns

`void`

## Methods

### start()

> **start**(): `void`

Defined in: [core/src/runners/base-runner.ts:77](https://github.com/erfanezk/schedi/blob/master/packages/core/src/runners/base-runner.ts#L77)

Starts the runner, setting the running state to true.

Note: This method only changes the state. Subclasses should override
this method to actually start scheduling tasks.

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: [core/src/runners/base-runner.ts:87](https://github.com/erfanezk/schedi/blob/master/packages/core/src/runners/base-runner.ts#L87)

Clears all tasks and stops all active timers.

This method removes all tasks from the runner and clears
all associated timers (both timeouts and intervals).

#### Returns

`void`

***

### removeTask()

> **removeTask**(`taskId`): `void`

Defined in: [core/src/runners/base-runner.ts:102](https://github.com/erfanezk/schedi/blob/master/packages/core/src/runners/base-runner.ts#L102)

Stops a specific task by its ID.

#### Parameters

##### taskId

`string`

The unique identifier of the task to remove

#### Returns

`void`

***

### getTask()

> **getTask**(`taskId`): `T` \| `undefined`

Defined in: [core/src/runners/base-runner.ts:120](https://github.com/erfanezk/schedi/blob/master/packages/core/src/runners/base-runner.ts#L120)

Gets a specific task by its ID.

#### Parameters

##### taskId

`string`

The unique identifier of the task

#### Returns

`T` \| `undefined`

The task if found, undefined otherwise

***

### getTasks()

> **getTasks**(): `T`[]

Defined in: [core/src/runners/base-runner.ts:129](https://github.com/erfanezk/schedi/blob/master/packages/core/src/runners/base-runner.ts#L129)

Gets all tasks managed by this runner.

#### Returns

`T`[]

Array of all tasks

***

### updateTask()

> **updateTask**(`id`, `data`): `T` \| `undefined`

Defined in: [core/src/runners/base-runner.ts:140](https://github.com/erfanezk/schedi/blob/master/packages/core/src/runners/base-runner.ts#L140)

Updates a task with new data.

#### Parameters

##### id

`string`

The unique identifier of the task to update

##### data

`Partial`\<`T`\>

Partial task data to merge with the existing task

#### Returns

`T` \| `undefined`

The updated task if found, undefined otherwise

***

### isTaskEnabled()

> `protected` **isTaskEnabled**(`task`): `boolean`

Defined in: [core/src/runners/base-runner.ts:152](https://github.com/erfanezk/schedi/blob/master/packages/core/src/runners/base-runner.ts#L152)

#### Parameters

##### task

`T`

#### Returns

`boolean`

***

### isTaskForFuture()

> `protected` **isTaskForFuture**(`task`): `boolean`

Defined in: [core/src/runners/base-runner.ts:159](https://github.com/erfanezk/schedi/blob/master/packages/core/src/runners/base-runner.ts#L159)

#### Parameters

##### task

`T`

#### Returns

`boolean`

***

### canScheduleTask()

> `protected` **canScheduleTask**(`task`): `boolean`

Defined in: [core/src/runners/base-runner.ts:163](https://github.com/erfanezk/schedi/blob/master/packages/core/src/runners/base-runner.ts#L163)

#### Parameters

##### task

`T`

#### Returns

`boolean`

***

### isTaskExpired()

> `protected` **isTaskExpired**(`task`): `boolean`

Defined in: [core/src/runners/base-runner.ts:171](https://github.com/erfanezk/schedi/blob/master/packages/core/src/runners/base-runner.ts#L171)

#### Parameters

##### task

`T`

#### Returns

`boolean`

***

### addTimer()

> `protected` **addTimer**(`taskId`, `timer`): `void`

Defined in: [core/src/runners/base-runner.ts:175](https://github.com/erfanezk/schedi/blob/master/packages/core/src/runners/base-runner.ts#L175)

#### Parameters

##### taskId

`string`

##### timer

`number`

#### Returns

`void`
