//
// Created by Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { it, expect } from 'bun:test'
import { createTaskManager } from 'task-manager'

// ---

it('should throw an error when the task does not exist',

  async () =>
  {
    const tasks = {
      add: (input: { a: number; b: number }) => input.a + input.b,
    };

    const executeTask = createTaskManager(tasks);
    
    // @ts-expect-error: Intentionally passing an invalid task name.
    expect(executeTask('nonExistent', { a: 1, b: 2 }))
      .rejects.toThrow('Task "nonExistent" does not exist');
  }
);