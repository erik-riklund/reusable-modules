//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

//
// Formats a string with the given values. Placeholders, denoted by %1, %2, etc.,
// are replaced with the corresponding values in the values array.
//
export const formatString = (input: string, values: Array<string>) =>
{
  return input.replace(/%(\d+)/g,
    (_match, index: number) => values[index - 1] ?? 'undefined'
  );
}