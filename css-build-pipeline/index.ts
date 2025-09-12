//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//
// @version 2.0.0
//

import { createParser } from './parser'
import { createTransformer } from './transformer'
import { createRenderer } from './renderer'

import { runPipeline, runPipelineAsync } from 'generic-pipeline'

// ---

import type { Block } from './parser'

export type MutableBlock = ReturnType<
  ReturnType<typeof createTransformer>['exposeBlock']
>;

// ---

export function createBuildPipeline (
  plugins: Partial<{
    input: ((input: string) => string)[],
    transform: ((block: MutableBlock) => Promise<void>)[],
    output: ((result: { output: string, tree: Block[] }) => Promise<string>)[]
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

      const output = createRenderer().render(tree);

      return await runPipelineAsync({ output, tree }, this.plugins.output) as string;
    }
  }

  return instance;
}