//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { it, expect } from 'bun:test'
import { createTaskManager } from 'task-manager'
import type { Store } from 'task-manager/types'

// ---

it('should work with complex task signatures',

  async () =>
  {
    type Tasks = {
      processUser: (
        input: { id: number; name: string }, store: Store) =>
        Promise<{ processed: boolean; userId: number }>;
      validateEmail: (input: { email: string }) => boolean;
    };

    const tasks: Tasks =
    {
      processUser: async (input, store) =>
      {
        store.setValue('lastProcessedId', input.id);
        return { processed: true, userId: input.id };
      },

      validateEmail: (input) =>
      {
        return input.email.includes('@');
      },
    };

    const executeTask = createTaskManager(tasks);

    const userResult = await executeTask(
      'processUser', { id: 123, name: 'Alice' }
    );
    expect(userResult).toEqual({ processed: true, userId: 123 });

    const emailResult = await executeTask(
      'validateEmail', { email: 'test@example.com' }
    );
    expect(emailResult).toBe(true);
  }
);

// ---

it('should handle complex nested objects',

  async () =>
  {
    type ComplexInput = {
      user: {
        id: number;
        profile: {
          name: string;
          preferences: {
            theme: 'light' | 'dark';
            notifications: boolean;
          };
        };
      };
    };

    type Tasks = {
      processUser: (input: ComplexInput, store: Store) => Promise<string>;
    };

    const tasks: Tasks = {
      processUser: async (input, store) =>
      {
        const { id } = input.user;
        const { name } = input.user.profile;
        store.setValue('processedUserId', id);

        return `Processed user ${name} (${id})`;
      },
    };

    const executeTask = createTaskManager(tasks);

    const result = await executeTask('processUser', {
      user: {
        id: 456,
        profile: {
          name: 'Bob',
          preferences: {
            theme: 'dark',
            notifications: true,
          },
        },
      },
    });

    expect(result).toBe('Processed user Bob (456)');
  }
);