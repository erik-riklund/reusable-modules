//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

//
// The contract for the store that can be used to share data between tasks.
//
export interface Store
{
  getValue: <T> (name: string) => T,
  setValue: (name: string, value: unknown) => void
}