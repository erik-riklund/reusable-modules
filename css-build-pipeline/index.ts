//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//

import { createParser } from './parser'
import { createTransformer } from './transformer'
import { runPipeline } from 'generic-pipeline'

// ---

export type MutableBlock = ReturnType<
  ReturnType<typeof createTransformer>['exposeBlock']
>;

// ---

export function createBuildPipeline (
  plugins: Partial<{
    input: ((input: string) => string)[],
    transform: ((block: MutableBlock) => Promise<void>)[],
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
      const tree = createParser().parse(
        runPipeline(input, this.plugins.input) as string
      );

      await createTransformer().transform(tree, this.plugins.transform);

      // ...

      return ''; // @note: dummy return.
    }
  }

  return instance;
}