//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { it, expect } from 'bun:test'
import { parse } from '../stages/parse'

import type { Line } from 'template-compiler/types'

// ---

it('should correctly parse a multi-line string with simple content',

  async () =>
  {
    const input = 'Hello World\nThis is a test\n123';
    const expected = [
      [0, 'Hello World'], [1, 'This is a test'], [2, '123']
    ];

    const result = await parse(input);
    expect(result).toEqual(expected as Array<Line>);
  }
);

// ---

it('should trim whitespace from each line',

  async () =>
  {
    const input = '  line one  \nline two\n line three \n';
    const expected = [
      [0, 'line one'], [1, 'line two'], [2, 'line three'],
      [3, ''], // The last empty line after the final newline character.
    ];

    const result = await parse(input);
    expect(result).toEqual(expected as Array<Line>);
  }
);

// ---

it('should correctly parse a single-line string',

  async () =>
  {
    const input = 'Just one line';
    const expected = [[0, 'Just one line']];

    const result = await parse(input);
    expect(result).toEqual(expected as Array<Line>);
  }
);

// ---

it('should return an empty array for an empty string',

  async () =>
  {
    const input = '';
    const expected = [[0, '']];

    const result = await parse(input);
    expect(result).toEqual(expected as Array<Line>);
  }
);

// ---

it('should escape backticks correctly',

  async () =>
  {
    const input = 'This has a `backtick` inside.';
    const expected = [[0, 'This has a \\`backtick\\` inside.']];

    const result = await parse(input);
    expect(result).toEqual(expected as Array<Line>);
  }
);

// ---

it('should handle Windows line endings (\\r\\n)',

  async () =>
  {
    const input = 'First line\r\nSecond line';
    const expected = [[0, 'First line'], [1, 'Second line']];

    const result = await parse(input);
    expect(result).toEqual(expected as Array<Line>);
  }
);

// ---

it('should handle multiple empty lines',

  async () =>
  {
    const input = 'Line 1\n\nLine 3\n\n';
    const expected = [
      [0, 'Line 1'], [1, ''], [2, 'Line 3'], [3, ''], [4, ''],
    ];

    const result = await parse(input);
    expect(result).toEqual(expected as Array<Line>);
  }
);