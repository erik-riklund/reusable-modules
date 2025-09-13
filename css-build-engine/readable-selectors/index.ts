//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//
// @version 2.0.0
//

import { handle } from './handlers'
import { parseSelector } from './helpers'

import type { TransformPlugin } from 'css-build-engine'

// ---

const selectorMap: Record<string, [(segments: Record<string, string>) => string, string[]]> =
{
  // Attribute selectors can be used to apply styles based on
  // the presence or value of attributes.

  'attribute * [is missing]': [
    handle.attributeSelector, ['name', 'keyword']
  ],
  'attribute * {is,is not} **': [
    handle.attributeValueSelector, ['name', 'keyword', 'value']
  ],

  // Relationship selectors can be used to match descendants of other elements.

  '{child,sibling,adjacent,descendant} {element,group} *': [
    handle.relationshipSelector, ['selector', 'type', 'name']
  ],

  // Device selectors can be used to apply styles based on screen size.

  'device {mobile,tablet,laptop,desktop}': [
    handle.deviceSelector, ['device']
  ],
  'device [mobile,tablet,laptop,desktop] .. [mobile,tablet,laptop,desktop]': [
    handle.deviceRangeSelector, ['fromDevice', 'toDevice']
  ],

  // The base selector can be used to match the root element.

  'global': [handle.globalSelector, []],

  // Identifier selectors are classes and unique identifiers.

  '{group,unique} *': [
    handle.identifierSelector, ['selector', 'name']
  ],

  // State selectors can be used to match elements using custom group-based states.

  'state {is,is not} *': [
    handle.stateSelector, ['keyword', 'state']
  ],

  // When selectors can be used to target pseudo-classes.

  'when [not] *': [handle.whenSelector, ['keyword', 'state']],

  // Context selectors can be used to match elements based on
  // the presence of descendant elements or groups.

  '{with,without} {child,sibling,adjacent,descendant} {element,group} *': [
    handle.contextSelector, ['selector', 'relationship', 'type', 'name']
  ]
};

// ---

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

// ---

export const readableSelectors = (): TransformPlugin =>
{
  return {
    type: 'transform',

    plugin: async (block) =>
    {
      const selectors = block.getSelectors();

      block.setSelectors(handleSelectors(selectors));
    }
  }
}