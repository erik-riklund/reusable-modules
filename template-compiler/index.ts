//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { RenderFunction } from './types'
import { createPipeline } from 'composable-pipeline'

//
// ?
//
import { parse } from './stages/parse'
import { transform } from './stages/transform'
import { compile } from './stages/compile'
import { outputToString } from './stages/output/string'
import { outputToFunction } from './stages/output/function'

//
// ?
//
export const compileTemplate =
{
  //
  // ?
  //
  toString: createPipeline<string, string>(
    [parse, transform, compile, outputToString]
  ),

  //
  // ?
  //
  toFunction: createPipeline<string, RenderFunction>(
    [parse, transform, compile, outputToFunction]
  )
}