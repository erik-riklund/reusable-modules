//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { it, expect } from 'bun:test'
import { translatePattern } from 'path-filter'

// ---

it('should escape special characters',

  () =>
  {
    const pattern = '+test.txt';

    expect(translatePattern(pattern)).toBe('^\\+test\\.txt$');
  }
);

// ---

it('should translate a wildcard matching non-slashes',

  () =>
  {
    const pattern = '*.txt';

    expect(translatePattern(pattern)).toBe('^[^/]+\\.txt$');
  }
);

// ---

it('should translate a wildcard matching slashes',

  () =>
  {
    const pattern = '**/test.txt';

    expect(translatePattern(pattern)).toBe('^([^/]+/)*test\\.txt$');
  }
);

// ---

it('should translate a group of values',

  () =>
  {
    const pattern = '{a,b,c}/test.txt';

    expect(translatePattern(pattern)).toBe('^(a|b|c)/test\\.txt$');
  }
);

// ---

it('should translate nested groups of values',

  () =>
  {
    const pattern = '{a,{b,c},d}/test.txt';

    expect(translatePattern(pattern)).toBe('^(a|(b|c)|d)/test\\.txt$');
  }
);