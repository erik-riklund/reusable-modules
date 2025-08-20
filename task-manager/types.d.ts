export {};

/*
 * Copyright 2025 Erik Riklund (Gopher)
 * <https://github.com/erik-riklund>
 */

declare global
{
  namespace TaskManager
  {
    /**
     * Represents a task manager that can execute tasks synchronously.
     *
     * @param name - The name of the task to execute.
     * @param input - The input to pass to the task.
     * @returns The result of the task.
     */
    type Instance<T extends TaskMap> =
      <K extends keyof T>(name: K, input: Parameters<T[K]>[0]) => ReturnType<T[K]>;

    /**
     * Represents a map of task names to their corresponding function types.
     */
    type TaskMap = { [K in string]: (input: any) => any; };
  }
}