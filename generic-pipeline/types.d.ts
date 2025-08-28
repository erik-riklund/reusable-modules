//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

export namespace Pipeline
{
  //
  // A single stage in a sequential pipeline.
  //
  type Stage<I, R> = (input: I) => Promise<R>;

  //
  // A list of stages in a sequential pipeline.
  //
  type Stages = Array<Stage<unknown, unknown>>;
}