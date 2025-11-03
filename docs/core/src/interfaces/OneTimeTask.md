[**Taskwave API Documentation**](../../../README.md)

***

[Taskwave API Documentation](../../../modules.md) / [core/src](../README.md) / OneTimeTask

# Interface: OneTimeTask\<T\>

Defined in: [core/src/types/index.ts:35](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L35)

## Extends

- [`Task`](Task.md)\<`T`\>

## Type Parameters

### T

`T` = `unknown`

## Properties

### id

> **id**: `string`

Defined in: [core/src/types/index.ts:6](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L6)

#### Inherited from

[`Task`](Task.md).[`id`](Task.md#id)

***

### name?

> `optional` **name**: `string`

Defined in: [core/src/types/index.ts:7](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L7)

#### Inherited from

[`Task`](Task.md).[`name`](Task.md#name)

***

### createdAt

> **createdAt**: `number`

Defined in: [core/src/types/index.ts:8](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L8)

#### Inherited from

[`Task`](Task.md).[`createdAt`](Task.md#createdat)

***

### startAt

> **startAt**: `number`

Defined in: [core/src/types/index.ts:9](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L9)

#### Inherited from

[`Task`](Task.md).[`startAt`](Task.md#startat)

***

### expireAt

> **expireAt**: `number`

Defined in: [core/src/types/index.ts:10](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L10)

#### Inherited from

[`Task`](Task.md).[`expireAt`](Task.md#expireat)

***

### enabled

> **enabled**: [`TaskEnabled`](../type-aliases/TaskEnabled.md)

Defined in: [core/src/types/index.ts:11](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L11)

#### Inherited from

[`Task`](Task.md).[`enabled`](Task.md#enabled)

***

### callback

> **callback**: [`TaskCallback`](../type-aliases/TaskCallback.md)\<`T`\>

Defined in: [core/src/types/index.ts:13](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L13)

#### Inherited from

[`Task`](Task.md).[`callback`](Task.md#callback)

***

### onRemove()?

> `optional` **onRemove**: \<`T`\>(`task`) => `void`

Defined in: [core/src/types/index.ts:14](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L14)

#### Type Parameters

##### T

`T` *extends* [`Task`](Task.md)\<`T`\>

#### Parameters

##### task

`T`

#### Returns

`void`

#### Inherited from

[`Task`](Task.md).[`onRemove`](Task.md#onremove)
