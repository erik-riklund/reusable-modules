//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Stage } from 'composable-pipeline/types'

//
// ?
//
export const outputToString: Stage<Array<string>, string> = async (input) =>
{
  return input.join('\n');
}