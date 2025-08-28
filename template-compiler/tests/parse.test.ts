//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { it, expect } from 'bun:test'
import { parse } from '../stages/parse'

// ---

it('should parse a string into an array with line numbers',

  async () =>
  {
    const result = await parse('foo\nbar\nbaz\n');

    expect(result).toEqual([[0, 'foo'], [1, 'bar'], [2, 'baz'], [3, '']]);
  }
)