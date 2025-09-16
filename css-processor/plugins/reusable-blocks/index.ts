//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//
// @version 2.0.0
//

import type { TransformPlugin } from 'css-processor'

// ---

export const reusableBlocks = (
  prefix = 'reusable block:', separator = ','): TransformPlugin[] =>
{
  type Property = { key: string, value: string };
  const reusableBlocks: Record<string, Array<Property>> = {};

  return [
    {
      type: 'transform',

      plugin: async (block) =>
      {
        const selectors = block.getSelectors();

        if (selectors.some(selector => selector.startsWith(prefix)))
        {
          if (selectors.length > 1)
          {
            throw new Error('A reusable block cannot have more than one selector');
          }

          if (block.hasChildren())
          {
            throw new Error('A reusable block cannot have children');
          }

          const name = normalizeBlockName(selectors[0].slice(prefix.length + 1));

          if (name in reusableBlocks)
          {
            throw new Error(`Non-unique reusable block name (${name})`);
          }

          // Copy the block's properties to the reusable block list.
          reusableBlocks[name] = block.getProperties();

          // Remove all properties from the original block to prevent them from being rendered.
          reusableBlocks[name].forEach(property => block.removeProperty(property.key));
        }

      }
    },

    // ---
    {
      type: 'transform',

      plugin: async (block) =>
      {
        if (block.hasProperty('!include'))
        {
          const includes = block.getProperty('!include')!;
          const reusableBlockList = includes.split(separator);

          for (const blockName of reusableBlockList)
          {
            const normalizedBlockName = normalizeBlockName(blockName);

            if (!(normalizedBlockName in reusableBlocks))
            {
              throw new Error(`Unknown reusable block (${normalizedBlockName})`);
            }

            for (const property of reusableBlocks[normalizedBlockName])
            {
              block.setProperty(property.key, property.value);
            }
          }

          block.removeProperty('!include');
        }
      }
    }
  ];
}

// ---
function normalizeBlockName (name: string): string
{
  return name.trim().replace(/(^['"`]|['"`]$)/g, '');
}