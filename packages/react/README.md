# @taskwave/react

React hooks for task scheduling with full TypeScript support.

## Installation

```bash
npm install @taskwave/react
# or
pnpm add @taskwave/react
# or
yarn add @taskwave/react
```

> **Note:** `@taskwave/core` is automatically installed as a dependency and doesn't need to be installed separately.

## Requirements

- React 19.0.0 or higher

## Usage

### One-Time Tasks

Schedule tasks that execute once at a specific time using the `useOneTimeTaskRunner` hook:

```typescript
import { useOneTimeTaskRunner } from '@taskwave/react'
import { useEffect } from 'react'

function MyComponent() {
  const { addTask, start, tasks } = useOneTimeTaskRunner({
    config: { start: false } // Don't auto-start
  })

  useEffect(() => {
    // Add a task that executes in 5 seconds
    addTask({
      startAt: Date.now() + 5000,
      callback: () => {
        console.log('Task executed!')
      }
    })

    // Start the runner
    start()
  }, [addTask, start])

  return <div>Tasks: {tasks.length}</div>
}
```

### Interval Tasks

Schedule tasks that execute repeatedly at a fixed interval using the `useIntervalTaskRunner` hook:

```typescript
import { useIntervalTaskRunner } from '@taskwave/react'
import { useEffect } from 'react'

function MyComponent() {
  const { addTask, startRunner, tasks, removeTask } = useIntervalTaskRunner({
    config: { start: true } // Auto-start
  })

  useEffect(() => {
    // Add a task that executes every 1 second
    const task = addTask({
      startAt: Date.now(),
      interval: 1000,
      callback: () => {
        console.log('Interval task executed!')
      }
    })

    // Remove task after 10 seconds
    setTimeout(() => {
      if (task) {
        removeTask(task.id)
      }
    }, 10000)
  }, [addTask, removeTask])

  return <div>Active tasks: {tasks.length}</div>
}
```

## API

### `useOneTimeTaskRunner`

Manages one-time tasks that execute once and are automatically removed.

#### Parameters

```typescript
interface Props {
  config: OneTimeTaskRunnerConfig // Optional runner configuration
}
```

#### Returns

```typescript
{
  tasks: OneTimeTask[]                    // Array of all tasks
  addTask: <T>(taskConfig: OneTimeTaskCreatePayload<T>) => OneTimeTask<T> | null
  updateTask: <T>(taskId: string, newConfig: Partial<OneTimeTaskCreatePayload<T>>) => OneTimeTask<T> | undefined
  removeTask: (taskId: string) => void
  clear: () => void                       // Remove all tasks
  getTask: (taskId: string) => OneTimeTask | undefined
  start: () => void                       // Start the runner
}
```

#### Example

```typescript
const { addTask, start, clear } = useOneTimeTaskRunner({
  config: { start: false }
})

// Add a task
const task = addTask({
  startAt: Date.now() + 1000,
  callback: () => console.log('Done!')
})

// Start execution
start()

// Clear all tasks
clear()
```

### `useIntervalTaskRunner`

Manages interval tasks that execute repeatedly at fixed intervals.

#### Parameters

```typescript
interface Props {
  config: IntervalTaskRunnerConfig // Optional runner configuration
}
```

#### Returns

```typescript
{
  tasks: IntervalTask[]                    // Array of all tasks
  addTask: <T>(taskConfig: IntervalTaskCreatePayload<T>) => IntervalTask<T> | null
  updateTask: <T>(taskId: string, newConfig: Partial<IntervalTaskCreatePayload<T>>) => IntervalTask<T> | undefined
  removeTask: (taskId: string) => void
  clearRunner: () => void                 // Remove all tasks
  getTask: (taskId: string) => IntervalTask | undefined
  startRunner: () => void                 // Start the runner
}
```

#### Example

```typescript
const { addTask, startRunner, removeTask } = useIntervalTaskRunner({
  config: { start: false }
})

// Add a recurring task
const task = addTask({
  startAt: Date.now(),
  interval: 2000, // Every 2 seconds
  callback: () => console.log('Tick!')
})

// Start execution
startRunner()

// Remove the task
if (task) {
  removeTask(task.id)
}
```

## Features

- ⚛️ **React Hooks** - Idiomatic React hooks API
- ⏰ **One-time tasks** - Execute tasks at a specific time
- 🔄 **Interval tasks** - Execute tasks repeatedly at fixed intervals
- 📊 **Reactive state** - Task state automatically syncs with React component state
- ⏱️ **Start/Stop control** - Start and stop task execution
- 🎯 **Task management** - Add, update, and remove tasks dynamically
- 🛡️ **TypeScript support** - Full TypeScript type definitions
- 🔄 **Auto cleanup** - Tasks are automatically cleaned up on unmount
- 📦 **Tree-shakeable** - Optimized bundle size

## License

MIT

