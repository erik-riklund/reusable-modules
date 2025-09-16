//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//
// @version 1.0.0
//

import type {
  InputPlugin as PipelineInputPlugin,
  TransformPlugin as PipelineTransformPlugin,
  OutputPlugin as PipelineOutputPlugin
} from 'css-processor/pipeline'

import { createBuildPipeline } from 'css-processor/pipeline'

// ---

type Plugins = Array<InputPlugin | TransformPlugin | OutputPlugin>;

export type InputPlugin = { type: 'input', plugin: PipelineInputPlugin };
export type TransformPlugin = { type: 'transform', plugin: PipelineTransformPlugin };
export type OutputPlugin = { type: 'output', plugin: PipelineOutputPlugin };

// ---

export function createCssProcessor (plugins: Plugins = [])
{
  const pipeline = createBuildPipeline(
    {
      input: plugins.filter((plugin) => plugin.type === 'input').map(({ plugin }) => plugin),
      transform: plugins.filter((plugin) => plugin.type === 'transform').map(({ plugin }) => plugin),
      output: plugins.filter((plugin) => plugin.type === 'output').map(({ plugin }) => plugin)
    }
  );

  return (input: string): Promise<string> => pipeline.run(input);
}