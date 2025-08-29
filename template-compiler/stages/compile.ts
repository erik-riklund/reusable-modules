//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Stage } from 'composable-pipeline/types'

//
// ?
//
export const compile: Stage<Array<string>, string> = async (input) =>
{
  const body = input.join('\n');

  return `return \`${body}\`;`;
}