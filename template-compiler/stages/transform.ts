//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import type { Stage } from 'composable-pipeline/types'
import type { Chunk, Handler } from 'template-compiler/types'
import { OPENING_TAG, CLOSING_TAG } from './parse'

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
export const transform: Stage<Array<Chunk>, Array<string>> = async (input) =>
{


  // const result: Array<string> = [];
  // const processedLines: Array<Promise<Line>> = [];

  // for (const [index, line] of lines)
  // {
  //   if (line.startsWith(OPENING_TAG))
  //   {
  //     for (const handler of handlers)
  //     {
  //       if (handler.test(line))
  //       {
  //         processedLines.push(
  //           handler.transform([index, line.slice(OPENING_TAG.length)])
  //         );

  //         break; // move on to the next line.
  //       }
  //     }
  //   }
  //   else if (line === CLOSING_TAG)
  //   {
  //     processedLines.push(Promise.resolve([index, '})}']));
  //   }
  //   else if (replaceVariables.test(line))
  //   {
  //     processedLines.push(replaceVariables.transform([index, line]));
  //   }
  //   else
  //   {
  //     // the line requires no special processing.
  //     processedLines.push(Promise.resolve([index, line]));
  //   }
  // }

  // const transformedLines = await Promise.all(processedLines);
  // for (const [index, line] of transformedLines) result[index] = line;

  // return result;
}