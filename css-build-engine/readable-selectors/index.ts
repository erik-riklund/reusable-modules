//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//

import * as s from './handlers'
import { parseSelector } from './helpers'

import type { TransformPlugin } from 'css-pipeline/types'

/**
 * Defines the mapping between selectors and handlers.
 */
const selectorMap: Record<string, [(segments: Record<string, string>) => string, string[]]> =
{
  // Attribute selectors can be used to apply styles based on
  // the presence or value of attributes.

  'attribute * [is missing]': [
    s.handleAttributeSelector, ['name', 'keyword']
  ],
  'attribute * {is,is not} **': [
    s.handleAttributeValueSelector, ['name', 'keyword', 'value']
  ],

  // The base selector can be used to match the root element.

  'base': [s.handleBaseSelector, []],

  // Relationship selectors can be used to match descendants of other elements.

  '{child,sibling,adjacent,descendant} {element,group} *': [
    s.handleRelationshipSelector, ['selector', 'type', 'name']
  ],

  // Device selectors can be used to apply styles based on screen size.

  'device {mobile,tablet,laptop,desktop}': [
    s.handleDeviceSelector, ['device']
  ],
  'device [mobile,tablet,laptop,desktop] .. [mobile,tablet,laptop,desktop]': [
    s.handleDeviceRangeSelector, ['fromDevice', 'toDevice']
  ],

  // Identifier selectors are classes and unique identifiers.

  '{group,unique} *': [
    s.handleIdentifierSelector, ['selector', 'name']
  ],

  // The scope selector can be used to create styles that only
  // apply within a specific context.

  'scope *': [s.handleScopeSelector, ['name']],

  // State selectors can be used to match elements using custom group-based states.

  'state {is,is not} *': [
    s.handleStateSelector, ['keyword', 'state']
  ],

  // When selectors can be used to target pseudo-classes.

  'when [not] *': [s.handleWhenSelector, ['keyword', 'state']],

  // Context selectors can be used to match elements based on
  // the presence of descendant elements or groups.

  '{with,without} {child,sibling,adjacent,descendant} {element,group} *': [
    s.handleContextSelector, ['selector', 'relationship', 'type', 'name']
  ]
};

/**
 * Transforms the given selectors into standard CSS.
 */
export const handleSelectors = (selectors: string[]): string[] =>
{
  let result = [];

  for (const selector of selectors)
  {
    let done = false;

    for (const [pattern, [handler, labels]] of Object.entries(selectorMap))
    {
      const parsedSelector = parseSelector(pattern, labels, selector);

      if (parsedSelector)
      {
        done = true;
        result.push(handler(parsedSelector));

        break; // move on to the next selector.
      }
    }

    if (!done)
    {
      result.push(selector);
    }
  }

  return result;
}

/**
 * ?
 */
export const readableSelectors = (): TransformPlugin =>
{
  return {
    stage: 'transform',

    handler: (block) =>
    {
      const selectors = block.getSelectors();

      block.setSelectors(handleSelectors(selectors));
    }
  }
}