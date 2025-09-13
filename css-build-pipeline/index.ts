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

export type InputPlugin = (input: string) => string;
export type TransformPlugin = (block: MutableBlock) => Promise<void>;
export type OutputPlugin = (result: { output: string, tree: Block[] }) => Promise<string>;

// ---

export function createBuildPipeline (
  plugins: Partial<{ input: InputPlugin[], transform: TransformPlugin[], output: OutputPlugin[] }> = {}
)
{
  const self =
  {
    plugins: {
      input: [...plugins.input],
      transform: [...plugins.transform],
      output: [...plugins.output]
    },

    async run (input: string): Promise<string>
    {
      const tree = createParser().parse(
        runPipeline(input, self.plugins.input) as string
      );

      await createTransformer().transform(tree, self.plugins.transform);

      const output = createRenderer().render(tree);
      const result = (self.plugins.output.length === 0) ? output
        : await runPipelineAsync({ output, tree }, self.plugins.output);

      return result as string;
    }
  }

  return self;
}