//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Tasks, Store } from './types'

//
// Returns a task manager that can be used to execute the defined `tasks`.
//
export const createTaskManager = <T extends Tasks> (tasks: T) => 
{
  //
  // An object used to share data between tasks.
  //
  const data: Record<string, unknown> = {};

  //
  // A store that can be used to share data between tasks.
  //
  const store: Store =
  {
    getValue: <T> (name: string) => data[name] as T,
    setValue: (name: string, value: unknown) => data[name] = value
  }

  //
  // Executes the task `name` with the provided `input`.
  //
  return async <K extends keyof T> (name: K, input: Parameters<T[K]>[0]) =>
  {
    return await tasks[name](input, store) as ReturnType<T[K]>;
  }
}