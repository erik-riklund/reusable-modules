import { it, expect } from 'bun:test'
import { TaskNotFoundError } from '../errors'
import { makeTaskManager } from '..'


const tasks = {
  hello: (input: { name: string; }) => `Hello ${ input.name }!`
};

it('should throw `TaskNotFoundError` if task is not found',
  () =>
  {
    const { executeTask } = makeTaskManager(tasks);

    // @ts-expect-error: intentionally passing a non-existent task name.
    expect(() => executeTask('nonExistentTask', {})).toThrow(TaskNotFoundError);
  }
);

it('should check if task exists',
  () =>
  {
    const { hasTask } = makeTaskManager(tasks);

    expect(hasTask('hello')).toBe(true);
    // @ts-expect-error: intentionally passing a non-existent task name.
    expect(hasTask('nonExistentTask')).toBe(false);
  }
);

it('should execute task and return the expected result',
  () =>
  {
    const { executeTask } = makeTaskManager(tasks);
    const result = executeTask('hello', { name: 'world' });

    expect(result).toBe('Hello world!');
  }
);