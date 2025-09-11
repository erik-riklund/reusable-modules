//
// Created by Erik Riklund (Gopher) 2025
// <https://github.com/erik-riklund>
//

import { it, expect } from 'bun:test'
import { handleSelectors } from '..'

// ----- handleAttributeSelector ---------------

it('should transform an `attribute *` selector',
  () =>
  {
    const input = 'attribute `test`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&[test]']);
  }
);

it('should transform an `attribute * is missing` selector',
  () =>
  {
    const input = 'attribute `test` is missing';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&:not([test])']);
  }
);

// ----- handleAttributeValueSelector ---------------

it('should transform an `attribute * is **` selector',
  () =>
  {
    const input = 'attribute `test` is "value"';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&[test=value]']);
  }
);

it('should transform an `attribute * is **` selector (with spaces)',
  () =>
  {
    const input = 'attribute `test` is "value with spaces"';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&[test="value with spaces"]']);
  }
);

it('should transform an `attribute * is not **` selector',
  () =>
  {
    const input = 'attribute `test` is not "value"';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&:not([test=value])']);
  }
);

it('should transform an `attribute * is not **` selector (with spaces)',
  () =>
  {
    const input = 'attribute `test` is not "value with spaces"';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&:not([test="value with spaces"])']);
  }
);

// ----- handleBaseSelector ---------------

it('should transform a `base` selector',
  () =>
  {
    const input = 'base';
    const result = handleSelectors([input]);

    expect(result).toEqual([':root']);
  }
);

// ----- handleContextSelector ---------------

it('should transform a `with child element *` selector',
  () =>
  {
    const input = 'with child element `span`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&:has(>span)']);
  }
);

it('should transform a `with child group *` selector',
  () =>
  {
    const input = 'with child group `test`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&:has(>.test)']);
  }
);

it('should transform a `without child element *` selector',
  () =>
  {
    const input = 'without child element `span`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&:not(:has(>span))']);
  }
);

it('should transform a `without child group *` selector',
  () =>
  {
    const input = 'without child group `test`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&:not(:has(>.test))']);
  }
);

it('should transform a `with sibling element *` selector',
  () =>
  {
    const input = 'with sibling element `span`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&:has(~span)']);
  }
);

it('should transform a `with sibling group *` selector',
  () =>
  {
    const input = 'with sibling group `test`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&:has(~.test)']);
  }
);

it('should transform a `without sibling element *` selector',
  () =>
  {
    const input = 'without sibling element `span`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&:not(:has(~span))']);
  }
);

it('should transform a `without sibling group *` selector',
  () =>
  {
    const input = 'without sibling group `test`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&:not(:has(~.test))']);
  }
);

it('should transform a `with adjacent element *` selector',
  () =>
  {
    const input = 'with adjacent element `span`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&:has(+span)']);
  }
);

it('should transform a `with adjacent group *` selector',
  () =>
  {
    const input = 'with adjacent group `test`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&:has(+.test)']);
  }
);

it('should transform a `without adjacent element *` selector',
  () =>
  {
    const input = 'without adjacent element `span`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&:not(:has(+span))']);
  }
);

it('should transform a `without adjacent group *` selector',
  () =>
  {
    const input = 'without adjacent group `test`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&:not(:has(+.test))']);
  }
);

it('should transform a `with descendant element *` selector',
  () =>
  {
    const input = 'with descendant element `span`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&:has(span)']);
  }
);

it('should transform a `with descendant group *` selector',
  () =>
  {
    const input = 'with descendant group `test`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&:has(.test)']);
  }
);

it('should transform a `without descendant element *` selector',
  () =>
  {
    const input = 'without descendant element `span`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&:not(:has(span))']);
  }
);

it('should transform a `without descendant group *` selector',
  () =>
  {
    const input = 'without descendant group `test`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&:not(:has(.test))']);
  }
);

// ----- handleDeviceSelector ---------------

it('should transform a `device *` selector',
  () =>
  {
    const input = 'device laptop';
    const result = handleSelectors([input]);

    expect(result).toEqual([
      '@media screen and(min-width:960px)and(max-width:1439px)'
    ]);
  }
);

it('should transform a `device .. *` selector',
  () =>
  {
    const input = 'device .. tablet';
    const result = handleSelectors([input]);

    expect(result).toEqual(['@media screen and(max-width:959px)']);
  }
);

it('should transform a `device * ..` selector',
  () =>
  {
    const input = 'device tablet ..';
    const result = handleSelectors([input]);

    expect(result).toEqual(['@media screen and(min-width:576px)']);
  }
);

it('should transform a `device * .. *` selector',
  () =>
  {
    const input = 'device tablet .. laptop';
    const result = handleSelectors([input]);

    expect(result).toEqual([
      '@media screen and(min-width:576px)and(max-width:1439px)'
    ]);
  }
);

it('should throw an error when no devices are specified',
  () =>
  {
    const input = 'device ..';

    expect(() => handleSelectors([input])).toThrowError(
      'Invalid device range: No devices specified.'
    );
  }
);

// ----- handleIdentifierSelector ---------------

it('should transform a `group *` selector',
  () =>
  {
    const input = 'group `test`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&.test']);
  }
);

it('should transform a `unique *` selector',
  () =>
  {
    const input = 'unique `test`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&#test']);
  }
);

// ----- handleRelationshipSelector ---------------

it('should transform a `child element *` selector',
  () =>
  {
    const input = 'child element `span`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&>span']);
  }
);

it('should transform a `child group *` selector',
  () =>
  {
    const input = 'child group `test`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&>.test']);
  }
);

it('should transform a `sibling element *` selector',
  () =>
  {
    const input = 'sibling element `span`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&~span']);
  }
);

it('should transform a `sibling group *` selector',
  () =>
  {
    const input = 'sibling group `test`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&~.test']);
  }
);

it('should transform a `adjacent element *` selector',
  () =>
  {
    const input = 'adjacent element `span`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&+span']);
  }
);

it('should transform a `adjacent group *` selector',
  () =>
  {
    const input = 'adjacent group `test`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&+.test']);
  }
);

it('should transform a `descendant element *` selector',
  () =>
  {
    const input = 'descendant element `span`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['& span']);
  }
);

it('should transform a `descendant group *` selector',
  () =>
  {
    const input = 'descendant group `test`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['& .test']);
  }
);

// ----- handleScopeSelector ---------------

it('should transform a `scope *` selector',
  () =>
  {
    const input = 'scope `test`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&[data-scope=test]']);
  }
);

it('should transform a `scope *` selector (with spaces)',
  () =>
  {
    const input = 'scope `test with spaces`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&[data-scope="test with spaces"]']);
  }
);

// ----- handleStateSelector ---------------

it('should transform a `state is *` selector',
  () =>
  {
    const input = 'state is `expanded`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&.expanded']);
  }
);

it('should transform a `state is not *` selector',
  () =>
  {
    const input = 'state is not `expanded`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&:not(.expanded)']);
  }
);

// ----- handleWhenSelector ---------------

it('should transform a `when *` selector',
  () =>
  {
    const input = 'when `disabled`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&:disabled']);
  }
);

it('should transform a `when not *` selector',
  () =>
  {
    const input = 'when not `disabled`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&:not(:disabled)']);
  }
);

it('should transform a `when *` selector with a special case',
  () =>
  {
    const input = 'when `focused within`';
    const result = handleSelectors([input]);

    expect(result).toEqual(['&:focus-within']);
  }
);