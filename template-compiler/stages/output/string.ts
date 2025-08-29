//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Stage } from 'composable-pipeline/types'

//
// Creates a stringified render function.
//
export const outputToString: Stage<string, string> = async (body) =>
{
  return `
  (context) =>
  {
    ${body}
  }
  `;
}