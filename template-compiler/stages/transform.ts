//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Stage } from 'composable-pipeline/types'
import type { Line, Handler } from 'template-compiler/types'

//
// ?
//
export const OPENING_TAG = '@';
export const CLOSING_TAG = '===';

//
// ?
//
import { replaceVariables } from 'template-compiler/handlers/variables'

//
// ?
//
const handlers: Array<Handler> = [];

//
// ?
//
export const transform: Stage<Array<Line>, Array<string>> = async (lines) =>
{
  const result: Array<string> = [];
  const processedLines: Array<Promise<Line>> = [];

  for (const [index, line] of lines)
  {
    if (line.startsWith(OPENING_TAG))
    {
      // ...
    }
    else if (line === CLOSING_TAG)
    {
      // ...
    }
    else if (replaceVariables.test(line))
    {
      //
      // ?
      //
      processedLines.push(replaceVariables.transform([index, line]));
    }
    else
    {
      //
      // The line requires no special processing.
      //
      processedLines.push(Promise.resolve([index, line]));
    }
  }

  const transformedLines = await Promise.all(processedLines);
  for (const [index, line] of transformedLines) result[index] = line;

  return result;
}