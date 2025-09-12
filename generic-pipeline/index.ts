//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//
// @version 2.0.0
//

export function runPipeline (
  input: unknown, stages: ((input: unknown) => unknown)[]
)
{
  let result = input;

  for (const stage of stages)
  {
    result = stage(result);
  }

  return result;
}

// ---

export async function runPipelineAsync (
  input: unknown, stages: ((input: unknown) => Promise<unknown>)[]
)
{
  let result = input;

  for (const stage of stages)
  {
    result = await stage(result);
  }

  return result;
}