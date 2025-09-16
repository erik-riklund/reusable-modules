//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//

import { it, expect } from 'bun:test'
import { handleSelectors } from '..'

// ----- handleAttributeSelector ---------------

it('should transform an `attribute *` selector',

  async () =>
  {
    const result = handleSelectors(['attribute "test"']);

    expect(result).toEqual(['&[test]']);
  }
);

// ---

it('should transform an `attribute * is missing` selector',

  async () =>
  {
    const result = handleSelectors(['attribute "test" is missing']);

    expect(result).toEqual(['&:not([test])']);
  }
);

// ----- handleAttributeValueSelector ---------------

it('should transform an `attribute * is **` selector',

  async () =>
  {
    const result = handleSelectors(['attribute "test" is "value"']);

    expect(result).toEqual(['&[test=value]']);
  }
);

// ---

it('should transform an `attribute * is **` selector (with spaces)',

  async () =>
  {
    const result = handleSelectors(['attribute "test" is "value with spaces"']);

    expect(result).toEqual(['&[test="value with spaces"]']);
  }
);

// ---

it('should transform an `attribute * is not **` selector',

  async () =>
  {
    const result = handleSelectors(['attribute "test" is not "value"']);

    expect(result).toEqual(['&:not([test=value])']);
  }
);

// ---

it('should transform an `attribute * is not **` selector (with spaces)',

  async () =>
  {
    const result = handleSelectors(['attribute "test" is not "value with spaces"']);

    expect(result).toEqual(['&:not([test="value with spaces"])']);
  }
);

// ----- handleContextSelector ---------------

it('should transform a `with child element *` selector',

  async () =>
  {
    const result = handleSelectors(['with child element "span"']);

    expect(result).toEqual(['&:has(>span)']);
  }
);

// ---

it('should transform a `with child group *` selector',

  async () =>
  {
    const result = handleSelectors(['with child group "test"']);

    expect(result).toEqual(['&:has(>.test)']);
  }
);

// ---

it('should transform a `without child element *` selector',

  async () =>
  {
    const result = handleSelectors(['without child element "span"']);

    expect(result).toEqual(['&:not(:has(>span))']);
  }
);

// ---

it('should transform a `without child group *` selector',

  async () =>
  {
    const result = handleSelectors(['without child group "test"']);

    expect(result).toEqual(['&:not(:has(>.test))']);
  }
);

// ---

it('should transform a `with sibling element *` selector',

  async () =>
  {
    const result = handleSelectors(['with sibling element "span"']);

    expect(result).toEqual(['&:has(~span)']);
  }
);

// ---

it('should transform a `with sibling group *` selector',

  async () =>
  {
    const result = handleSelectors(['with sibling group "test"']);

    expect(result).toEqual(['&:has(~.test)']);
  }
);

// ---

it('should transform a `without sibling element *` selector',

  async () =>
  {
    const result = handleSelectors(['without sibling element "span"']);

    expect(result).toEqual(['&:not(:has(~span))']);
  }
);

// ---

it('should transform a `without sibling group *` selector',

  async () =>
  {
    const result = handleSelectors(['without sibling group "test"']);

    expect(result).toEqual(['&:not(:has(~.test))']);
  }
);

// ---

it('should transform a `with adjacent element *` selector',

  async () =>
  {
    const result = handleSelectors(['with adjacent element "span"']);

    expect(result).toEqual(['&:has(+span)']);
  }
);

// ---

it('should transform a `with adjacent group *` selector',

  async () =>
  {
    const result = handleSelectors(['with adjacent group "test"']);

    expect(result).toEqual(['&:has(+.test)']);
  }
);

// ---

it('should transform a `without adjacent element *` selector',

  async () =>
  {
    const result = handleSelectors(['without adjacent element "span"']);

    expect(result).toEqual(['&:not(:has(+span))']);
  }
);

// ---

it('should transform a `without adjacent group *` selector',

  async () =>
  {
    const result = handleSelectors(['without adjacent group "test"']);

    expect(result).toEqual(['&:not(:has(+.test))']);
  }
);

// ---

it('should transform a `with descendant element *` selector',

  async () =>
  {
    const result = handleSelectors(['with descendant element "span"']);

    expect(result).toEqual(['&:has(span)']);
  }
);

// ---

it('should transform a `with descendant group *` selector',

  async () =>
  {
    const result = handleSelectors(['with descendant group "test"']);

    expect(result).toEqual(['&:has(.test)']);
  }
);

// ---

it('should transform a `without descendant element *` selector',

  async () =>
  {
    const result = handleSelectors(['without descendant element "span"']);

    expect(result).toEqual(['&:not(:has(span))']);
  }
);

// ---

it('should transform a `without descendant group *` selector',

  async () =>
  {
    const result = handleSelectors(['without descendant group "test"']);

    expect(result).toEqual(['&:not(:has(.test))']);
  }
);

// ----- handleDeviceSelector ---------------

it('should transform a `device *` selector',

  async () =>
  {
    const result = handleSelectors(['device tablet']);

    expect(result).toEqual(['@media screen and(min-width:576px)and(max-width:959px)']);
  }
);

// ---

it('should transform a `device .. *` selector',

  async () =>
  {
    const result = handleSelectors(['device .. tablet']);

    expect(result).toEqual(['@media screen and(max-width:959px)']);
  }
);

// ---

it('should transform a `device * ..` selector',

  async () =>
  {
    const result = handleSelectors(['device tablet ..']);

    expect(result).toEqual(['@media screen and(min-width:576px)']);
  }
);

// ---

it('should transform a `device * .. *` selector',

  async () =>
  {
    const result = handleSelectors(['device tablet .. laptop']);

    expect(result).toEqual(['@media screen and(min-width:576px)and(max-width:1439px)']);
  }
);

// ---

it('should throw an error when no devices are specified',

  async () =>
  {
    const input = 'device ..';

    expect(() => handleSelectors([input])).toThrowError('Invalid device range: No devices specified.');
  }
);

// ----- handleGlobalSelector ---------------

it('should transform a `base` selector',

  async () =>
  {
    const result = handleSelectors(['global']);

    expect(result).toEqual([':root']);
  }
);

// ----- handleIdentifierSelector ---------------

it('should transform a `group *` selector',

  async () =>
  {
    const result = handleSelectors(['group "test"']);

    expect(result).toEqual(['&.test']);
  }
);

// ---

it('should transform a `unique *` selector',

  async () =>
  {
    const result = handleSelectors(['unique "test"']);

    expect(result).toEqual(['&#test']);
  }
);

// ----- handleRelationshipSelector ---------------

it('should transform a `child element *` selector',

  async () =>
  {
    const result = handleSelectors(['child element "span"']);

    expect(result).toEqual(['&>span']);
  }
);

// ---

it('should transform a `child group *` selector',

  async () =>
  {
    const result = handleSelectors(['child group "test"']);

    expect(result).toEqual(['&>.test']);
  }
);

// ---

it('should transform a `sibling element *` selector',

  async () =>
  {
    const result = handleSelectors(['sibling element "span"']);

    expect(result).toEqual(['&~span']);
  }
);

// ---

it('should transform a `sibling group *` selector',

  async () =>
  {
    const result = handleSelectors(['sibling group "test"']);

    expect(result).toEqual(['&~.test']);
  }
);

// ---

it('should transform a `adjacent element *` selector',

  async () =>
  {
    const result = handleSelectors(['adjacent element "span"']);

    expect(result).toEqual(['&+span']);
  }
);

// ---

it('should transform a `adjacent group *` selector',

  async () =>
  {
    const result = handleSelectors(['adjacent group "test"']);

    expect(result).toEqual(['&+.test']);
  }
);

// ---

it('should transform a `descendant element *` selector',

  async () =>
  {
    const result = handleSelectors(['descendant element "span"']);

    expect(result).toEqual(['& span']);
  }
);

// ---

it('should transform a `descendant group *` selector',

  async () =>
  {
    const result = handleSelectors(['descendant group "test"']);

    expect(result).toEqual(['& .test']);
  }
);

// ----- handleStateSelector ---------------

it('should transform a `state is *` selector',

  async () =>
  {
    const result = handleSelectors(['state is "expanded"']);

    expect(result).toEqual(['&.expanded']);
  }
);

// ---

it('should transform a `state is not *` selector',

  async () =>
  {
    const result = handleSelectors(['state is not "expanded"']);

    expect(result).toEqual(['&:not(.expanded)']);
  }
);

// ----- handleWhenSelector ---------------

it('should transform a `when *` selector',

  async () =>
  {
    const result = handleSelectors(['when "disabled"']);

    expect(result).toEqual(['&:disabled']);
  }
);

// ---

it('should transform a `when not *` selector',

  async () =>
  {
    const result = handleSelectors(['when not "disabled"']);

    expect(result).toEqual(['&:not(:disabled)']);
  }
);

// ---

it('should transform a `when *` selector with a special case',

  async () =>
  {
    const result = handleSelectors(['when "focused within"']);

    expect(result).toEqual(['&:focus-within']);
  }
);