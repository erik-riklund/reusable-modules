//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//

import { getDeviceSize } from './helpers'

// ---

export const handle =
{
  attributeSelector: ({ name, keyword }: Record<string, string>) =>
  {
    const attribute = name.replace(/\s/g, '-');

    return (keyword === 'is missing') ? `&:not([${attribute}])` : `&[${attribute}]`;
  },

  // ---
  attributeValueSelector: ({ name, keyword, value }: Record<string, string>) =>
  {
    const attribute = name.replace(/\s/g, '-');
    value = value.includes(' ') ? `"${value}"` : value;

    return (keyword === 'is') ? `&[${attribute}=${value}]` : `&:not([${attribute}=${value}])`;
  },

  // ---
  contextSelector: ({ selector, relationship, type, name }: Record<string, string>) =>
  {
    const combinators = { child: '>', sibling: '~', adjacent: '+', descendant: '' };

    const prefix = (type === 'group') ? '.' : '';
    const identifier = name.replace(/\s/g, '-');
    const predicate = combinators[relationship as keyof typeof combinators] + prefix + identifier;

    return (selector === 'with') ? `&:has(${predicate})` : `&:not(:has(${predicate}))`;
  },

  // ---
  deviceSelector: ({ device }: Record<string, string>) =>
  {
    let mediaQuery = `@media screen `;
    const { lower, upper } = getDeviceSize(device);

    if (lower)
    {
      mediaQuery += `and(min-width:${lower})`;
    }

    if (upper)
    {
      mediaQuery += `and(max-width:${upper})`;
    }

    return mediaQuery;
  },

  // ---
  deviceRangeSelector: ({ fromDevice, toDevice }: Record<string, string>) =>
  {
    let mediaQuery = `@media screen `;

    if (fromDevice)
    {
      const { lower } = getDeviceSize(fromDevice);

      mediaQuery += `and(min-width:${lower})`;
    }

    if (toDevice)
    {
      const { upper } = getDeviceSize(toDevice);

      mediaQuery += `and(max-width:${upper})`;
    }

    if (mediaQuery === '@media screen ')
    {
      throw new Error(
        `Invalid device range: No devices specified.`
      );
    }

    return mediaQuery;
  },

  // ---
  globalSelector: () => ':root',

  // ---
  identifierSelector: ({ selector, name }: Record<string, string>) =>
  {
    const prefix = selector === 'group' ? '&.' : '&#';
    const identifier = name.replace(/\s/g, '-');

    return prefix + identifier;
  },

  // ---
  relationshipSelector: ({ selector, type, name }: Record<string, string>) =>
  {
    const combinators = {
      child: '>', sibling: '~', adjacent: '+', descendant: ' '
    };

    const prefix = (type === 'group') ? '.' : '';
    const identifier = name.replace(/\s/g, '-');

    return '&' + combinators[selector as keyof typeof combinators] + prefix + identifier;
  },

  // ---
  stateSelector: ({ keyword, state }: Record<string, string>) =>
  {
    const name = state.replace(/\s/, '-');

    return (keyword === 'is') ? `&.${name}` : `&:not(.${name})`;
  },

  // ---
  whenSelector: ({ keyword, state }: Record<string, string>) =>
  {
    const specialCases = {
      focused: 'focus', 'focused within': 'focus-within', hovered: 'hover'
    }

    const pseudoClass = specialCases[state as keyof typeof specialCases] || state;

    return keyword === 'not' ? `&:not(:${pseudoClass})` : `&:${pseudoClass}`;
  }
}