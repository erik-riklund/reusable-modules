//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { it, expect } from 'bun:test'
import { createTaskManager } from 'task-manager'
import type { Store } from 'task-manager/types'

// ---

it('should allow storing and retrieving values through the store',

  async () =>
  {
    const tasks =
    {
      setAndGetValue: (input: { value: string }, store: Store) =>
      {
        store.setValue('testKey', input.value);
        return store.getValue<string>('testKey');
      },
    };

    const executeTask = createTaskManager(tasks);
    const result = await executeTask('setAndGetValue', { value: 'hello' });

    expect(result).toBe('hello');
  }
);

// ---

it('should maintain state between tasks via store',

  async () =>
  {
    const tasks =
    {
      setValue: (input: { key: string; value: string }, store: Store) =>
      {
        store.setValue(input.key, input.value);
      },

      getValue: (input: { key: string }, store: Store) =>
      {
        return store.getValue<string>(input.key);
      },
    };

    const manager = createTaskManager(tasks);

    await manager('setValue', { key: 'name', value: 'John' });
    const result = await manager('getValue', { key: 'name' });

    expect(result).toBe('John');
  }
);

// ---

it('should handle different data types in store',
  async () =>
  {
    const tasks =
    {
      setMultipleValues: (_input: any, store: Store) =>
      {
        store.setValue('stringVal', 'test');
        store.setValue('numberVal', 42);
        store.setValue('booleanVal', true);
        store.setValue('arrayVal', [1, 2, 3]);
        store.setValue('objectVal', { nested: 'value' });
      },

      getMultipleValues: (_input: any, store: Store) => ({
        stringVal: store.getValue<string>('stringVal'),
        numberVal: store.getValue<number>('numberVal'),
        booleanVal: store.getValue<boolean>('booleanVal'),
        arrayVal: store.getValue<number[]>('arrayVal'),
        objectVal: store.getValue<{ nested: string }>('objectVal'),
      }),
    };

    const manager = createTaskManager(tasks);

    await manager('setMultipleValues', {});
    const result = await manager('getMultipleValues', {});

    expect(result.stringVal).toBe('test');
    expect(result.numberVal).toBe(42);
    expect(result.booleanVal).toBe(true);
    expect(result.arrayVal).toEqual([1, 2, 3]);
    expect(result.objectVal).toEqual({ nested: 'value' });
  }
);

// ---

it('should isolate store between different managers',

  async () =>
  {
    const tasks1 =
    {
      setValue: (input: { key: string; value: string }, store: any) =>
      {
        store.setValue(input.key, input.value);
      },

      getValue: (input: { key: string }, store: Store) =>
      {
        return store.getValue<string>(input.key);
      },
    };

    const tasks2 =
    {
      getValue: (input: { key: string }, store: Store) =>
      {
        return store.getValue<string>(input.key);
      },
    };

    const executeTask1 = createTaskManager(tasks1);
    const executeTask2 = createTaskManager(tasks2);

    await executeTask1('setValue', { key: 'shared', value: 'from manager 1' });
    const result1 = await executeTask1('getValue', { key: 'shared' });
    const result2 = await executeTask2('getValue', { key: 'shared' });

    expect(result1).toBe('from manager 1');
    expect(result2).toBeUndefined(); // should be undefined since `manager2` has its own store.
  }
);
