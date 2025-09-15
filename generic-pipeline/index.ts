//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//
// @version 2.0.0
//

export function runPipeline<
  I extends unknown = any, R extends unknown = any> (
    input: I, stages: ((input: unknown) => unknown)[]): R
{
  let result = input;

  for (const stage of stages)
  {
    const returnedValue = stage(result);

    if (returnedValue !== undefined)
    {
      // @ts-expect-error: Type 'unknown' is not assignable to type 'I'.

      result = returnedValue; // Only update if a value was returned.
    }
  }

  return result as unknown as R;
}

// ---

export async function runPipelineAsync<
  I extends unknown = any, R extends unknown = any> (
    input: I, stages: ((input: unknown) => Promise<unknown>)[]): Promise<R>
{
  let result = input;

  for (const stage of stages)
  {
    const returnedValue = await stage(result);

    if (returnedValue !== undefined)
    {
      // @ts-expect-error: Type 'unknown' is not assignable to type 'I'.

      result = returnedValue; // Only update if a value was returned.
    }
  }

  return result as unknown as R;
}