//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

//
// An asyncronous stage in a sequential pipeline.
//
type Stage<I, R> = (input: I) => Promise<R>;

//
// A list of stages in a sequential pipeline.
//
export type Stages = Array<Stage<any, any>>;
