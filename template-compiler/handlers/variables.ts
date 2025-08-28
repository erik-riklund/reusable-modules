//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Handler } from 'template-compiler/types'

//
// ?
//
export const replaceVariables: Handler =
{
  test: (line) =>
  {
    return line.includes('{$');
  },

  transform: async (input) =>
  {
    return Promise.resolve(input);
  }
}