//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { formatString } from 'format-string'
import type { Handler } from 'template-compiler/types'

//
// ?
//
export const replaceVariables: Handler =
{
  test: (type) => type === 'variable',

  transform: async (index, { content }) =>
  {
    return [
      index,

      content.replace(
        /\{\$(\w+(?:\.\w+)*)(!?)}/g,

        (_, variable: string, encoded: string) =>
        {
          const sanitize = encoded !== '!';
          const safeVariable = variable.replace(/\./g, '?.');
          const topLevelVariable = variable.split('.')[0];

          const output = formatString(
            "typeof %1 !== 'undefined' ? %2 : context.%2 ?? 'undefined'",
            [topLevelVariable, safeVariable]
          );

          return `append(${sanitize ? `sanitize(${output})` : output});`;
        }
      )
    ];
  }
}