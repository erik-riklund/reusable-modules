//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

//
// ?
//
export interface Chunk
{
  //
  // ?
  //
  type: 'text' | 'variable' | 'directive',

  //
  // ?
  //
  content: string
}

//
// ?
//
export type TransformedChunk = [number, string];

//
// ?
//
export interface Handler
{
  //
  // ?
  //
  test: (type: Chunk['type']) => boolean,

  //
  // ?
  //
  transform: (index: number, chunk: Chunk) => Promise<TransformedChunk>
}

//
// ?
//
export type RenderFunction = (context: Record<string, any>) => string;