//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//

import { createBuildPipeline } from '..'
import { runPipelineAsync } from 'generic-pipeline'

import type { Block } from '../parser'

export type Plugin = ReturnType<typeof createBuildPipeline>['plugins']['transform'][0];

// ---

export function createTransformer ()
{
  const instance =
  {
    exposeBlock (block: Block)
    {
      const mutableBlock =
      {
        hasChildren (): boolean
        {
          return block.children !== undefined && block.children.length > 0;
        },

        // ---
        hasSelector (selector: string): boolean
        {
          return block.selectors.includes(selector);
        },

        // ---
        getSelectors (): string[]
        {
          return [...block.selectors];
        },

        // ---
        addSelector (selector: string): void
        {
          if (!block.selectors.includes(selector))
          {
            // idempotent operation.

            block.selectors.push(selector);
          }
        },

        // ---
        removeSelector (selector: string): void
        {
          block.selectors = block.selectors.filter(s => s !== selector);
        },

        // ---
        replaceSelector (oldSelector: string, newSelector: string): void
        {
          block.selectors = block.selectors.map(
            selector => selector === oldSelector ? newSelector : selector
          );
        },

        // ---
        setSelectors (newSelectors: string[]): void
        {
          // @note: add validation to make sure selectors are valid.

          block.selectors = [...newSelectors];
        },

        // ---
        hasProperty (key: string): boolean
        {
          return block.properties?.some(property => property.key === key) === true;
        },

        // ---
        getProperty (key: string): string | undefined
        {
          return block.properties?.find(property => property.key === key)?.value;
        },

        // ---
        getProperties (): Array<{ key: string, value: string }>
        {
          return [...block.properties!.map(property => ({ ...property }))];
        },

        // ---
        setProperty (key: string, value: string): void
        {
          const property = block.properties!.find(property => property.key === key);

          if (property)
          {
            property.value = value;
          }
          else
          {
            block.properties!.push({ key, value });
          }
        },

        // ---
        removeProperty (key: string): void
        {
          block.properties = block.properties!.filter(property => property.key !== key);
        }
      }

      return mutableBlock;
    },

    // ---
    async transform (tree: Block[], plugins: Plugin[]): Promise<void>
    {
      const operations = [];

      for (const block of tree)
      {
        const mutableBlock = this.exposeBlock(block);

        try
        {
          operations.push(runPipelineAsync(mutableBlock, plugins));

          if (block.children)
          {
            operations.push(this.transform(block.children, plugins));
          }
        }
        catch (error)
        {
          throw new Error(
            `Transformation error: ${error.message}` +
            (block.metadata ? ` @ line ${block.metadata.start.line}` : '')
          );
        }
      }

      await Promise.all(operations);
    }
  }

  return instance;
}