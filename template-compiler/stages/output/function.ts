//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Stage } from 'composable-pipeline/types'
import type { RenderFunction } from 'template-compiler/types'

//
// Creates a render function from a string.
//
export const outputToFunction: Stage<string, RenderFunction> = async (input) =>
{
  return new Function('context', input) as RenderFunction;
}