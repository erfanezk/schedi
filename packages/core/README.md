# @taskwave/core

Core scheduling functionality for JavaScript and TypeScript applications.

## Installation

```bash
npm install @taskwave/core
# or
pnpm add @taskwave/core
# or
yarn add @taskwave/core
```

## Usage

### One-Time Tasks

Schedule tasks that execute once at a specific time:

```typescript
import { OneTimeTaskRunner } from '@taskwave/core'

const runner = new OneTimeTaskRunner()

runner.addTask({
  startAt: Date.now() + 5000, // Execute in 5 seconds
  callback: () => {
    console.log('Task executed!')
  }
})

runner.start()
```

### Interval Tasks

Schedule tasks that execute repeatedly at a fixed interval:

```typescript
import { IntervalTaskRunner } from '@taskwave/core'

const runner = new IntervalTaskRunner()

runner.addTask({
  startAt: Date.now(),
  interval: 1000, // Execute every 1 second
  callback: () => {
    console.log('Interval task executed!')
  }
})

runner.start()
```

## Features

- ⏰ **One-time tasks** - Execute tasks at a specific time
- 🔄 **Interval tasks** - Execute tasks repeatedly at fixed intervals
- ⏱️ **Start/Stop control** - Start and stop task execution
- 🎯 **Task management** - Add, update, and remove tasks dynamically
- 🛡️ **TypeScript support** - Full TypeScript type definitions
- 📦 **Tree-shakeable** - Optimized bundle size

## API

### OneTimeTaskRunner

Manages one-time tasks that execute once and are removed.

```typescript
const runner = new OneTimeTaskRunner(tasks?, config?)
runner.start()
runner.addTask(payload)
runner.updateTask(id, updates)
runner.removeTask(id)
runner.clear()
```

### IntervalTaskRunner

Manages interval tasks that execute repeatedly.

```typescript
const runner = new IntervalTaskRunner(tasks?, config?)
runner.start()
runner.addTask(payload)
runner.updateTask(id, updates)
runner.removeTask(id)
runner.clear()
```

## License

MIT

