//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//

import { getDeviceSize } from './helpers'

/**
 * Handles `attribute *` and `attribute * is missing` selectors.
 */
export const handleAttributeSelector = (
  { name, keyword }: Record<string, string>) =>
{
  const attribute = name.replace(/\s/g, '-');

  return (keyword === 'is missing') ? `&:not([${attribute}])` : `&[${attribute}]`;
}

/**
 * Handles `attribute * is **` and `attribute * is not **` selectors.
 */
export const handleAttributeValueSelector = (
  { name, keyword, value }: Record<string, string>) =>
{
  const attribute = name.replace(/\s/g, '-');
  value = value.includes(' ') ? `"${value}"` : value;

  return (keyword === 'is') ? `&[${attribute}=${value}]` : `&:not([${attribute}=${value}])`;
}

/**
 * Handles the `base` selector.
 */
export const handleBaseSelector = () => ':root';

/**
 * Handles `with *` and `without *` selectors.
 */
export const handleContextSelector = (
  { selector, relationship, type, name }: Record<string, string>) =>
{
  const combinators = {
    child: '>', sibling: '~', adjacent: '+', descendant: ''
  };

  const prefix = (type === 'group') ? '.' : '';
  const identifier = name.replace(/\s/g, '-');
  const predicate = combinators[relationship as keyof typeof combinators] + prefix + identifier;

  return (selector === 'with') ? `&:has(${predicate})` : `&:not(:has(${predicate}))`;
}

/**
 * Handles `device *` selectors.
 */
export const handleDeviceSelector = ({ device }: Record<string, string>) =>
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
}

/**
 * Handles `device * .. *` selectors.
 */
export const handleDeviceRangeSelector = (
  { fromDevice, toDevice }: Record<string, string>) =>
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
}

/**
 * Handles `group *` and `unique *` selectors.
 */
export const handleIdentifierSelector = (
  { selector, name }: Record<string, string>) =>
{
  const prefix = selector === 'group' ? '&.' : '&#';
  const identifier = name.replace(/\s/g, '-');

  return prefix + identifier;
}

/**
 * Handles `child *`, `sibling *`, `adjacent *`, and `descendant *` selectors.
 */
export const handleRelationshipSelector = (
  { selector, type, name }: Record<string, string>) =>
{
  const combinators = {
    child: '>', sibling: '~', adjacent: '+', descendant: ' '
  };

  const prefix = (type === 'group') ? '.' : '';
  const identifier = name.replace(/\s/g, '-');

  return '&' + combinators[selector as keyof typeof combinators] + prefix + identifier;
}

/**
 * Handles `state is *` and `state is not *` selectors.
 */
export const handleStateSelector = ({ keyword, state }: Record<string, string>) =>
{
  const name = state.replace(/\s/, '-');

  return (keyword === 'is') ? `&.${name}` : `&:not(.${name})`;
}

/**
 * Handles `scope *` selectors.
 */
export const handleScopeSelector = ({ name }: Record<string, string>) =>
{
  const scope = name.includes(' ') ? `"${name}"` : name;

  return `&[data-scope=${scope}]`;
}

/**
 * Handles `when *` and `when not *` selectors.
 */
export const handleWhenSelector = ({ keyword, state }: Record<string, string>) =>
{
  const specialCases = {
    focused: 'focus', 'focused within': 'focus-within', hovered: 'hover'
  }

  const pseudoClass = specialCases[state as keyof typeof specialCases] || state;

  return keyword === 'not' ? `&:not(:${pseudoClass})` : `&:${pseudoClass}`;
}