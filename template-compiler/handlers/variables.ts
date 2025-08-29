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
    const [index, line] = input;

    return [
      index,

      line.replace(
        /\{\$(\w+(?:\.\w+)*)(!?)}/g,

        (_, variable, encoded) =>
        {
          const sanitize = encoded !== '!';
          const output = `typeof ${variable} !== 'undefined' ? ${variable} : context.${variable} ?? 'undefined'`;

          return `\${${sanitize ? `sanitize(${output})` : output}}`;
        }
      )
    ];
  }
}