# Schedulify

**A lightweight and flexible task scheduling library for JavaScript & TypeScript.**  
Easily manage **interval-based** and **one-time** tasks with precise execution control. 🚀

## Introduction

This project provides two task management utilities:

- **IntervalTaskRunner**: Manages interval-based tasks that execute repeatedly at a fixed time interval.
- **OneTimeTaskRunner**: Manages one-time tasks that execute once at a scheduled time and are then removed.

These classes are useful for automating scheduled task execution without manual intervention.

## Installation

```sh
npm install schedulify
```

## Usage

### Using IntervalTaskRunner

```typescript
import { IntervalTaskRunner } from 'schedulify';

const intervalTaskRunner = new IntervalTaskRunner([]);
const stopTasks = intervalTaskRunner.start();

const task = intervalTaskRunner.addTask({
  interval: 5000,
  callback: () => console.log('Task executed'),
  enabled: true,
});

// To remove a task
// taskRunner.removeTask(task.id);

// To stop all tasks
// taskRunner.stopTasks();
```

### Using OneTimeTaskRunner

```typescript
import { OneTimeTaskRunner } from 'schedulify';

const oneTimeRunner = new OneTimeTaskRunner([]);
const stopOneTimeTasks = oneTimeRunner.start();

const task = oneTimeRunner.addTask({
  startAt: Date.now() + 10000, // 10 seconds later
  callback: () => console.log('One-time task executed'),
  enabled: true,
});

// To remove a task
// oneTimeRunner.removeTask(task.id);

// To stop all scheduled tasks
// oneTimeRunner.stopOneTimeTasks();
```

## Configuration

- `interval`: The time interval (in milliseconds) for repeating tasks.
- `startAt`: The scheduled execution time for one-time tasks.
- `callback`: The function to be executed when the task runs.
- `enabled`: A flag indicating whether the task should be executed.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch.
3. Make your changes and commit them.
4. Submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Future Improvements

- Support for pausing and resuming tasks.
- Enhanced logging and monitoring.
- **Persistent Task Storage**: Implement IndexedDB to store tasks and maintain state across page reloads or application
  restarts.
