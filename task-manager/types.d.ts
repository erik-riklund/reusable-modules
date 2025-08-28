//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

//
// A list of named tasks, where each task is an asyncronous function
// that accepts a single argument and returns a value.
//
export type Tasks = {
  [name: string]: (input: unknown, store: Store) => Promise<unknown>
}

//
// The contract for the store that can be used to share data between tasks.
//
export type Store = {
  getValue: <T> (name: string) => T,
  setValue: (name: string, value: unknown) => void
}