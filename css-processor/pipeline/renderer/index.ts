//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//

import type { Block } from '../parser'

// ---

export function createRenderer ()
{
  const self =
  {
    output: {} as Record<string, string[]>,

    // ---
    render (tree: Block[]): string
    {
      tree.forEach(block => self.renderBlock(block));

      const groups = Object.entries(self.output);

      const result = groups.map(([context, blocks]) =>
        blocks.length === 0 ? '' : (
          context === 'root' ? blocks.join('') : `${context}{${blocks.join('')}}`
        )
      );

      return result.join('');
    },

    // ---
    renderBlock (block: Block, context = 'root', parents = []): void
    {
      if (block.selectors[0].startsWith('@media screen'))
      {
        // Responsive media queries are rendered as separate context blocks.

        if (context.includes('screen'))
        {
          throw new RenderingError(
            'Nested media queries are not supported', block
          );
        }

        if (context.includes('-color-scheme'))
        {
          throw new RenderingError(
            'Responsive media queries cannot be nested inside color scheme at-rules', block
          );
        }

        self.renderBlockContent(block.selectors[0], parents, block);
      }

      // ---
      else if (block.selectors[0].startsWith('@media')
        && block.selectors[0].includes('-color-scheme'))
      {
        // Color scheme at-rules are either appended to the end of an existing
        // responsive media query, or rendered as a separate context block.

        if (context.includes('-color-scheme'))
        {
          throw new RenderingError(
            'Nested color scheme at-rules are not supported', block
          );
        }

        const targetContext = !context.startsWith('@media screen') ? block.selectors[0] :
          (context + 'and' + block.selectors[0].replace(/^[^(]+(\([^)]+\))[^)]*$/, '$1'));

        self.renderBlockContent(targetContext, parents, block);
      }

      // ---
      else if (block.selectors[0].startsWith('@'))
      {
        // At-rules that are not media queries are rendered without parent selectors
        // to ensure that their properties are scoped to itself.

        if (context.startsWith('@'))
        {
          throw new RenderingError('Nested at-rules are not allowed', block);
        }

        self.renderBlockContent(block.selectors[0], [], block);
      }

      // ---
      else
      {
        // Blocks that are not at-rules are rendered within the specified context,
        // which is usually 'root' or '@media screen'.

        const selectors = block.selectors.flatMap(
          (selector) => parents.length === 0 ? [selector] :
            parents.map(parent => self.renderSelector(selector, parent))
        );

        self.renderBlockContent(context, selectors, block);
      }
    },

    // ---
    renderBlockContent (context: string, selectors: string[], block: Block): void
    {
      const output = self.output;

      output[context] ??= [];

      if (block.properties && block.properties.length > 0)
      {
        output[context].push(
          `${selectors.join(',')}{${self.renderProperties(block.properties)}}`
        );
      }

      if (block.children && block.children.length > 0)
      {
        for (const child of block.children)
        {
          self.renderBlock(child, context, selectors);
        }
      }
    },

    // ---
    renderSelector (selector: string, parent: string): string
    {
      return selector.includes('&') ? selector.replace(/&/g, parent) : `${parent} ${selector}`;
    },

    // ---
    renderProperties (properties: Array<{ key: string, value: string }>): string
    {
      return properties.map(property => `${property.key}:${property.value}`).join(';');
    }
  }

  return self;
}

// ---

export class RenderingError extends Error
{
  constructor (message: string, block: Block)
  {
    const { start } = block.metadata ?? {};

    super(`Rendering error: ${message} @ line ${start?.line} (column ${start?.column}).`);

    this.name = 'RenderingError';
  }
}