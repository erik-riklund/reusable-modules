//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { it, expect } from 'bun:test'
import { createTaskManager } from 'task-manager'

// ---

it('should create a task manager with valid tasks',

  () =>
  {
    const tasks = {
      add: (input: { a: number; b: number }) => input.a + input.b,
    };

    const executeTask = createTaskManager(tasks);
    expect(executeTask).toBeInstanceOf(Function);
  }
);

// ---

it('should execute a simple task successfully',

  async () =>
  {
    const tasks = {
      add: (input: { a: number; b: number }) => input.a + input.b,
    };

    const executeTask = createTaskManager(tasks);
    const result = await executeTask('add', { a: 5, b: 3 });

    expect(result).toBe(8);
  }
);

// ---

it('should handle tasks with no input',

  async () =>
  {
    const tasks = {
      getConstant: (_input: void) => 42,
    };

    const executeTask = createTaskManager(tasks);
    const result = await executeTask('getConstant', undefined);

    expect(result).toBe(42);
  }
);

// ---

it('should handle async tasks properly',

  async () =>
  {
    const tasks =
    {
      delayedAdd: async (input: { a: number; b: number }) =>
      {
        await new Promise(resolve => setTimeout(resolve, 1));
        return input.a + input.b;
      },
    };

    const executeTask = createTaskManager(tasks);
    const result = await executeTask('delayedAdd', { a: 10, b: 5 });

    expect(result).toBe(15);
  }
);

// ---

it('should handle concurrent task executions',

  async () =>
  {
    const tasks =
    {
      slowTask: async (input: { delay: number }) =>
      {
        await new Promise(resolve => setTimeout(resolve, input.delay));
        return input.delay;
      },
    };

    const executeTask = createTaskManager(tasks);

    const start = Date.now();
    const promises = [
      executeTask('slowTask', { delay: 10 }),
      executeTask('slowTask', { delay: 15 }),
      executeTask('slowTask', { delay: 5 }),
    ];

    const results = await Promise.all(promises);
    const end = Date.now();

    expect(results).toEqual([10, 15, 5]);
    expect(end - start).toBeLessThan(50); // Should complete in less than 50ms
  }
);

// ---

it('should handle large numbers of tasks',

  async () =>
  {
    const tasks: Record<string, (input: any, store: any) => number> = {};

    for (let i = 0; i < 100; i++)
    {
      tasks[`task${i}`] = (input) => i + (input?.offset || 0);
    }

    const executeTask = createTaskManager(tasks);

    const results = [];
    for (let i = 0; i < 100; i++)
    {
      const result = await executeTask(`task${i}`, { offset: 10 });
      results.push(result);
    }

    expect(results).toEqual(Array.from({ length: 100 }, (_, i) => i + 10));
  }
);