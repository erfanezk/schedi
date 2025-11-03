[**Taskwave API Documentation**](../../../README.md)

***

[Taskwave API Documentation](../../../modules.md) / [core/src](../README.md) / IntervalTaskCreatePayload

# Interface: IntervalTaskCreatePayload\<T\>

Defined in: [core/src/types/index.ts:23](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L23)

## Type Parameters

### T

`T` = `unknown`

## Properties

### startAt

> **startAt**: `number`

Defined in: [core/src/types/index.ts:24](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L24)

***

### interval

> **interval**: `number`

Defined in: [core/src/types/index.ts:25](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L25)

***

### name?

> `optional` **name**: `string`

Defined in: [core/src/types/index.ts:26](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L26)

***

### enabled?

> `optional` **enabled**: [`TaskEnabled`](../type-aliases/TaskEnabled.md)

Defined in: [core/src/types/index.ts:27](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L27)

***

### expireAt?

> `optional` **expireAt**: `number`

Defined in: [core/src/types/index.ts:28](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L28)

***

### callback

> **callback**: [`TaskCallback`](../type-aliases/TaskCallback.md)\<`T`\>

Defined in: [core/src/types/index.ts:29](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L29)

***

### onRemove()?

> `optional` **onRemove**: \<`T`\>(`task`) => `void`

Defined in: [core/src/types/index.ts:30](https://github.com/erfanezk/schedi/blob/master/packages/core/src/types/index.ts#L30)

#### Type Parameters

##### T

`T` *extends* [`Task`](Task.md)\<`T`\>

#### Parameters

##### task

`T`

#### Returns

`void`
