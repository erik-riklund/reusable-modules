//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Stage } from 'composable-pipeline/types'
import type { RenderFunction } from 'template-compiler/types'

//
// ?
//
export const outputToFunction: Stage<Array<string>, RenderFunction> = async (input) =>
{
  return (context) => input.join('\n');
}