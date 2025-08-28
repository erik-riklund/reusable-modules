//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Line } from 'template-compiler/types'
import type { Stage } from 'composable-pipeline/types'

//
// Parses a string into an array of lines,
// including the index to allow asynchronous processing.
//
export const parse: Stage<string, Array<Line>> = async (input) =>
{
  const lines = input.split(/\r?\n/);

  return lines.map((line, index) => [index, line.trim()]);
}