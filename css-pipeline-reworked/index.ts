//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//

import { createParser } from './parser'
import { runPipelineAsync } from 'generic-pipeline'

// ---

export function createPipeline (
  plugins: Partial<{
    input: ((input: string) => string)[],
    transform: (() => void)[],
    output: ((input: string) => string)[]
  }> = {}
)
{
  const instance =
  {
    plugins: {
      input: [...plugins.input],
      transform: [...plugins.transform],
      output: [...plugins.output]
    },

    async run (input: string): Promise<string>
    {
      const tree = createParser().parse(input);

      // ...
    }
  }

  return instance;
}