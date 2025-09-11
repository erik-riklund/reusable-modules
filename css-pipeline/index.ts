//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//
// @version 1.0.0
//

import type {
  Plugin,
  InputPlugin,
  TransformPlugin,
  OutputPlugin
} from './types'

import { createTreeFromString } from './parser'
import { transformTree } from './transformer'
import { renderTreeToString } from './renderer'

// ---

export const createCssPipeline = (plugins: Plugin[] = []) =>
{
  const [
    inputPlugins,
    transformPlugins,
    outputPlugins
  ] = groupPluginsByStage(plugins);

  return (input: string): string =>
  {
    for (const plugin of inputPlugins)
    {
      const result = plugin.handler(input);

      if (typeof result !== 'string')
      {
        throw new Error('Input plugins must return a string');
      }

      input = result;
    }

    const tree = createTreeFromString(input);

    console.log(Bun.inspect(tree, { colors: true }));

    transformTree(tree, transformPlugins);

    let output = renderTreeToString(tree);

    for (const plugin of outputPlugins)
    {
      const result = plugin.handler(output, tree);

      if (typeof result !== 'string')
      {
        throw new Error('Output plugins must return a string');
      }

      output = result;
    }

    return output;
  }
}

// ---

const groupPluginsByStage = (plugins: Plugin[]) =>
{
  type GroupedPlugins = [
    InputPlugin[], TransformPlugin[], OutputPlugin[]
  ];

  return [
    plugins.filter((plugin) => plugin.stage === 'input'),
    plugins.filter((plugin) => plugin.stage === 'transform'),
    plugins.filter((plugin) => plugin.stage === 'output')
  ] as GroupedPlugins;
}