//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Pipeline } from './types'

//
// Creates a sequential pipeline from a list of asyncronous stages.
//
export const createPipeline = <I, R> (stages: Pipeline.Stages) =>
{
  return async (input: I) =>
  {
    let result: unknown = input;

    for (const stage of stages)
    {
      result = await stage(result);
    }

    return result as R;
  }
}