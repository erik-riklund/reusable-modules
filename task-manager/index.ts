/*
 * Copyright 2025 Erik Riklund (Gopher)
 * <https://github.com/erik-riklund>
 */

import { TaskNotFoundError } from './errors'

/**
 * Creates a task manager that can execute tasks synchronously or asynchronously.
 *
 * @param tasks - An object containing task names as keys and their corresponding functions as values.
 * @returns A task manager object with methods to execute tasks.
 */
export const makeTaskManager = <T extends TaskManager.TaskMap> (tasks: T) =>
{
  /**
   * The store object used to pass data between tasks.
   */
  const store: Record<string, unknown> = {};

  /**
   * Checks if a task with the given name exists in the task map.
   *
   * @param name - The name of the task to check.
   * @returns A boolean indicating whether the task exists.
   */
  const hasTask = (name: keyof T) => name in tasks;

  /**
   * Executes a task with the given name and input.
   *
   * @param name - The name of the task to execute.
   * @param input - The input to pass to the task function.
   * @returns The result of the task function.
   */
  const executeTask: TaskManager.Instance<T> = (name, input) =>
  {
    if (!hasTask(name))
    {
      throw new TaskNotFoundError(String(name));
    }

    return tasks[name](input);
  }

  /**
   * Retrieve a value of type `T` from the store.
   * 
   * @param key - The key of the value to retrieve.
   * @returns The value of type `T` associated with the given key.
   */
  const getStoreValue = <T> (key: string) => store[key] as T;

  /**
   * Set a value in the store.
   * 
   * @param key - The key of the value to set.
   * @param value - The value to set in the store.
   */
  const setStoreValue = (key: string, value: unknown) => store[key] = value;

  /**
   * Returns a task manager object with methods to execute tasks.
   */
  return { executeTask, hasTask, getStoreValue, setStoreValue } as const;
};

/**
 * Ensures type safety for task input and output types.
 */
export const defineTask = <I, R> (task: (input: I) => R) => task;