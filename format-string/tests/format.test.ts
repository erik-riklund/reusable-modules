//
// Copyright 2025 Erik Riklund (Gopher)
// <https://github.com/erik-riklund>
//

import { it, expect } from 'bun:test'
import { formatString } from 'format-string'

// ---

it('should replace placeholders with correct values',

  () =>
  {
    const input = 'Hello, %1! Today is %2.';
    const values = ['World', 'a great day'];

    const result = formatString(input, values);
    expect(result).toBe('Hello, World! Today is a great day.');
  }
);

// ---

it('should handle multiple occurrences of the same placeholder',

  () =>
  {
    const input = 'The value is %1, and it is also %1.';
    const values = ['42'];

    const result = formatString(input, values);
    expect(result).toBe('The value is 42, and it is also 42.');
  }
);

// ---

it('should replace with "undefined" for missing values',

  () =>
  {
    const input = 'User %1 logged in from %2.';
    const values = ['Alice'];

    const result = formatString(input, values);
    expect(result).toBe('User Alice logged in from undefined.');
  }
);

// ---

it('should return the original string if no placeholders are present',

  () =>
  {
    const input = 'This is a test string.';
    const values = ['A', 'B', 'C'];

    const result = formatString(input, values);
    expect(result).toBe('This is a test string.');
  }
);

// ---

it('should handle placeholders in a non-sequential order',

  () =>
  {
    const input = 'The second value is %2 and the first is %1.';
    const values = ['second', 'first'];

    const result = formatString(input, values);
    expect(result).toBe('The second value is first and the first is second.');
  }
);

// ---

it('should return an empty string for empty input',

  () =>
  {
    const input = '';
    const values = ['Hello', 'World'];

    const result = formatString(input, values);
    expect(result).toBe('');
  }
);

// ---

it('should replace all placeholders with "undefined" when values array is empty',

  () =>
  {
    const input = 'Value one: %1. Value two: %2.';
    const values: string[] = [];

    const result = formatString(input, values);
    expect(result).toBe('Value one: undefined. Value two: undefined.');
  }
);
