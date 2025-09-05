//
// Created by Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { it, expect } from 'bun:test'
import { createTaskManager } from 'task-manager'

// ---

it('should handle an empty tasks object',

  async () =>
  {
    const tasks = {};
    const executeTask = createTaskManager(tasks);

    // @ts-expect-error: Intentionally passing an invalid task name.
    expect(executeTask('anything', {})).rejects.toThrow('Task "anything" does not exist');
  }
);

// ---

it('should handle null and undefined inputs gracefully',

  async () =>
  {
    const tasks = {
      handleNull: (input: null) => 'null handled',
      handleUndefined: (input: undefined) => 'undefined handled',
    };

    const executeTask = createTaskManager(tasks);

    const nullResult = await executeTask('handleNull', null);
    expect(nullResult).toBe('null handled');

    const undefinedResult = await executeTask('handleUndefined', undefined);
    expect(undefinedResult).toBe('undefined handled');
  }
);
