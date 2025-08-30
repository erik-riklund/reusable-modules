//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { it, expect } from 'bun:test'
import { createPathFilter } from 'path-filter'

// ---

it('should filter paths based on a wildcard pattern',

  () =>
  {
    const filter = createPathFilter('*.txt');

    expect(filter('test.txt')).toBe(true);
    expect(filter('test.js')).toBe(false);
  }
);