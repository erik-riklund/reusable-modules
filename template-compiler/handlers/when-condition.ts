//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Handler } from 'template-compiler/types'

//
// ?
//
export const whenCondition: Handler =
{
  test: (type: string) => 
  {
    return type === 'when';
  },

  transform: async ([index, line]) => 
  {
    return [
      index,

      line.replace(
        /^when(?:\s+not)?\s+\$(\w+(?:\.\w+)*)$/,

        (_, modifier: string, variable: string) =>
        {
          return '?';
        }
      )
    ];
  }
}