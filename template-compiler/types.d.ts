//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

//
// ?
//
export type Line = [number, string];

//
// ?
//
export interface Handler
{
  //
  // ?
  //
  test: (line: string) => boolean,

  //
  // ?
  //
  transform: (input: Line) => Promise<Line>
}

//
// ?
//
export type RenderFunction = (context: Record<string, any>) => string;