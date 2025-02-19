# **Schedi**

🚀 **A lightweight and flexible task scheduling library for JavaScript & TypeScript.**  
Effortlessly manage **interval-based** and **one-time** tasks with precision and reliability.

## **Overview**

Schedi provides a simple yet powerful solution for handling scheduled tasks in JavaScript and TypeScript
applications.

### **Key Features**

✅ **Interval-based task execution** – Run tasks at fixed intervals seamlessly.  
✅ **One-time scheduled tasks** – Schedule tasks to execute once at a specific time.  
✅ **Automatic task management** – Add, remove, start, and stop tasks dynamically.  
✅ **Minimal and efficient** – Designed for optimal performance with minimal overhead.

## **Installation**

Install schedi via npm:

```sh
npm install schedi
```

## Import

### ES Modules

When using ESM:

```typescript
import { IntervalTaskRunner, OneTimeTaskRunner } from 'schedi';
```

### CommonJS

When using CJS:

```typescript
const { IntervalTaskRunner, OneTimeTaskRunner } = require('schedi');
```

### Browser

When using browser, include the script tag:

```html
<script src="schedi.iife.js"></script>
<script>
  const { IntervalTaskRunner, OneTimeTaskRunner } = schedi;
</script>
```

## **Usage**

### **1. Managing Interval-Based Tasks** (`IntervalTaskRunner`)

The `IntervalTaskRunner` schedules tasks to execute repeatedly at a fixed interval.

```typescript
import { IntervalTaskRunner } from 'schedi';

// Initialize the task runner
const intervalTaskRunner = new IntervalTaskRunner([]);

// Start executing tasks
const stopTasks = intervalTaskRunner.start();

// Add a repeating task that runs every 5 seconds
const task = intervalTaskRunner.addTask({
  interval: 5000,
  callback: () => console.log('Repeating task executed'),
  enabled: true,
});

// Remove a specific task
intervalTaskRunner.removeTask(task.id);

// Stop all running tasks
stopTasks();
```

### **2. Managing One-Time Tasks** (`OneTimeTaskRunner`)

The `OneTimeTaskRunner` schedules tasks to execute once at a predetermined time.

```typescript
import { OneTimeTaskRunner } from 'schedi';

// Initialize the task runner
const oneTimeRunner = new OneTimeTaskRunner([]);

// Start executing scheduled tasks
const stopOneTimeTasks = oneTimeRunner.start();

// Schedule a one-time task to run in 10 seconds
const task = oneTimeRunner.addTask({
  startAt: Date.now() + 10000, // 10 seconds from now
  callback: () => console.log('One-time task executed'),
  enabled: true,
});

// Remove a scheduled task before execution
oneTimeRunner.removeTask(task.id);

// Stop all scheduled one-time tasks
stopOneTimeTasks();
```

## **Task Creation Configuration**

When adding a task using the `addTask` method, you need to provide a configuration object. Below are the required
properties for both `IntervalTaskRunner` and `OneTimeTaskRunner`.

### **One-Time Task Creation**

This configuration is used when adding a **one-time task**.

| Property   | Type                  | Required | Description                                                                                       |
| ---------- | --------------------- | -------- | ------------------------------------------------------------------------------------------------- |
| `name`     | `string`              | ✅       | Optional name for the task.                                                                       |
| `callback` | `Function`            | ✅       | Function to execute when the task runs.                                                           |
| `startAt`  | `number`              | ✅       | Timestamp (in ms) when the task should run.                                                       |
| `expireAt` | `number`              | ❌       | Timestamp (in ms) when the task expires (task won't execute after this time).                     |
| `enabled`  | `boolean \| Function` | ❌       | Indicates if the task is active (**can be `true`/`false` or a function that returns a boolean**). |

## **Interval Task Configuration**

This configuration is used when adding an **interval task**.

### **🔹 Configuration Properties**

| Property   | Type                  | Required | Description                                                                                       |
| ---------- | --------------------- | -------- | ------------------------------------------------------------------------------------------------- |
| `name`     | `string`              | ✅       | Optional name for the task.                                                                       |
| `callback` | `Function`            | ✅       | Function to execute on each interval.                                                             |
| `startAt`  | `number`              | ✅       | Timestamp (in ms) when the task should start.                                                     |
| `interval` | `number`              | ✅       | Time interval (in ms) between executions.                                                         |
| `expireAt` | `number`              | ❌       | Timestamp (in ms) when the task expires (task won't execute after this time).                     |
| `enabled`  | `boolean \| Function` | ❌       | Indicates if the task is active (**can be `true`/`false` or a function that returns a boolean**). |

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch.
3. Make your changes and commit them.
4. Submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
