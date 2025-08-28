//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//
// @version 1.0.0
//

import type { RenderFunction } from './types'
import { createPipeline } from 'composable-pipeline'

//
// The stages of the template compiler, each isolated and composable.
//
import { parse } from './stages/parse'
import { transform } from './stages/transform'
import { compile } from './stages/compile'
import { outputToString } from './stages/output/string'
import { outputToFunction } from './stages/output/function'

//
// The template compiler module, providing two entry points: `toString` and `toFunction`.
// These create a render function, either stringified or executable.
//
export const compileTemplate =
{
  toString: createPipeline<string, string>(
    [parse, transform, compile, outputToString]
  ),

  toFunction: createPipeline<string, RenderFunction>(
    [parse, transform, compile, outputToFunction]
  )
}