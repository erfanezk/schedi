[**Taskwave API Documentation**](../../../README.md)

***

[Taskwave API Documentation](../../../modules.md) / [core/src](../README.md) / OneTimeTaskRunner

# Class: OneTimeTaskRunner

Defined in: [core/src/runners/one-time-runner.ts:30](https://github.com/erfanezk/schedi/blob/master/packages/core/src/runners/one-time-runner.ts#L30)

Runner for managing one-time tasks that execute once at a specified time.

Extends BaseRunner to provide functionality for scheduling tasks that run
only once at a specified time. Tasks are automatically removed after execution.
Tasks can be scheduled to start in the future and will automatically expire
if their expiration time is reached before execution.

## Example

```ts
const runner = new OneTimeTaskRunner();

// Add a task that runs once after 5 seconds
runner.addTask({
  startAt: Date.now() + 5000,
  callback: () => console.log('Executed once')
});

runner.start();
```

## Extends

- [`BaseRunner`](BaseRunner.md)\<[`OneTimeTask`](../interfaces/OneTimeTask.md)\>

## Constructors

### Constructor

> **new OneTimeTaskRunner**(`tasks`, `config?`): `OneTimeTaskRunner`

Defined in: [core/src/runners/one-time-runner.ts:38](https://github.com/erfanezk/schedi/blob/master/packages/core/src/runners/one-time-runner.ts#L38)

Creates a new OneTimeTaskRunner instance.

#### Parameters

##### tasks

[`OneTimeTask`](../interfaces/OneTimeTask.md)\<`unknown`\>[] = `[]`

Array of one-time tasks to manage (default: empty array)

##### config?

[`OneTimeTaskRunnerConfig`](../interfaces/OneTimeTaskRunnerConfig.md)

Optional configuration object

#### Returns

`OneTimeTaskRunner`

#### Overrides

[`BaseRunner`](BaseRunner.md).[`constructor`](BaseRunner.md#constructor)

## Accessors

### tasks

#### Get Signature

> **get** **tasks**(): `T`[]

Defined in: [core/src/runners/base-runner.ts:40](https://github.com/erfanezk/schedi/blob/master/packages/core/src/runners/base-runner.ts#L40)

Gets the array of all tasks managed by this runner.

##### Returns

`T`[]

Array of tasks

#### Inherited from

[`BaseRunner`](BaseRunner.md).[`tasks`](BaseRunner.md#tasks)

***

### timers

#### Get Signature

> **get** **timers**(): `Map`\<`string`, `number`\>

Defined in: [core/src/runners/base-runner.ts:49](https://github.com/erfanezk/schedi/blob/master/packages/core/src/runners/base-runner.ts#L49)

Gets the map of active timers for tasks.

##### Returns

`Map`\<`string`, `number`\>

Map of task IDs to their timer handles

#### Inherited from

[`BaseRunner`](BaseRunner.md).[`timers`](BaseRunner.md#timers)

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

#### Inherited from

[`BaseRunner`](BaseRunner.md).[`isRunning`](BaseRunner.md#isrunning)

## Methods

### start()

> **start**(): `void`

Defined in: [core/src/runners/one-time-runner.ts:48](https://github.com/erfanezk/schedi/blob/master/packages/core/src/runners/one-time-runner.ts#L48)

Starts the runner and schedules all existing tasks.

This method overrides the base class start method to actually schedule
tasks when starting, rather than just setting the running state.

#### Returns

`void`

#### Overrides

[`BaseRunner`](BaseRunner.md).[`start`](BaseRunner.md#start)

***

### addTask()

> **addTask**\<`T`\>(`data`): [`OneTimeTask`](../interfaces/OneTimeTask.md)\<`T`\>

Defined in: [core/src/runners/one-time-runner.ts:80](https://github.com/erfanezk/schedi/blob/master/packages/core/src/runners/one-time-runner.ts#L80)

Adds a new one-time task to the runner.

The task will be automatically assigned a unique ID and created timestamp.
If the runner is currently running, the task will be scheduled immediately.
The task will be automatically removed after execution.

#### Type Parameters

##### T

`T`

The type parameter for the task callback

#### Parameters

##### data

[`OneTimeTaskCreatePayload`](../interfaces/OneTimeTaskCreatePayload.md)\<`T`\>

The task creation payload

#### Returns

[`OneTimeTask`](../interfaces/OneTimeTask.md)\<`T`\>

The created one-time task

#### Example

```ts
const task = runner.addTask({
  startAt: Date.now() + 3000,
  callback: () => console.log('Runs once after 3 seconds')
});
```

***

### updateTask()

> **updateTask**\<`T`\>(`id`, `data`): [`OneTimeTask`](../interfaces/OneTimeTask.md)\<`T`\> \| `undefined`

Defined in: [core/src/runners/one-time-runner.ts:110](https://github.com/erfanezk/schedi/blob/master/packages/core/src/runners/one-time-runner.ts#L110)

Updates an existing one-time task.

If the task is found and updated, it will be re-scheduled with the new
configuration. The task's timer will be cleared and restarted if the runner
is currently running.

#### Type Parameters

##### T

`T`

The type parameter for the task callback

#### Parameters

##### id

`string`

The unique identifier of the task to update

##### data

`Partial`\<[`OneTimeTaskCreatePayload`](../interfaces/OneTimeTaskCreatePayload.md)\<`T`\>\>

Partial task data to merge with the existing task

#### Returns

[`OneTimeTask`](../interfaces/OneTimeTask.md)\<`T`\> \| `undefined`

The updated task if found, undefined otherwise

#### Overrides

[`BaseRunner`](BaseRunner.md).[`updateTask`](BaseRunner.md#updatetask)

***

### clear()

> **clear**(): `void`

Defined in: [core/src/runners/base-runner.ts:87](https://github.com/erfanezk/schedi/blob/master/packages/core/src/runners/base-runner.ts#L87)

Clears all tasks and stops all active timers.

This method removes all tasks from the runner and clears
all associated timers (both timeouts and intervals).

#### Returns

`void`

#### Inherited from

[`BaseRunner`](BaseRunner.md).[`clear`](BaseRunner.md#clear)

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

#### Inherited from

[`BaseRunner`](BaseRunner.md).[`removeTask`](BaseRunner.md#removetask)

***

### getTask()

> **getTask**(`taskId`): [`OneTimeTask`](../interfaces/OneTimeTask.md)\<`unknown`\> \| `undefined`

Defined in: [core/src/runners/base-runner.ts:120](https://github.com/erfanezk/schedi/blob/master/packages/core/src/runners/base-runner.ts#L120)

Gets a specific task by its ID.

#### Parameters

##### taskId

`string`

The unique identifier of the task

#### Returns

[`OneTimeTask`](../interfaces/OneTimeTask.md)\<`unknown`\> \| `undefined`

The task if found, undefined otherwise

#### Inherited from

[`BaseRunner`](BaseRunner.md).[`getTask`](BaseRunner.md#gettask)

***

### getTasks()

> **getTasks**(): [`OneTimeTask`](../interfaces/OneTimeTask.md)\<`unknown`\>[]

Defined in: [core/src/runners/base-runner.ts:129](https://github.com/erfanezk/schedi/blob/master/packages/core/src/runners/base-runner.ts#L129)

Gets all tasks managed by this runner.

#### Returns

[`OneTimeTask`](../interfaces/OneTimeTask.md)\<`unknown`\>[]

Array of all tasks

#### Inherited from

[`BaseRunner`](BaseRunner.md).[`getTasks`](BaseRunner.md#gettasks)

***

### isTaskEnabled()

> `protected` **isTaskEnabled**(`task`): `boolean`

Defined in: [core/src/runners/base-runner.ts:152](https://github.com/erfanezk/schedi/blob/master/packages/core/src/runners/base-runner.ts#L152)

#### Parameters

##### task

[`OneTimeTask`](../interfaces/OneTimeTask.md)

#### Returns

`boolean`

#### Inherited from

[`BaseRunner`](BaseRunner.md).[`isTaskEnabled`](BaseRunner.md#istaskenabled)

***

### isTaskForFuture()

> `protected` **isTaskForFuture**(`task`): `boolean`

Defined in: [core/src/runners/base-runner.ts:159](https://github.com/erfanezk/schedi/blob/master/packages/core/src/runners/base-runner.ts#L159)

#### Parameters

##### task

[`OneTimeTask`](../interfaces/OneTimeTask.md)

#### Returns

`boolean`

#### Inherited from

[`BaseRunner`](BaseRunner.md).[`isTaskForFuture`](BaseRunner.md#istaskforfuture)

***

### canScheduleTask()

> `protected` **canScheduleTask**(`task`): `boolean`

Defined in: [core/src/runners/base-runner.ts:163](https://github.com/erfanezk/schedi/blob/master/packages/core/src/runners/base-runner.ts#L163)

#### Parameters

##### task

[`OneTimeTask`](../interfaces/OneTimeTask.md)

#### Returns

`boolean`

#### Inherited from

[`BaseRunner`](BaseRunner.md).[`canScheduleTask`](BaseRunner.md#canscheduletask)

***

### isTaskExpired()

> `protected` **isTaskExpired**(`task`): `boolean`

Defined in: [core/src/runners/base-runner.ts:171](https://github.com/erfanezk/schedi/blob/master/packages/core/src/runners/base-runner.ts#L171)

#### Parameters

##### task

[`OneTimeTask`](../interfaces/OneTimeTask.md)

#### Returns

`boolean`

#### Inherited from

[`BaseRunner`](BaseRunner.md).[`isTaskExpired`](BaseRunner.md#istaskexpired)

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

#### Inherited from

[`BaseRunner`](BaseRunner.md).[`addTimer`](BaseRunner.md#addtimer)
