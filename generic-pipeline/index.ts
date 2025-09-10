//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//

type Stage<I, R> = (input: I) => Promise<R>;
type Stages = Array<Stage<any, any>>;

// ---

export const createPipeline = <I, R> (stages: Stages) =>
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