//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Store } from './types'

//
// Returns a task manager that can be used to execute the defined `tasks`.
//
export const createTaskManager = <T> (tasks: T) => 
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
  return async <K extends keyof T> (name: K,
    input: T[K] extends (input: infer I, store: Store) => unknown ? I : never) =>
  {
    if (!tasks[name])
    {
      throw new Error(`Task "${String(name)}" does not exist`);
    }

    // @ts-expect-error: `T` lacks call signature.
    return await tasks[name](input, store) as (
      // @ts-expect-error: Type mismatch against the task signature.
      ReturnType<T[K]> extends Promise<infer R> ? R : ReturnType<T[K]>
    );
  }
}