[**Taskwave API Documentation**](../../../README.md)

***

[Taskwave API Documentation](../../../modules.md) / [core/src](../README.md) / OneTimeTaskCreatePayload

# Interface: OneTimeTaskCreatePayload\<T\>

Defined in: [core/src/types/index.ts:37](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L37)

## Type Parameters

### T

`T` = `unknown`

## Properties

### startAt

> **startAt**: `number`

Defined in: [core/src/types/index.ts:38](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L38)

***

### name?

> `optional` **name**: `string`

Defined in: [core/src/types/index.ts:39](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L39)

***

### enabled?

> `optional` **enabled**: [`TaskEnabled`](../type-aliases/TaskEnabled.md)

Defined in: [core/src/types/index.ts:40](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L40)

***

### expireAt?

> `optional` **expireAt**: `number`

Defined in: [core/src/types/index.ts:41](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L41)

***

### callback

> **callback**: [`TaskCallback`](../type-aliases/TaskCallback.md)\<`T`\>

Defined in: [core/src/types/index.ts:42](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L42)

***

### onRemove()?

> `optional` **onRemove**: \<`T`\>(`task`) => `void`

Defined in: [core/src/types/index.ts:43](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L43)

#### Type Parameters

##### T

`T` *extends* [`Task`](Task.md)\<`T`\>

#### Parameters

##### task

`T`

#### Returns

`void`
