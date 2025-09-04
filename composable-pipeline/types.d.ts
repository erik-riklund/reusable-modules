//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

type Stage<I, R> = (input: I) => Promise<R>;
export type Stages = Array<Stage<any, any>>;
