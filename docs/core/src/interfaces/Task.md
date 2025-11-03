[**Taskwave API Documentation**](../../../README.md)

***

[Taskwave API Documentation](../../../modules.md) / [core/src](../README.md) / Task

# Interface: Task\<T\>

Defined in: [core/src/types/index.ts:5](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L5)

## Extended by

- [`IntervalTask`](IntervalTask.md)
- [`OneTimeTask`](OneTimeTask.md)

## Type Parameters

### T

`T` = `unknown`

## Properties

### id

> **id**: `string`

Defined in: [core/src/types/index.ts:6](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L6)

***

### name?

> `optional` **name**: `string`

Defined in: [core/src/types/index.ts:7](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L7)

***

### createdAt

> **createdAt**: `number`

Defined in: [core/src/types/index.ts:8](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L8)

***

### startAt

> **startAt**: `number`

Defined in: [core/src/types/index.ts:9](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L9)

***

### expireAt

> **expireAt**: `number`

Defined in: [core/src/types/index.ts:10](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L10)

***

### enabled

> **enabled**: [`TaskEnabled`](../type-aliases/TaskEnabled.md)

Defined in: [core/src/types/index.ts:11](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L11)

***

### callback

> **callback**: [`TaskCallback`](../type-aliases/TaskCallback.md)\<`T`\>

Defined in: [core/src/types/index.ts:13](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L13)

***

### onRemove()?

> `optional` **onRemove**: \<`T`\>(`task`) => `void`

Defined in: [core/src/types/index.ts:14](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L14)

#### Type Parameters

##### T

`T` *extends* `Task`\<`T`\>

#### Parameters

##### task

`T`

#### Returns

`void`
