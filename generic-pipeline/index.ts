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
    const returnedValue = stage(result);

    if (returnedValue !== undefined)
    {
      result = returnedValue; // Only update if a value was returned.
    }
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
    const returnedValue = await stage(result);

    if (returnedValue !== undefined)
    {
      result = returnedValue; // Only update if a value was returned.
    }
  }

  return result;
}